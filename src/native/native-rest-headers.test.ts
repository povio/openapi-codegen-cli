import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse, stringify } from "yaml";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";

const root = process.cwd();

// Optional header parameters of every primitive type (petstore only has a string one).
const headerTypes = {
  openapi: "3.0.3",
  info: { title: "Header types", version: "1.0.0" },
  paths: {
    "/items/{id}": {
      delete: {
        tags: ["items"],
        operationId: "deleteItem",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "x-count", in: "header", required: true, schema: { type: "integer" } },
          { name: "x-dry-run", in: "header", required: false, schema: { type: "boolean" } },
          { name: "x-ratio", in: "header", required: false, schema: { type: "number" } },
          { name: "x-note", in: "header", required: false, schema: { type: "string" } },
          { name: "status", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: { "204": { description: "Deleted" } },
      },
    },
  },
};

const cases = [
  {
    name: "petstore",
    source: () => readFile(join(root, "test/petstore.yaml"), "utf8"),
    api: "pet/pet.api.ts",
    check: `
import { PetApi } from "./data/pet/pet.api";
export const withoutKey = () => PetApi.deletePet(1);
export const withKey = () => PetApi.deletePet(1, "key");
`,
  },
  {
    name: "header types",
    source: async () => stringify(headerTypes),
    api: "items/items.api.ts",
    check: `
import { ItemsApi } from "./data/items/items.api";
export const minimal = () => ItemsApi.deleteItem(1, 2);
export const full = () => ItemsApi.deleteItem(1, 2, "active", true, 0.5, "note");
`,
  },
];

async function typecheck(output: string, files: { fileName: string; content: string }[], check: string) {
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

describe("optional header parameters with restClient: 'native'", () => {
  test.each(cases.flatMap((spec) => [false, true].map((lazySchemas) => ({ ...spec, lazySchemas }))))(
    "$name renders identically in both renderers and typechecks (lazySchemas=$lazySchemas)",
    async ({ source, api, check, lazySchemas }) => {
      const output = await mkdtemp(join(tmpdir(), "native-rest-headers-"));
      try {
        const text = await source();
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          restClient: "native" as const,
          lazySchemas,
          importPath: "relative" as const,
        };
        const expected = generateCodeFromOpenAPIDoc(parse(text), options);
        const actual = generateFilesFromNativeOpenAPI(text, true, options);
        expect(actual).toEqual(expected);
        expect(expected.find(({ fileName }) => fileName.endsWith(api))?.content).toContain("headers: {");

        const result = await typecheck(output, expected, check);
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
