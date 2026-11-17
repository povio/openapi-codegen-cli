import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";

import { generateFilesFromNativeOpenAPI } from "../native/generateFilesFromNativeOpenAPI";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { resolveConfig } from "./core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

const root = process.cwd();

const queryParam = (name: string, type: string) => ({ name, in: "query", required: false, schema: { type } });
const jsonResponse = (schema: object) => ({
  "200": { description: "OK", content: { "application/json": { schema } } },
});

const spec = {
  openapi: "3.0.3",
  info: { title: "Cursor pagination", version: "1" },
  paths: {
    // `page` and `cursor`: cursor pagination wins and `page` is left unset.
    "/items": {
      get: {
        operationId: "Items_list",
        tags: ["Items"],
        parameters: [
          queryParam("page", "integer"),
          queryParam("cursor", "string"),
          queryParam("limit", "integer"),
          queryParam("order", "string"),
        ],
        responses: jsonResponse({ $ref: "#/components/schemas/ItemPage" }),
      },
    },
    // The next cursor comes from an `allOf` member; the endpoint has an ACL check and a path param.
    "/threads/{threadId}/messages": {
      get: {
        operationId: "Items_messages",
        tags: ["Items"],
        "x-acl": [{ action: "read", subject: "Thread" }],
        parameters: [
          { name: "threadId", in: "path", required: true, schema: { type: "string" } },
          queryParam("cursor", "string"),
        ],
        responses: jsonResponse({
          allOf: [
            { $ref: "#/components/schemas/CursorPage" },
            {
              type: "object",
              required: ["messages"],
              properties: { messages: { type: "array", items: { type: "string" } } },
            },
          ],
        }),
      },
    },
    // A cursor without a next cursor in the response is not paginated.
    "/totals": {
      get: {
        operationId: "Items_totals",
        tags: ["Items"],
        parameters: [queryParam("cursor", "string"), queryParam("limit", "integer")],
        responses: jsonResponse({ type: "object", properties: { total: { type: "integer" } } }),
      },
    },
    // Page-number pagination in the same module.
    "/archive": {
      get: {
        operationId: "Items_archive",
        tags: ["Items"],
        parameters: [queryParam("page", "integer"), queryParam("limit", "integer")],
        responses: jsonResponse({ $ref: "#/components/schemas/ItemPage" }),
      },
    },
  },
  components: {
    schemas: {
      ItemPage: {
        type: "object",
        required: ["items", "nextCursor"],
        properties: {
          items: { type: "array", items: { type: "string" } },
          page: { type: "integer" },
          limit: { type: "integer" },
          totalItems: { type: "integer" },
          nextCursor: { type: "string", nullable: true },
        },
      },
      CursorPage: { type: "object", properties: { nextCursor: { type: "string", nullable: true } } },
    },
  },
};

const getOptions = (overrides: Partial<GenerateOptions> = {}) =>
  resolveConfig({
    params: {},
    fileConfig: {
      output: "output",
      infiniteQueries: true,
      restClientImportPath: "@test/rest",
      ...overrides,
    },
  });

const getQueries = (files: { fileName: string; content: string }[]) =>
  files.find(({ fileName }) => fileName.endsWith("items.queries.ts"))!.content;

