import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { generateFilesFromNativeOpenAPI } from "../native/generateFilesFromNativeOpenAPI";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

const root = process.cwd();

// Typed against the generated client: `petId` exists on some pet mutations, `username` on some user ones.
// `QueryModuleInvalidationMap` is the generated `InvalidationMap<QueryModule, QueryModuleMutations>`.
const invalidationMap = `
import type { InvalidationMap, MergedMutationData, MergedMutationVariables } from "@povio/openapi-codegen-cli/query";
import { OpenApiQueryConfig } from "@povio/openapi-codegen-cli/query";
import { QueryModule, type QueryModuleInvalidationMap, type QueryModuleMutations } from "./data/queryModules";

export const invalidationMap: QueryModuleInvalidationMap = {
  [QueryModule.pet]: (data, { petId }) => [["pet", petId, data]],
  [QueryModule.user]: (_data, variables) => [["user", variables.username]],
};

export const explicitMutations: InvalidationMap<QueryModule, QueryModuleMutations> = invalidationMap;
// Without mutation types, callbacks are keyed by module and take \`unknown\` arguments.
export const untyped: InvalidationMap<QueryModule> = invalidationMap;
export const provider = OpenApiQueryConfig.Provider({ invalidationMap, children: null });

// Request-body fields only some mutations send are optional too.
declare const nested: MergedMutationVariables<{ data: { projectId: string } } | { id: string; data: { name: string } }>;
export const projectId: string | undefined = nested.data.projectId;

// Responses merge the same way, and \`void\` (no variables or body) becomes \`undefined\`.
declare const response: MergedMutationData<{ data: { id: string } } | { count: number } | void>;
export const responseCount: number | undefined = response?.count;
export const noResponse: MergedMutationData<void> = undefined;

export const unknownVariable: QueryModuleInvalidationMap = {
  // @ts-expect-error -- no pet mutation has \`nope\`
  [QueryModule.pet]: (_data, { nope }) => [[nope]],
};

export const wrongType: QueryModuleInvalidationMap = {
  // @ts-expect-error -- \`petId\` is a number
  [QueryModule.pet]: (_data, { petId }) => [[petId?.toUpperCase()]],
};
`;

// A second client whose `pet` tag overlaps petstore's with different mutations.
const secondSpec = {
  openapi: "3.0.3",
  info: { title: "Second", version: "1.0.0" },
  paths: {
    "/pets/{name}/adopt": {
      post: {
        operationId: "adoptPet",
        tags: ["pet"],
        parameters: [{ name: "name", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "object", required: ["adopted"], properties: { adopted: { type: "boolean" } } },
              },
            },
          },
        },
      },
    },
    "/pets/{name}": {
      get: {
        operationId: "getPet",
        tags: ["pet"],
        parameters: [{ name: "name", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "string" } } } } },
      },
    },
  },
};

// Both clients' maps typecheck in one program, each keyed and typed by its own client.
const twoClients = `
import { QueryModule as AModule, type QueryModuleInvalidationMap as AMap } from "./a/queryModules";
import { QueryModule as BModule, type QueryModuleInvalidationMap as BMap } from "./b/queryModules";

export const a: AMap = {
  [AModule.pet]: (_data, { petId }) => [["pet", petId]],
};

export const b: BMap = {
  [BModule.pet]: (data, { name }) => [["pet", name, data.adopted]],
};

export const bWrong: BMap = {
  // @ts-expect-error -- the second client's pet mutations take \`name\`, not \`petId\`
  [BModule.pet]: (_data, { petId }) => [[petId]],
};
`;

// `x-media-upload` responses with and without `method`/`fields`; the hook must typecheck for both.
const uploadInstructions = (properties: Record<string, object>) => ({
  description: "Upload instructions",
  content: { "application/json": { schema: { type: "object", required: ["url"], properties } } },
});
const mediaUploadSpec = {
  openapi: "3.0.3",
  info: { title: "Uploads", version: "1.0.0" },
  paths: {
    "/uploads/{id}": {
      post: {
        operationId: "upload",
        tags: ["uploads"],
        "x-media-upload": true,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": uploadInstructions({ id: { type: "string" }, url: { type: "string" } }) },
      },
    },
    "/uploads/{id}/presigned": {
      post: {
        operationId: "uploadPresigned",
        tags: ["uploads"],
        "x-media-upload": true,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": uploadInstructions({
            url: { type: "string" },
            method: { type: "string", enum: ["PUT", "POST"] },
            fields: { type: "object", additionalProperties: { type: "string" } },
          }),
        },
      },
    },
  },
};

async function writeGenerated(files: { fileName: string; content: string }[] | undefined) {
  expect(files).toBeDefined();
  for (const file of files ?? []) {
    await mkdir(dirname(file.fileName), { recursive: true });
    await writeFile(file.fileName, file.content);
  }
}

async function writeTsconfig(output: string) {
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
}

function typecheck(output: string) {
  return spawnSync(join(root, "node_modules/.bin/tsrs"), ["-p", "tsconfig.json"], { cwd: output, encoding: "utf8" });
}

const backends = ["typescript", "native"] as const;

function generate(backend: (typeof backends)[number], source: string, options: GenerateOptions) {
  return backend === "typescript"
    ? generateCodeFromOpenAPIDoc(parse(source), options)
    : generateFilesFromNativeOpenAPI(source, true, options);
}

describe("generated QueryModuleMutations", () => {
  test.each(
    [true, false].flatMap((tsNamespaces) =>
      (["typescript", "native"] as const).map((backend) => ({ tsNamespaces, backend })),
    ),
  )(
    "types invalidation map callbacks ($backend, namespaces: $tsNamespaces)",
    async ({ tsNamespaces, backend }) => {
      const output = await mkdtemp(join(tmpdir(), "invalidation-map-"));
      try {
        const source = await readFile(join(root, "test/petstore.yaml"), "utf8");
        await writeGenerated(
          generate(backend, source, {
            ...DEFAULT_GENERATE_OPTIONS,
            output: join(output, "data"),
            tsNamespaces,
            importPath: "relative",
          }),
        );
        await writeFile(join(output, "invalidationMap.ts"), invalidationMap);
        await writeTsconfig(output);

        const result = typecheck(output);
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});

describe("multiple generated clients", () => {
  test.each(backends)(
    "typecheck together in one program ($0)",
    async (backend) => {
      const output = await mkdtemp(join(tmpdir(), "multiple-clients-"));
      try {
        const options: GenerateOptions = { ...DEFAULT_GENERATE_OPTIONS, importPath: "relative" };
        const petstore = await readFile(join(root, "test/petstore.yaml"), "utf8");
        await writeGenerated(generate(backend, petstore, { ...options, output: join(output, "a") }));
        await writeGenerated(generate(backend, JSON.stringify(secondSpec), { ...options, output: join(output, "b") }));
        await writeFile(join(output, "twoClients.ts"), twoClients);
        await writeTsconfig(output);

        const result = typecheck(output);
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});

describe("media upload hooks", () => {
  test.each(backends)(
    "typecheck whether or not the response declares method ($0)",
    async (backend) => {
      const output = await mkdtemp(join(tmpdir(), "media-upload-"));
      try {
        await writeGenerated(
          generate(backend, JSON.stringify(mediaUploadSpec), {
            ...DEFAULT_GENERATE_OPTIONS,
            output: join(output, "data"),
            importPath: "relative",
          }),
        );
        await writeTsconfig(output);

        const result = typecheck(output);
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
