import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { parse } from "yaml";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";
import { getNativeBindings } from "./native-bindings";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const root = process.cwd();

// Uses the `/exports/...` operations of test/renderer-regressions.yaml (namespaced output).
const check = `
import { ExportsApi } from "./data/exports/exports.api";
import { ExportsQueries } from "./data/exports/exports.queries";
import { RulesApi } from "./data/rules/rules.api";
import { RulesQueries } from "./data/rules/rules.queries";
const { note, search, rename } = ExportsApi;
const { useNote, useSearch } = ExportsQueries;

// An optional request body (\`required: false\` or omitted) may be left out.
export const withoutBody = () => note("id", 1);
export const withBody = () => note("id", 1, { text: null, tags: ["a", null] }, "label");
export const undefinedBody = () => note("id", 1, undefined);
export const searchWithoutBody = () => search(1);
// A required body is still required.
// @ts-expect-error -- \`data\` is required
export const missingBody = () => rename("id", undefined, 1, "label", "queued");
export const requiredBody = () => rename("id", "message", 1, "label", "queued");
// Query parameters without \`required: true\` are optional and sort after required ones.
export const withoutOptionalQuery = () => rename("id", "message", 1);
// @ts-expect-error -- \`copies\` is required
export const missingRequiredQuery = () => rename("id", "message");
// An inlined integer \`$ref\` parameter is a number.
// @ts-expect-error -- \`copies\` is a number
export const stringCount = () => note("id", "1");

export const useHooks = () => {
  const mutation = useNote();
  mutation.mutate({ exportId: "id", copies: 1 });
  mutation.mutate({ exportId: "id", copies: 1, data: { text: "t" } });
  useSearch().mutate({ limit: 1 });
};

// Null-only bodies and parameters are typed \`null\`.
export const reset = () => RulesApi.reset(null, null, null);
export const useReset = () => RulesQueries.useReset().mutate({ data: null, scope: null, force: null });
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

        // Null-only bodies and parameters are typed `null`.
        const rulesModels = tsNamespaces ? "RulesModels." : "";
        expect(content("rules/rules.api.ts")).toContain(
          `export const reset = (data: ${rulesModels}ResetBody, scope: ${rulesModels}ResetScopeParam, force: null, ) => {`,
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

describe("null and multi-type parameters and bodies", () => {
  const json = (schema: object) => ({ content: { "application/json": { schema } } });
  const document = {
    openapi: "3.1.0",
    info: { title: "Null endpoints", version: "1" },
    paths: {
      "/null": {
        post: {
          operationId: "updateNull",
          tags: ["Examples"],
          parameters: [
            { in: "query", name: "filter", required: true, schema: { type: ["null"] } },
            // Inline (unnamed) parameter schemas are typed by their `type`.
            { in: "query", name: "plain", required: true, schema: { type: "null" } },
            { in: "query", name: "list", required: false, schema: { type: "array" } },
            { in: "header", name: "x-test", required: false, schema: { type: ["string", "null"] } },
          ],
          requestBody: { required: true, ...json({ type: ["null"] }) },
          responses: { "200": { description: "OK", ...json({ type: ["null"] }) } },
        },
      },
      "/multi": {
        post: {
          operationId: "updateMulti",
          tags: ["Examples"],
          parameters: [
            { in: "query", name: "search", required: true, schema: { type: ["string", "null"] } },
            {
              in: "query",
              name: "filter",
              required: false,
              schema: { type: ["object", "null"], properties: { a: { type: "string" } } },
            },
          ],
          requestBody: { required: true, ...json({ type: ["string", "integer", "null"] }) },
          responses: { "200": { description: "OK", ...json({ type: ["string", "null"] }) } },
        },
      },
    },
  };

  test.each<Record<string, unknown>>([
    {},
    { lazySchemas: true },
    { restClient: "native" },
    { restClient: "native", lazySchemas: true },
  ])(
    "render identically, typecheck and validate with %j",
    async (variant) => {
      const output = await mkdtemp(join(tmpdir(), "null-endpoint-parity-"));
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

        const api = expected.find(({ fileName }) => fileName.endsWith("examples/examples.api.ts"))!.content;
        expect(api).toContain(
          "export const updateNull = (data: ExamplesModels.UpdateNullBody, filter: ExamplesModels.UpdateNullFilterParam, plain: null, list?: unknown[], xTest?: ExamplesModels.UpdateNullXTestParam, ) => {",
        );

        const result = await typecheck(
          output,
          expected,
          `import { ExamplesApi } from "./data/examples/examples.api";
          import { ExamplesQueries } from "./data/examples/examples.queries";
          import { ExamplesModels } from "./data/examples/examples.models";
          const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
          export const nulls = () => ExamplesApi.updateNull(null, null, null, [], null);
          // @ts-expect-error -- the body is null
          export const stringBody = () => ExamplesApi.updateNull("x", null, null);
          export const multi = () => [ExamplesApi.updateMulti(null, null), ExamplesApi.updateMulti(1, "s", { a: "a" })];
          // @ts-expect-error -- the body is a string, an integer or null
          export const booleanBody = () => ExamplesApi.updateMulti(true, null);
          export const useHooks = () => {
            ExamplesQueries.useUpdateNull().mutate({ data: null, filter: null, plain: null });
            ExamplesQueries.useUpdateMulti().mutate({ data: "s", search: null, filter: null });
          };
          const parses: [{ safeParse: (value: unknown) => { success: boolean } }, unknown, boolean][] = [
            [ExamplesModels.UpdateNullBodySchema, null, true],
            [ExamplesModels.UpdateNullBodySchema, "x", false],
            [ExamplesModels.UpdateNullResponseSchema, null, true],
            [ExamplesModels.UpdateMultiBodySchema, 1, true],
            [ExamplesModels.UpdateMultiBodySchema, null, true],
            [ExamplesModels.UpdateMultiBodySchema, true, false],
            [ExamplesModels.UpdateMultiFilterParamSchema, null, true],
            [ExamplesModels.UpdateMultiFilterParamSchema, { a: 1 }, false],
          ];
          for (const [schema, value, success] of parses) assert(schema.safeParse(value).success === success, JSON.stringify(value));
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
      // With `allReadonly` the referenced array is `.readonly()`: length checks are refinements.
      "/list": respond("getList", "Tuples", ref("TupleList")),
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
            lists: { type: "array", prefixItems: [ref("TupleList")], items: ref("TupleList"), minItems: 1 },
            plain: ref("TupleList"),
          },
        },
        TupleList: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3, nullable: true },
        TupleName: { type: "string", minLength: 3, nullable: true },
        TupleTree: { type: "array", minItems: 1, prefixItems: [{ type: "string" }, ref("TupleTree")], items: false },
      },
    },
  };

  const imports = (options: { tsNamespaces?: boolean; splitByTags?: boolean }) => {
    const tag = options.splitByTags === false ? "common" : "tuples";
    return options.tsNamespaces === false
      ? `import { TuplePairSchema, TupleTreeSchema } from "./data/${tag}/${tag}.models";`
      : `import { ${tag === "common" ? "CommonModels" : "TuplesModels"} as M } from "./data/${tag}/${tag}.models";
         const { TuplePairSchema, TupleTreeSchema } = M;`;
  };

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
    { allReadonly: true, modelsInModules: true },
    { allReadonly: true, modelsInModules: true, lazySchemas: true },
    { allReadonly: true, modelsInCommon: true },
    { allReadonly: true, tsNamespaces: false },
    // Unsplit output is rendered from native extraction by the TypeScript generators (hybrid).
    { splitByTags: false },
    { splitByTags: false, lazySchemas: true },
    { splitByTags: false, allReadonly: true },
    { splitByTags: false, allReadonly: true, lazySchemas: true },
    { splitByTags: false, allReadonly: true, modelsInModules: true, lazySchemas: true },
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
        const source = JSON.stringify(document);
        let actual;
        if (variant.splitByTags === false) {
          vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
          vi.stubEnv("OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE", "0");
          expect(generateFilesFromNativeOpenAPI(source, false, options)).toBeUndefined();
          const compileData = vi.spyOn(getNativeBindings(), "compileData");
          actual = generateCodeFromOpenAPIDoc(JSON.parse(source), options, undefined, { source, yaml: false });
          expect(compileData).toHaveBeenCalled();
        } else {
          actual = generateFilesFromNativeOpenAPI(source, false, options);
        }
        expect(actual).toEqual(expected);

        const tag = variant.splitByTags === false ? "common" : "tuples";
        const api = expected.find(({ fileName }) => fileName.endsWith(`${tag}/${tag}.api.ts`))!.content;
        expect(api).toContain(
          variant.allReadonly
            ? "ListSchema.refine((value) => value.length >= 2).refine((value) => value.length <= 3).nullable() }"
            : "ListSchema.min(2).max(3).nullable() }",
        );
        expect(api).not.toMatch(/import [^\n]*\.refine/);

        const result = await typecheck(
          output,
          expected,
          `${imports(variant)}
          const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
          // Loading the endpoints resolves every model import, including the common model proxies.
          ${
            variant.splitByTags === false
              ? `const api = await import("./data/common/common.api");`
              : `const api = await import("./data/tuples/tuples.api");
                 await import("./data/others/others.api");`
          }
          assert(Object.keys(api).length > 0, "endpoints");
          for (const value of [{ pair: ["abc"] }, { pair: [null] }, { list: ["abc", null, "defg"] }, { list: [null] }])
            assert(TuplePairSchema.safeParse(value).success, JSON.stringify(value));
          for (const value of [{ lists: [["a", "b"], null] }, { plain: ["a", "b", "c"] }, { plain: null }])
            assert(TuplePairSchema.safeParse(value).success, JSON.stringify(value));
          for (const value of [{ lists: [["a"]] }, { lists: [["a", "b", "c", "d"]] }, { plain: ["a"] }])
            assert(!TuplePairSchema.safeParse(value).success, JSON.stringify(value));
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
