import { describe, expect, test } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "yaml";

import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "@/generators/types/options";
import {
  callLazySchemaReferences,
  getCircularSchemaDeclaration,
  getCodeSchemaReferences,
  isZodObjectCode,
  stripModelNamespaceReferences,
} from "@/generators/utils/generate/generate.lazy.utils";
import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";

const TSRS = path.join(process.cwd(), "node_modules/.bin/tsrs");

// Generates models with both renderers, requires identical output, then typechecks the generated
// models with `tsrs` and runs `check` (TypeScript importing from `./<tag>/<tag>.models`) with Bun.
async function verifyGeneratedModels(source: string, fileConfig: Partial<GenerateOptions>, check: string) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "model-regressions-"));
  try {
    const options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: directory,
        acl: false,
        checkAcl: false,
        importPath: "relative",
        ...fileConfig,
      },
      params: {},
    });
    const document = source.trimStart().startsWith("{") ? JSON.parse(source) : parse(source);
    const models = (files: { fileName: string; content: string }[]) =>
      Object.fromEntries(files.filter((f) => f.fileName.endsWith(".models.ts")).map((f) => [f.fileName, f.content]));
    const expected = models(generateCodeFromOpenAPIDoc(document, options));
    const native = generateFilesFromNativeOpenAPI(JSON.stringify(document), false, options);
    expect(native).toBeDefined();
    expect(models(native!)).toEqual(expected);

    await symlink(path.join(process.cwd(), "node_modules"), path.join(directory, "node_modules"), "dir");
    for (const [fileName, content] of Object.entries(expected)) {
      await mkdir(path.dirname(fileName), { recursive: true });
      await writeFile(fileName, content);
    }
    await writeFile(path.join(directory, "check.ts"), check);
    await writeFile(
      path.join(directory, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "ESNext",
          module: "ESNext",
          moduleResolution: "bundler",
          skipLibCheck: true,
          types: [],
        },
        include: ["**/*.ts"],
        exclude: ["node_modules"],
      }),
    );
    try {
      execFileSync(TSRS, ["-p", path.join(directory, "tsconfig.json")], { stdio: "pipe" });
    } catch (error) {
      const { stdout, stderr } = error as { stdout?: Buffer; stderr?: Buffer };
      throw new Error(`Generated models do not typecheck:\n${stdout?.toString()}${stderr?.toString()}`);
    }
    try {
      return execFileSync("bun", [path.join(directory, "check.ts")], { stdio: "pipe" }).toString();
    } catch (error) {
      const { stdout, stderr } = error as { stdout?: Buffer; stderr?: Buffer };
      throw new Error(`Generated models fail at runtime:\n${stdout?.toString()}${stderr?.toString()}`);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

// Mirrors the `model_code_tests` unit tests in native/src/render.rs.
describe("generated model code scanning", () => {
  test("strips namespace references but not literals", () => {
    const code =
      String.raw`z.object({ a: CommonModels.PetSchema, b: z.enum(["ExamplesModels.ExampleSchema", 'CommonModels.x']), c: z.string().regex(/^CommonModels\.x$/).default(` +
      "`CommonModels.y`" +
      String.raw`), CommonModels: z.string(), d: z.lazy(() => PetsModels.PetSchema.nullable()) })`;
    expect(stripModelNamespaceReferences(code, "Models")).toBe(
      String.raw`z.object({ a: PetSchema, b: z.enum(["ExamplesModels.ExampleSchema", 'CommonModels.x']), c: z.string().regex(/^CommonModels\.x$/).default(` +
        "`CommonModels.y`" +
        String.raw`), CommonModels: z.string(), d: z.lazy(() => PetSchema.nullable()) })`,
    );
  });

  test("collects qualified and bare schema references", () => {
    const code = `z.object({ PetSchema: CommonModels.StatusEnumSchema, b: TagSchema, c: z.enum(["OwnerSchema"]), d: CommonModels.StatusEnumSchema })`;
    expect(
      getCodeSchemaReferences(code, new Set(["PetSchema", "StatusEnumSchema", "TagSchema", "OwnerSchema"])),
    ).toEqual(["StatusEnumSchema", "TagSchema"]);
  });

  test("detects object schema code", () => {
    expect(isZodObjectCode("z.object({ a: z.string() })")).toBe(true);
    expect(isZodObjectCode(String.raw`z.object({ a: z.string().regex(/\)/) }).partial().catchall(z.string())`)).toBe(
      true,
    );
    expect(isZodObjectCode("z.object({ a: z.string() }).readonly()")).toBe(false);
    expect(isZodObjectCode("z.object({}).nullable()")).toBe(false);
    expect(isZodObjectCode("z.union([z.object({}), z.string()])")).toBe(false);
    expect(isZodObjectCode("z.object({}).or(z.string())")).toBe(false);
    expect(getCircularSchemaDeclaration("z.union([z.string(), z.array(ExampleSchema)])", "Example")).toEqual({
      typeAnnotation: "z.ZodType<Example>",
      code: "z.lazy(() => z.union([z.string(), z.array(ExampleSchema)]))",
    });
    const readonlyObject = "z.object({ next: z.lazy(() => ExampleSchema) }).partial().readonly()";
    expect(getCircularSchemaDeclaration(readonlyObject, "Example")).toEqual({
      typeAnnotation: "z.ZodReadonly<z.ZodObject<z.ZodRawShape>> & z.ZodType<Example>",
      code: readonlyObject,
    });
  });

  test("spread references are not member accesses", () => {
    expect(callLazySchemaReferences("z.object({ ...PetSchema.shape, a: x.PetSchema })", new Set(["PetSchema"]))).toBe(
      "z.object({ ...PetSchema().shape, a: x.PetSchema })",
    );
    expect(stripModelNamespaceReferences("z.object({ ...CommonModels.PetSchema.unwrap().shape })", "Models")).toBe(
      "z.object({ ...PetSchema.unwrap().shape })",
    );
  });
});

const assert = `const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };`;

describe("generated models of test/renderer-regressions.yaml", () => {
  test.each([
    { name: "namespaces", options: {}, namespaced: true },
    { name: "lazy schemas", options: { lazySchemas: true }, namespaced: true },
    { name: "models in modules", options: { modelsInModules: true }, namespaced: true },
    { name: "no namespaces", options: { tsNamespaces: false }, namespaced: false },
    { name: "readonly", options: { allReadonly: true }, namespaced: true },
    { name: "readonly lazy schemas", options: { allReadonly: true, lazySchemas: true }, namespaced: true },
    { name: "lazy models in modules", options: { modelsInModules: true, lazySchemas: true }, namespaced: true },
  ])("typecheck, load and validate with $name", async ({ options, namespaced }) => {
    const source = await readFile("test/renderer-regressions.yaml", "utf8");
    const imports = namespaced
      ? `import { TrackingModels } from "./tracking/tracking.models";
         import { RulesModels } from "./rules/rules.models";
         const { RefreshProvider400ErrorResponseSchema } = TrackingModels;
         const { RuleNodeSchema, RuleDtoSchema, RuleGraphDtoSchema } = RulesModels;`
      : `import { RefreshProvider400ErrorResponseSchema } from "./tracking/tracking.models";
         import { RuleNodeSchema, RuleDtoSchema, RuleGraphDtoSchema } from "./rules/rules.models";`;
    const output = await verifyGeneratedModels(
      source,
      options,
      `${imports}
      ${assert}
      // The inline \`status\` enum is extracted to a shared enum owned by another module.
      assert(RefreshProvider400ErrorResponseSchema.safeParse({ status: "error", code: "tracking_not_found", message: "m" }).success, "error response");
      assert(!RefreshProvider400ErrorResponseSchema.safeParse({ status: "other", code: "tracking_not_found", message: "m" }).success, "status enum");
      // Recursive union
      for (const value of ["leaf", ["leaf", ["x", []]]]) assert(RuleNodeSchema.safeParse(value).success, JSON.stringify(value));
      for (const value of [5, ["leaf", [5]]]) assert(!RuleNodeSchema.safeParse(value).success, JSON.stringify(value));
      // Enum values that look like model references are data, not symbols.
      for (const kind of ["RulesModels.RuleNodeSchema", "CommonModels.StatusEnumSchema", "plain"])
        assert(RuleDtoSchema.safeParse({ node: ["a"], kind, pattern: "CommonModels.x" }).success, kind);
      for (const kind of ["RuleNodeSchema", "StatusEnumSchema"])
        assert(!RuleDtoSchema.safeParse({ node: "a", kind }).success, kind);
      assert(!RuleDtoSchema.safeParse({ node: "a", kind: "plain", pattern: "x" }).success, "pattern");
      // Recursive additional properties, recursive allOf and nullable object type arrays.
      const graph = {
        scopes: { label: "root", child: { grandchild: {} } },
        // Merged allOf members keep the order of their properties.
        chain: { next: { name: "b" }, name: "a" },
        link: { next: null },
        named: { next: { name: "b" }, name: "a", id: "n" },
      };
      assert(JSON.stringify(RuleGraphDtoSchema.parse(graph)) === JSON.stringify(graph), "graph data");
      assert(RuleGraphDtoSchema.safeParse({ link: null }).success, "nullable link");
      for (const value of [
        { scopes: { child: 1 } },
        { chain: { next: { name: 1 } } },
        { link: { next: 1 } },
        { named: { name: "a" } },
      ])
        assert(!RuleGraphDtoSchema.safeParse(value).success, JSON.stringify(value));
      console.log("ok");`,
    );
    expect(output.trim()).toBe("ok");
  });
});

describe("circular schemas", () => {
  const document = {
    openapi: "3.0.3",
    info: { title: "Circular", version: "1" },
    paths: {
      "/example": {
        get: {
          operationId: "getExample",
          tags: ["Examples"],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: Object.fromEntries(
                      ["Node", "Expr", "List", "Folder", "Ping"].map((name) => [
                        name.toLowerCase(),
                        { $ref: `#/components/schemas/${name}` },
                      ]),
                    ),
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        // Union and object referencing each other
        Node: { oneOf: [{ type: "string" }, { $ref: "#/components/schemas/Branch" }] },
        Branch: {
          type: "object",
          required: ["children"],
          properties: { children: { type: "array", items: { $ref: "#/components/schemas/Node" } } },
        },
        // Union with an inline recursive object
        Expr: {
          anyOf: [
            { type: "number" },
            {
              type: "object",
              required: ["op", "args"],
              properties: {
                op: { type: "string" },
                args: { type: "array", items: { $ref: "#/components/schemas/Expr" } },
              },
            },
          ],
        },
        // Recursive array
        List: { type: "array", items: { oneOf: [{ type: "integer" }, { $ref: "#/components/schemas/List" }] } },
        // Self- and mutually recursive objects keep their object schema type
        Folder: {
          type: "object",
          properties: {
            name: { type: "string" },
            children: { type: "array", items: { $ref: "#/components/schemas/Folder" } },
          },
        },
        Ping: { type: "object", properties: { pong: { $ref: "#/components/schemas/Pong" } } },
        Pong: { type: "object", properties: { ping: { $ref: "#/components/schemas/Ping" } } },
      },
    },
  };

  test.each([{ lazySchemas: false }, { lazySchemas: true }, { compileSchemas: true }])(
    "typecheck and validate with %j",
    async (options) => {
      const output = await verifyGeneratedModels(
        JSON.stringify(document),
        options,
        `import { ExamplesModels as M } from "./examples/examples.models";
        ${assert}
        const valid: [string, unknown][] = [
          ["NodeSchema", "leaf"],
          ["NodeSchema", { children: ["a", { children: [] }] }],
          ["ExprSchema", { op: "+", args: [1, { op: "-", args: [2] }] }],
          ["ListSchema", [1, [2, [3]]]],
          ["FolderSchema", { name: "root", children: [{ name: "child" }] }],
          ["PingSchema", { pong: { ping: { pong: {} } } }],
        ];
        const invalid: [string, unknown][] = [
          ["NodeSchema", 5],
          ["NodeSchema", { children: [5] }],
          ["ExprSchema", { op: "+", args: ["x"] }],
          ["ListSchema", ["x"]],
          ["FolderSchema", { children: [{ name: 5 }] }],
          ["PingSchema", { pong: { ping: { pong: 5 } } }],
        ];
        const schemas = M as unknown as Record<string, { safeParse: (value: unknown) => { success: boolean } }>;
        for (const [name, value] of valid) assert(schemas[name]!.safeParse(value).success, name + " " + JSON.stringify(value));
        for (const [name, value] of invalid) assert(!schemas[name]!.safeParse(value).success, name + " " + JSON.stringify(value));
        // Object schemas keep their ZodObject API.
        assert("name" in M.FolderSchema.shape, "folder shape");
        const node: M.Node = { children: ["b", { children: [] }] };
        assert(M.NodeSchema.parse(node) !== undefined, "typed node");
        console.log("ok");`,
      );
      expect(output.trim()).toBe("ok");
    },
  );
});

describe("explicit types of circular schemas", () => {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const document = {
    openapi: "3.0.3",
    info: { title: "Circular types", version: "1" },
    paths: {
      "/examples": {
        get: {
          operationId: "getExamples",
          tags: ["Examples"],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: Object.fromEntries(
                      ["Tree", "PlainNullable", "Defaults", "RequiredDefaults", "Linked", "Union", "Pair"].map(
                        (name) => [name, ref(name)],
                      ),
                    ),
                  },
                },
              },
            },
          },
        },
      },
      "/shared": {
        get: {
          operationId: "getShared",
          tags: ["Others"],
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: ref("Shared") } } },
          },
        },
      },
    },
    components: {
      schemas: {
        // Used by two tags, so owned by the common models file.
        Shared: { type: "object", properties: { id: { type: "string" } } },
        Linked: {
          type: "object",
          properties: {
            shared: ref("Shared"),
            next: ref("Linked"),
            tags: { type: "array", items: { type: "string" } },
          },
        },
        Tree: { type: "object", nullable: true, properties: { label: { type: "string" }, next: ref("Tree") } },
        PlainNullable: { type: "object", nullable: true, properties: { label: { type: "string" } } },
        Defaults: { type: "object", properties: { code: { type: "string", default: "x" }, self: ref("Defaults") } },
        RequiredDefaults: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            code: { type: "string", default: "x" },
            count: { type: "integer", default: 1, nullable: true },
            self: ref("RequiredDefaults"),
          },
        },
        Union: { oneOf: [{ type: "string" }, { type: "array", items: ref("Union") }, ref("Shared")] },
        Pair: {
          type: "object",
          properties: {
            closed: { type: "array", minItems: 2, items: [{ type: "string" }, ref("Pair")], additionalItems: false },
            open: { type: "array", items: [{ type: "integer" }] },
          },
        },
      },
    },
  };

  const typeAssertions = (readonly: boolean) => `
    type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
    const expectType = <T extends true>(value: T) => value;
    // Cross-namespace references are qualified.
    expectType<Equal<NonNullable<M.Linked["shared"]>, CommonModels.Shared>>(true);
    // \`.partial()\` makes a property with a default optional; a required object's default is always set.
    expectType<Equal<M.Defaults["code"], string | undefined>>(true);
    expectType<Equal<M.RequiredDefaults["code"], string>>(true);
    expectType<Equal<M.RequiredDefaults["count"], number | null>>(true);
    // A nullable component is only nullable where it is referenced, like non-circular components.
    expectType<Equal<null extends M.Tree ? true : false, false>>(true);
    expectType<Equal<null extends M.PlainNullable ? true : false, false>>(true);
    expectType<Equal<M.Tree["next"], M.Tree | null | undefined>>(true);
    expectType<Equal<M.Linked["tags"], ${readonly ? "readonly string[]" : "string[]"} | undefined>>(true);
    expectType<Equal<M.Union, string | ${readonly ? "readonly M.Union[]" : "M.Union[]"} | CommonModels.Shared>>(true);
    // Tuples keep their members and rest.
    expectType<Equal<M.Pair["closed"], ${readonly ? "readonly " : ""}[string, M.Pair] | undefined>>(true);
    expectType<Equal<M.Pair["open"], ${readonly ? "ReadonlyArray<unknown>" : "[number?, ...unknown[]]"} | undefined>>(true);
  `;

  test.each<Partial<GenerateOptions>>([
    {},
    { allReadonly: true },
    { lazySchemas: true },
    { tsNamespaces: false },
    { modelsInModules: true },
  ])("typecheck and validate with %j", async (options) => {
    const namespaced = options.tsNamespaces !== false;
    const imports = !namespaced
      ? `import * as M from "./examples/examples.models";`
      : options.modelsInModules
        ? `import { ExamplesModels as M, ExamplesModels as CommonModels } from "./examples/examples.models";`
        : `import { ExamplesModels as M } from "./examples/examples.models";
           import { CommonModels } from "./common/common.models";`;
    const output = await verifyGeneratedModels(
      JSON.stringify(document),
      options,
      `${imports}
      ${assert}
      ${namespaced ? typeAssertions(Boolean(options.allReadonly)) : ""}
      assert(M.TreeSchema.safeParse({ label: "a", next: { label: "b", next: null } }).success, "tree");
      assert(!M.TreeSchema.safeParse(null).success, "circular nullable component itself");
      assert(!M.PlainNullableSchema.safeParse(null).success, "nullable component itself");
      assert(M.${namespaced ? "GetResponseSchema" : "GetExamplesResponseSchema"}.safeParse({ Tree: null, PlainNullable: null }).success, "nullable references");
      assert(M.LinkedSchema.safeParse({ shared: { id: "s" }, next: { tags: ["t"] } }).success, "linked");
      assert(!M.LinkedSchema.safeParse({ shared: { id: 1 } }).success, "linked shared");
      assert(M.RequiredDefaultsSchema.parse({ name: "n" }).code === "x", "default");
      assert(M.PairSchema.safeParse({ closed: ["a", { open: [1, "x"] }] }).success, "tuple");
      assert(M.PairSchema.safeParse({ open: [] }).success, "optional tuple member");
      assert(!M.PairSchema.safeParse({ closed: ["a", {}, "extra"] }).success, "closed tuple");
      for (const value of ["a", ["a", { id: "s" }]]) assert(M.UnionSchema.safeParse(value).success, JSON.stringify(value));
      console.log("ok");`,
    );
    expect(output.trim()).toBe("ok");
  });
});