describe("cursor infinite queries", () => {
  test("cursor endpoints page by the returned cursor, page endpoints by page number", () => {
    const queries = getQueries(generateCodeFromOpenAPIDoc(spec as never, getOptions()));

    expect(queries).toContain(
      'itemsListInfinite: (limit?: number, order?: string) => [...keys.all, "/items", "infinite", limit, order, "cursor-v1"] as const,',
    );
    expect(queries).toContain(
      'itemsMessagesInfinite: (threadId: string) => [...keys.all, "/threads/:threadId/messages", "infinite", threadId, "cursor-v1"] as const,',
    );
    expect(queries).toContain(
      'itemsArchiveInfinite: (limit?: number) => [...keys.all, "/archive", "infinite", limit] as const,',
    );
    expect(queries).not.toContain("itemsTotalsInfinite");

    expect(queries).toContain(
      "queryFn: ({ pageParam, signal }: { pageParam: string | undefined; signal: AbortSignal }) => ItemsApi.itemsList(undefined, pageParam, limit, order, { ...config, signal }),",
    );
    expect(queries).toContain("initialPageParam: undefined as string | undefined,");
    expect(queries).toContain(
      "getNextPageParam: ({ nextCursor }: Awaited<ReturnType<typeof ItemsApi.itemsList>>) => nextCursor ?? undefined,",
    );
    expect(queries).toContain("options?: AppCursorInfiniteQueryOptions<typeof ItemsApi.itemsList, TData>");
    // The ACL check override keeps the cursor page param.
    expect(queries).toContain(
      "queryFn: async ({ pageParam, signal }: { pageParam: string | undefined; signal: AbortSignal }) => {",
    );
    // Page-number pagination is unchanged.
    expect(queries).toContain("ItemsApi.itemsArchive(pageParam, limit, { ...config, signal })");
    expect(queries).toContain("options?: AppInfiniteQueryOptions<typeof ItemsApi.itemsArchive, TData>");
    expect(queries).toContain("type AppInfiniteQueryOptions, type AppCursorInfiniteQueryOptions");
  });

  test("custom cursor names, and an empty cursor name disables cursor pagination", () => {
    const renamed = JSON.parse(
      JSON.stringify(spec).replaceAll('"cursor"', '"after"').replaceAll('"nextCursor"', '"next-cursor"'),
    );
    const queries = getQueries(
      generateCodeFromOpenAPIDoc(
        renamed,
        getOptions({
          infiniteQueryParamNames: { page: "page", cursor: "after" },
          infiniteQueryResponseParamNames: {
            page: "page",
            totalItems: "totalItems",
            limit: "limit",
            nextCursor: "next-cursor",
          },
        }),
      ),
    );
    expect(queries).toContain("ItemsApi.itemsList(undefined, pageParam, limit, order, { ...config, signal })");
    expect(queries).toContain(
      'getNextPageParam: ({ "next-cursor": nextCursor }: Awaited<ReturnType<typeof ItemsApi.itemsList>>) => nextCursor ?? undefined,',
    );

    const disabled = getQueries(
      generateCodeFromOpenAPIDoc(spec as never, getOptions({ infiniteQueryParamNames: { page: "page", cursor: "" } })),
    );
    expect(disabled).not.toContain("cursor-v1");
    expect(disabled).not.toContain("itemsMessagesInfinite");
    // `/items` still has `page`, so it is page-number paginated.
    expect(disabled).toContain("ItemsApi.itemsList(pageParam, cursor, limit, order, { ...config, signal })");
  });

  test.each(["cursor", "page"])("a required %s parameter keeps the endpoint off cursor pagination", (name) => {
    const required = structuredClone(spec);
    for (const param of required.paths["/items"].get.parameters) {
      if (param.name === name) param.required = true;
    }
    const options = getOptions();
    const files = generateCodeFromOpenAPIDoc(required as never, options);
    const queries = getQueries(files);
    expect(queries).not.toContain('"/items", "infinite", limit, order, "cursor-v1"');
    expect(generateFilesFromNativeOpenAPI(JSON.stringify(required), false, options)).toEqual(files);
  });

  test.each([
    { name: "full native", overrides: {} },
    { name: "native rest client", overrides: { restClient: "native" as const, lazySchemas: true } },
    { name: "jsdoc", overrides: { generateJsDoc: true, tsNamespaces: false } },
  ])("renders identically in both renderers: $name", ({ overrides }) => {
    const options = getOptions(overrides);
    const expected = generateCodeFromOpenAPIDoc(spec as never, options);
    expect(getQueries(expected)).toContain("cursor-v1");
    expect(generateFilesFromNativeOpenAPI(JSON.stringify(spec), false, options)).toEqual(expected);
  });

  // These options render the natively extracted endpoints with the TypeScript query generator.
  test.each([
    { name: "workspace context", overrides: { workspaceContext: ["threadId"] } },
    { name: "inline endpoints", overrides: { inlineEndpoints: true } },
  ])("renders identically with native extraction: $name", ({ overrides }) => {
    const options = getOptions(overrides);
    const source = JSON.stringify(spec);
    const expected = generateCodeFromOpenAPIDoc(spec as never, options);
    expect(getQueries(expected)).toContain("cursor-v1");
    expect(generateCodeFromOpenAPIDoc(spec as never, options, undefined, { source, yaml: false })).toEqual(expected);
  });
});

