import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";

const root = process.cwd();

// Uses the `/exports/...` operations of test/renderer-regressions.yaml (namespaced output).
const check = `
import { ExportsApi } from "./data/exports/exports.api";
import { ExportsQueries } from "./data/exports/exports.queries";
const { note, search, rename } = ExportsApi;
const { useNote, useSearch } = ExportsQueries;

// An optional request body (\`required: false\` or omitted) may be left out.
export const withoutBody = () => note("id", 1);
export const withBody = () => note("id", 1, { text: null, tags: ["a", null] }, "label");
export const undefinedBody = () => note("id", 1, undefined);
export const searchWithoutBody = () => search(1);
// A required body is still required.
// @ts-expect-error -- \`data\` is required
export const missingBody = () => rename("id", undefined, "label", 1, "queued");
export const requiredBody = () => rename("id", "message", "label", 1, "queued");
// An inlined integer \`$ref\` parameter is a number.
// @ts-expect-error -- \`copies\` is a number
export const stringCount = () => note("id", "1");

export const useHooks = () => {
  const mutation = useNote();
  mutation.mutate({ exportId: "id", copies: 1 });
  mutation.mutate({ exportId: "id", copies: 1, data: { text: "t" } });
  useSearch().mutate({ limit: 1 });
};
`;