describe("recursive members, readonly allOf and nullable type arrays", () => {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const document = {
    openapi: "3.1.0",
    info: { title: "Recursive members", version: "1" },
    paths: {
      "/examples": {
        get: {
          operationId: "getExamples",
          tags: ["Examples"],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: Object.fromEntries(
                      ["Catchall", "CatchallUnion", "AllOf", "TypeArray", "Child", "Plain", "Multi", "NullOnly"].map(
                        (name) => [name, ref(name)],
                      ),
                    ),
                  },
                },
              },
            },
          },
        },
      },
      // Node is used by two tags, so allOf members reference it in another models namespace.
      "/nodes": {
        get: {
          operationId: "getNode",
          tags: ["Others"],
          responses: { "200": { description: "OK", content: { "application/json": { schema: ref("Node") } } } },
        },
      },
    },
    components: {
      schemas: {
        // Recursive additional properties
        Catchall: { type: "object", additionalProperties: ref("Catchall") },
        CatchallUnion: {
          type: "object",
          properties: { id: { type: "string" } },
          additionalProperties: { oneOf: [{ type: "string" }, { type: "array", items: ref("CatchallUnion") }] },
        },
        // Recursive allOf of inline objects
        AllOf: {
          allOf: [
            { type: "object", properties: { next: ref("AllOf") } },
            { type: "object", properties: { name: { type: "string" } } },
          ],
        },
        // Nullable object type array
        TypeArray: { type: ["object", "null"], properties: { next: ref("TypeArray") } },
        Node: { type: "object", properties: { children: { type: "array", items: ref("Node") } } },
        // allOf of referenced (circular, cross-namespace) and inline members
        Child: {
          allOf: [
            ref("Node"),
            ref("Plain"),
            { type: "object", required: ["extra"], properties: { extra: { type: "string" } } },
          ],
        },
        Plain: {
          allOf: [
            { type: "object", properties: { x: { type: "string" } } },
            { type: "object", properties: { y: { type: "integer" } } },
          ],
        },
        Multi: { type: ["string", "integer", "null"] },
        NullOnly: { type: ["null"] },
      },
    },
  };

  test.each<Partial<GenerateOptions>>([
    {},
    { lazySchemas: true },
    { allReadonly: true },
    { allReadonly: true, lazySchemas: true },
    { modelsInModules: true },
    { modelsInModules: true, lazySchemas: true },
    { modelsInModules: true, allReadonly: true, lazySchemas: true },
    { tsNamespaces: false },
    { tsNamespaces: false, allReadonly: true },
  ])("typecheck and validate with %j", async (options) => {
    const namespaced = options.tsNamespaces !== false;
    const imports = namespaced
      ? `import { ExamplesModels as M } from "./examples/examples.models";`
      : `import * as M from "./examples/examples.models";`;
    const output = await verifyGeneratedModels(
      JSON.stringify(document),
      options,
      `${imports}
      ${assert}
      const schemas = M as unknown as Record<string, { safeParse: (value: unknown) => { success: boolean; data?: unknown } }>;
      const valid: [string, unknown][] = [
        ["CatchallSchema", {}],
        ["CatchallSchema", { a: {} }],
        ["CatchallSchema", { a: { b: { c: {} } } }],
        ["CatchallUnionSchema", { id: "x", k: "s", l: [{ m: "n" }] }],
        ["AllOfSchema", { name: "ok", next: { name: "child" } }],
        ["TypeArraySchema", null],
        ["TypeArraySchema", { next: null }],
        ["TypeArraySchema", { next: { next: {} } }],
        ["ChildSchema", { extra: "e", x: "x", y: 1, children: [{ children: [] }] }],
        ["MultiSchema", null],
        ["MultiSchema", "s"],
        ["MultiSchema", 1],
        ["NullOnlySchema", null],
      ];
      const invalid: [string, unknown][] = [
        ["CatchallSchema", { a: 1 }],
        ["CatchallSchema", { a: { b: 1 } }],
        ["CatchallUnionSchema", { k: 1 }],
        ["CatchallUnionSchema", { l: [{ m: 1 }] }],
        ["AllOfSchema", { name: 3 }],
        ["AllOfSchema", { next: { name: 3 } }],
        ["TypeArraySchema", 5],
        ["TypeArraySchema", { next: 5 }],
        ["ChildSchema", { x: "x" }],
        ["ChildSchema", { extra: "e", y: "1" }],
        ["ChildSchema", { extra: "e", children: [{ children: 1 }] }],
        ["MultiSchema", true],
        ["NullOnlySchema", {}],
      ];
      const sameJson = (a: unknown, b: unknown): boolean =>
        a !== null && b !== null && typeof a === "object" && typeof b === "object"
          ? Object.keys(a).length === Object.keys(b).length &&
            Object.entries(a).every(([key, value]) => sameJson(value, (b as Record<string, unknown>)[key]))
          : a === b;
      for (const [name, value] of valid) {
        const result = schemas[name]!.safeParse(value);
        assert(result.success, name + " " + JSON.stringify(value));
        // Parsing keeps the data (nothing is stripped).
        assert(sameJson(result.data, value), name + " data " + JSON.stringify(result.data));
      }
      for (const [name, value] of invalid) assert(!schemas[name]!.safeParse(value).success, name + " " + JSON.stringify(value));
      ${
        options.allReadonly
          ? `assert(Object.isFrozen(M.AllOfSchema.parse({ name: "n" })), "readonly allOf");
             assert(Object.isFrozen(M.ChildSchema.parse({ extra: "e" })), "readonly referenced allOf");`
          : ""
      }
      ${
        namespaced
          ? `const nullable: M.TypeArray = null;
             const nested: M.TypeArray = { next: null };
             const catchall: M.CatchallUnion = { id: "x", other: [{ id: "y" }] };
             assert(M.TypeArraySchema.parse(nested) !== undefined && nullable === null && catchall.id === "x", "types");`
          : ""
      }
      console.log("ok");`,
    );
    expect(output.trim()).toBe("ok");
  });
});