// Uses the generated hooks with @tanstack/react-query: page params are cursors, pages are typed
// by the response, and `select` narrows `TData`.
const check = `
import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import { ItemsQueries } from "./data/items/items.queries";
import type { ItemsModels } from "./data/items/items.models";

export function useCheck() {
  const items = ItemsQueries.useItemsListInfinite({ limit: 10, order: "name" });
  const pages: InfiniteData<ItemsModels.ItemPage, string | undefined> | undefined = items.data;
  const cursor: string | null | undefined = pages?.pages[0]?.nextCursor;
  // @ts-expect-error -- cursor page params are strings, not page numbers
  const pageNumber: number | undefined = pages?.pageParams[0];
  void items.fetchNextPage();

  const messages = ItemsQueries.useItemsMessagesInfinite(
    { threadId: "t" },
    { select: (data) => data.pages.flatMap((page) => page.messages) },
  );
  const texts: string[] | undefined = messages.data;

  const archive = ItemsQueries.useItemsArchiveInfinite({ limit: 10 });
  const archivePages: number[] | undefined = archive.data?.pageParams;
  return { cursor, pageNumber, texts, archivePages };
}

export const prefetch = (queryClient: QueryClient) =>
  Promise.all([
    ItemsQueries.prefetchItemsListInfinite(queryClient, { limit: 10, order: "name" }),
    ItemsQueries.prefetchItemsMessagesInfinite(queryClient, { threadId: "t" }, { pages: 2 }, undefined, true),
  ]);
`;

async function typecheck(output: string, files: { fileName: string; content: string }[]) {
  for (const file of files) {
    await mkdir(dirname(file.fileName), { recursive: true });
    await writeFile(file.fileName, file.content);
  }
  await writeFile(join(output, "check.ts"), check);
  await symlink(join(root, "node_modules"), join(output, "node_modules"), "dir");
  await writeFile(
    join(output, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        target: "esnext",
        module: "preserve",
        jsx: "react-jsx",
        paths: {
          "@povio/openapi-codegen-cli": [join(root, "src/index.ts")],
          "@povio/openapi-codegen-cli/*": [join(root, "src/*.ts")],
        },
      },
      include: ["**/*.ts"],
      exclude: ["node_modules"],
    }),
  );
  return spawnSync(join(root, "node_modules/.bin/tsrs"), ["-p", "tsconfig.json"], { cwd: output, encoding: "utf8" });
}

describe("generated cursor infinite hooks typecheck", () => {
  test.each(["axios", "native"] as const)(
    "with @tanstack/react-query (restClient: %s)",
    async (restClient) => {
      const output = await mkdtemp(join(tmpdir(), "cursor-infinite-"));
      try {
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          importPath: "relative" as const,
          infiniteQueries: true,
          restClient,
        };
        const files = generateCodeFromOpenAPIDoc(spec as never, options);
        expect(generateFilesFromNativeOpenAPI(JSON.stringify(spec), false, options)).toEqual(files);
        const result = await typecheck(output, files);
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