async function typecheck(output: string, files: { fileName: string; content: string }[], checkCode = check) {
  for (const file of files) {
    await mkdir(dirname(file.fileName), { recursive: true });
    await writeFile(file.fileName, file.content);
  }
  await writeFile(join(output, "check.ts"), checkCode);
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

describe("endpoints of test/renderer-regressions.yaml", () => {
  test.each([true, false])(
    "render optional bodies and inlined $ref parameters identically and typecheck (namespaces=%s)",
    async (tsNamespaces) => {
      const output = await mkdtemp(join(tmpdir(), "endpoint-parity-"));
      try {
        const source = await readFile(join(root, "test/renderer-regressions.yaml"), "utf8");
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          tsNamespaces,
          generateJsDoc: true,
          importPath: "relative" as const,
        };
        const expected = generateCodeFromOpenAPIDoc(parse(source), options);
        const actual = generateFilesFromNativeOpenAPI(source, true, options);
        expect(actual).toEqual(expected);

        const content = (suffix: string) => expected.find(({ fileName }) => fileName.endsWith(suffix))!.content;
        const api = content("exports/exports.api.ts");
        const models = tsNamespaces ? "ExportsModels." : "";
        // Optional body: `data?` sorts after required parameters and is validated as optional.
        expect(api).toContain(
          `export const note = (exportId: string, copies: number, data?: ${models}ExportNoteDto, label?: string, ) => {`,
        );
        expect(api).toContain(`ZodExtended.parse(${models}ExportNoteDtoSchema.optional(), data)`);
        expect(api).toContain(`export const search = (limit: number, data?: ${models}SearchBody, ) => {`);
        // A required body stays required.
        expect(api).toContain("export const rename = (exportId: string, data: string,");
        expect(api).toContain("ZodExtended.parse(z.string().min(2), data)");
        // An inlined `$ref` parameter keeps the component's validations.
        expect(api).toContain(
          'label: ZodExtended.parse(z.string().min(2).optional(), label, { type: "query", name: "label" })',
        );
        expect(api).toContain('copies: ZodExtended.parse(z.int().gte(0), copies, { type: "query", name: "copies" })');
        expect(content("exports/exports.queries.ts")).toContain(
          `{ exportId: string, copies: number, data?: ${models}ExportNoteDto, label?: string }`,
        );
        // OpenAPI 3.1 type arrays are documented as unions.
        const exportModels = content("exports/exports.models.ts");
        expect(exportModels).toContain(" * ExportNoteResultSchema\n * @type { string | null }\n");
        expect(exportModels).toContain(
          " * @property { string | null } text\n * @property { (string | null)[] } tags\n",
        );

        // A referenced tuple's `minItems` is validated at the response; only its name is imported.
        const literalsApi = content("literals/literals.api.ts");
        expect(literalsApi).toContain(
          `{ resSchema: ${tsNamespaces ? "LiteralsModels." : ""}LiteralTupleDtoSchema.refine((value) => value.length >= 3) }`,
        );
        expect(literalsApi).not.toMatch(/import [^\n]*\.refine/);

        // Without namespaces the fixture's `status` query parameter shadows the `status` endpoint.
        if (tsNamespaces) {
          const result = await typecheck(output, expected);
          expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
        }
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});

describe("tuple responses and members", () => {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const respond = (operationId: string, tag: string, schema: object) => ({
    get: {
      operationId,
      tags: [tag],
      responses: { "200": { description: "OK", content: { "application/json": { schema } } } },
    },
  });
  const document = {
    openapi: "3.1.0",
    info: { title: "Tuples", version: "1" },
    paths: {
      // A tuple with `minItems` is responded with as `TupleMinRestSchema.refine(...)`: only the schema
      // name is imported, and it is shared by two tags (owned by the common models).
      "/tuple": respond("getTuple", "Tuples", ref("TupleMinRest")),
      "/other-tuple": respond("getOtherTuple", "Others", ref("TupleMinRest")),
      "/pair": respond("getPair", "Tuples", ref("TuplePair")),
      "/tree": respond("getTree", "Tuples", ref("TupleTree")),
    },
    components: {
      schemas: {
        TupleMinRest: { type: "array", prefixItems: [{ type: "string" }], items: { type: "number" }, minItems: 3 },
        // Referenced tuple members and rest apply the referenced schema's validation and nullability.
        TuplePair: {
          type: "object",
          properties: {
            pair: { type: "array", prefixItems: [ref("TupleName")], items: false },
            list: { type: "array", prefixItems: [ref("TupleName")], items: ref("TupleName"), minItems: 1 },
          },
        },
        TupleName: { type: "string", minLength: 3, nullable: true },
        TupleTree: { type: "array", minItems: 1, prefixItems: [{ type: "string" }, ref("TupleTree")], items: false },
      },
    },
  };

  const imports = (options: { tsNamespaces?: boolean }) =>
    options.tsNamespaces === false
      ? `import { TuplePairSchema, TupleTreeSchema } from "./data/tuples/tuples.models";`
      : `import { TuplesModels } from "./data/tuples/tuples.models";
         const { TuplePairSchema, TupleTreeSchema } = TuplesModels;`;

  test.each<Record<string, boolean>>([
    {},
    { tsNamespaces: false },
    { lazySchemas: true },
    { allReadonly: true },
    { allReadonly: true, lazySchemas: true },
    { modelsInCommon: true },
    { modelsInCommon: true, lazySchemas: true },
    { modelsInCommon: true, tsNamespaces: false },
    { modelsInModules: true },
    { modelsInModules: true, lazySchemas: true },
  ])(
    "render identically, typecheck, load and validate with %j",
    async (variant) => {
      const output = await mkdtemp(join(tmpdir(), "tuple-parity-"));
      try {
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          importPath: "relative" as const,
          ...variant,
        };
        const expected = generateCodeFromOpenAPIDoc(
          structuredClone(document) as unknown as Parameters<typeof generateCodeFromOpenAPIDoc>[0],
          options,
        );
        const actual = generateFilesFromNativeOpenAPI(JSON.stringify(document), false, options);
        expect(actual).toEqual(expected);

        const api = expected.find(({ fileName }) => fileName.endsWith("tuples/tuples.api.ts"))!.content;
        expect(api).not.toMatch(/import [^\n]*\.refine/);

        const result = await typecheck(
          output,
          expected,
          `${imports(variant)}
          const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
          // Loading the endpoints resolves every model import, including the common model proxies.
          await import("./data/tuples/tuples.api");
          await import("./data/others/others.api");
          for (const value of [{ pair: ["abc"] }, { pair: [null] }, { list: ["abc", null, "defg"] }, { list: [null] }])
            assert(TuplePairSchema.safeParse(value).success, JSON.stringify(value));
          for (const value of [{ pair: ["a"] }, { pair: ["abc", "def"] }, { list: ["abc", "x"] }, { list: [] }])
            assert(!TuplePairSchema.safeParse(value).success, JSON.stringify(value));
          for (const value of [["a"], ["a", ["b", ["c"]]]]) assert(TupleTreeSchema.safeParse(value).success, JSON.stringify(value));
          for (const value of [[], [1], ["a", [2]]]) assert(!TupleTreeSchema.safeParse(value).success, JSON.stringify(value));
          console.log("ok");
          `,
        );
        expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
        const run = spawnSync("bun", ["check.ts"], { cwd: output, encoding: "utf8" });
        expect(run.stdout.trim(), run.stderr).toBe("ok");
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
