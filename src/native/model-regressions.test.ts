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
  });
});

const assert = `const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };`;

describe("generated models of test/renderer-regressions.yaml", () => {
  test.each([
    { name: "namespaces", options: {}, namespaced: true },
    { name: "lazy schemas", options: { lazySchemas: true }, namespaced: true },
    { name: "models in modules", options: { modelsInModules: true }, namespaced: true },
    { name: "no namespaces", options: { tsNamespaces: false }, namespaced: false },
  ])("typecheck, load and validate with $name", async ({ options, namespaced }) => {
    const source = await readFile("test/renderer-regressions.yaml", "utf8");
    const imports = namespaced
      ? `import { TrackingModels } from "./tracking/tracking.models";
         import { RulesModels } from "./rules/rules.models";
         const { RefreshProvider400ErrorResponseSchema } = TrackingModels;
         const { RuleNodeSchema, RuleDtoSchema } = RulesModels;`
      : `import { RefreshProvider400ErrorResponseSchema } from "./tracking/tracking.models";
         import { RuleNodeSchema, RuleDtoSchema } from "./rules/rules.models";`;
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
