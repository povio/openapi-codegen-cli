import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { getDataFromOpenAPIDoc } from "@/generators/core/getDataFromOpenAPIDoc";
import { getNativeBindings } from "@/native/native-bindings";

import { generateModels } from "./generateModels";

describe("generateModels", () => {
  test("adds explicit Zod object annotations to mutually recursive schemas", () => {
    const doc = {
      openapi: "3.0.3",
      info: { title: "Recursive schemas", version: "1.0.0" },
      paths: {},
      components: {
        schemas: {
          Player: {
            type: "object",
            properties: {
              access_tags: { type: "array", items: { $ref: "#/components/schemas/AccessTag" } },
            },
          },
          AccessTag: {
            type: "object",
            properties: { player: { $ref: "#/components/schemas/Player" } },
          },
          Unrelated: {
            type: "object",
            properties: { name: { type: "string" } },
          },
        },
      },
    } as OpenAPIV3.Document;
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      compileSchemas: true,
      excludeRedundantZodSchemas: false,
      splitByTags: false,
      tsNamespaces: false,
    };
    const { resolver, data } = getDataFromOpenAPIDoc(doc, options);

    const models = generateModels({ resolver, data, tag: options.defaultTag });

    expect(models).toContain("export type Player = { access_tags?: Array<AccessTag> };");
    expect(models).toContain("export type AccessTag = { player?: Player };");
    expect(models).toContain("export const PlayerSchema: z.ZodObject<z.ZodRawShape> & z.ZodType<Player> =");
    expect(models).toContain("export const AccessTagSchema: z.ZodObject<z.ZodRawShape> & z.ZodType<AccessTag> =");
    expect(models).not.toContain(
      "export const PlayerSchema: z.ZodObject<z.ZodRawShape> & z.ZodType<Player> = z.compile(",
    );
    expect(models).not.toContain(
      "export const AccessTagSchema: z.ZodObject<z.ZodRawShape> & z.ZodType<AccessTag> = z.compile(",
    );
    expect(models).not.toContain("ZodObject<any>");
    expect(models).toContain("export const UnrelatedSchema = z.compile(z.object(");
  });

  test("compiles every non-circular generated schema", () => {
    const doc = {
      openapi: "3.0.3",
      info: { title: "Compiled schemas", version: "1.0.0" },
      paths: {},
      components: {
        schemas: {
          Status: { type: "string", enum: ["active", "inactive"] },
          User: {
            type: "object",
            required: ["status"],
            properties: { status: { $ref: "#/components/schemas/Status" } },
          },
        },
      },
    } as OpenAPIV3.Document;
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      compileSchemas: true,
      excludeRedundantZodSchemas: false,
      splitByTags: false,
      tsNamespaces: false,
    };
    const { resolver, data } = getDataFromOpenAPIDoc(doc, options);

    const models = generateModels({ resolver, data, tag: options.defaultTag });

    expect(models).toContain('export const StatusSchema = z.compile(z.enum(["active", "inactive"]));');
    expect(models).toContain("export const UserSchema = z.compile(z.object({ status: StatusSchema }));");
    expect(models).toContain("export const Status = StatusSchema.enum;");
  });

  test.each(
    [undefined, false, true].flatMap((compileSchemas) =>
      ["typescript", "native"].flatMap((backend) =>
        [false, true].map((tsNamespaces) => ({ compileSchemas, backend, tsNamespaces })),
      ),
    ),
  )(
    "validates without a compile import ($backend, compileSchemas=$compileSchemas, namespaces=$tsNamespaces)",
    async ({ compileSchemas, backend, tsNamespaces }) => {
      const doc = {
        openapi: "3.0.3",
        info: { title: "Compiled schema runtime", version: "1.0.0" },
        paths: {},
        components: {
          schemas: {
            Status: { type: "string", enum: ["active", "inactive"] },
            User: {
              type: "object",
              required: ["status"],
              properties: { status: { $ref: "#/components/schemas/Status" } },
            },
            Category: {
              type: "object",
              required: ["name", "children"],
              properties: {
                name: { type: "string" },
                children: { type: "array", items: { $ref: "#/components/schemas/Category" } },
              },
            },
          },
        },
      } as OpenAPIV3.Document;
      const options = {
        ...DEFAULT_GENERATE_OPTIONS,
        excludeRedundantZodSchemas: false,
        splitByTags: true,
        modelsInCommon: true,
        tsNamespaces,
        compileSchemas,
      };
      const models =
        backend === "native"
          ? (
              getNativeBindings().compileData(JSON.stringify(doc), false, JSON.stringify(options)).data as {
                renderedModels: Record<string, string>;
              }
            ).renderedModels[options.defaultTag]
          : (() => {
              const { resolver, data } = getDataFromOpenAPIDoc(doc, options);
              return generateModels({ resolver, data, tag: options.defaultTag });
            })();
      expect(models).toBeDefined();
      if (!models) {
        throw new Error("Expected generated models");
      }
      expect(models.includes("z.compile(")).toBe(compileSchemas === true);
      expect(models).not.toContain("zod/compile");
      expect(models).not.toMatch(/CategorySchema[^\n]*= z\.compile/);
      const tempDir = await fs.mkdtemp(path.join(process.cwd(), ".generated-models-"));
      const modulePath = path.join(tempDir, "models.ts");

      try {
        await fs.writeFile(modulePath, models);
        const module = await import(`${pathToFileURL(modulePath).href}?cacheBust=${Date.now()}`);
        const generated = tsNamespaces ? module.CommonModels : module;

        expect(generated.Status).toEqual({ active: "active", inactive: "inactive" });
        expect(generated.UserSchema.safeParse({ status: "active" }).success).toBe(true);
        expect(generated.UserSchema.safeParse({ status: "unknown" }).success).toBe(false);

        const category: { name: string; children: unknown[] } = { name: "root", children: [] };
        category.children.push(category);
        const parsedCategory = generated.CategorySchema.parse(category);
        expect(parsedCategory.children[0]).toBe(parsedCategory);
        expect(generated.CategorySchema.safeParse({ name: 1, children: [] }).success).toBe(false);
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    },
  );

  test("uses lazy properties for circular refs inside allOf object composition", () => {
    const doc = {
      openapi: "3.0.3",
      info: { title: "AllOf recursive schemas", version: "1.0.0" },
      paths: {
        "/team-players": {
          get: {
            tags: ["teams"],
            responses: {
              200: {
                description: "ok",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/TeamPlayer" },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Base: {
            type: "object",
            properties: {
              id: { type: "integer" },
            },
          },
          TeamPlayer: {
            allOf: [
              { $ref: "#/components/schemas/Base" },
              {
                type: "object",
                properties: {
                  Team: {
                    type: "object",
                    nullable: true,
                    allOf: [{ $ref: "#/components/schemas/SeasonTeam" }],
                  },
                },
              },
            ],
          },
          SeasonTeam: {
            allOf: [
              { $ref: "#/components/schemas/Base" },
              {
                type: "object",
                properties: {
                  TeamPlayers: {
                    type: "array",
                    nullable: true,
                    items: { $ref: "#/components/schemas/TeamPlayer" },
                  },
                },
              },
            ],
          },
        },
      },
    } as OpenAPIV3.Document;
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: false,
      tsNamespaces: false,
      replaceOptionalWithNullish: true,
    };
    const { resolver, data } = getDataFromOpenAPIDoc(doc, options);

    const models = generateModels({ resolver, data, tag: options.defaultTag });

    expect(models).toContain("Team: z.lazy(() => SeasonTeamSchema.nullable())");
    expect(models).toContain("TeamPlayers: z.lazy(() => z.array(TeamPlayerSchema).nullable())");
    expect(models).not.toContain("get Team()");
    expect(models).not.toContain("get TeamPlayers()");
  });
});

describe("generateModels lazySchemas", () => {
  const doc = {
    openapi: "3.0.3",
    info: { title: "Lazy schemas", version: "1.0.0" },
    paths: {
      "/users": {
        get: {
          tags: ["users"],
          responses: {
            200: {
              description: "ok",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Status: { type: "string", enum: ["active", "inactive"] },
        User: {
          type: "object",
          required: ["status"],
          properties: {
            status: { $ref: "#/components/schemas/Status" },
            code: { type: "string", pattern: "^[A-Z]{2}/[0-9]+$" },
            Status: { type: "string" },
          },
        },
        Category: {
          type: "object",
          required: ["name", "children"],
          properties: {
            name: { type: "string" },
            children: { type: "array", items: { $ref: "#/components/schemas/Category" } },
          },
        },
      },
    },
  } as OpenAPIV3.Document;

  const render = (backend: "typescript" | "native", options: typeof DEFAULT_GENERATE_OPTIONS, tag: string) => {
    if (backend === "native") {
      const { renderedModels } = getNativeBindings().compileData(JSON.stringify(doc), false, JSON.stringify(options))
        .data as { renderedModels: Record<string, string> };
      return renderedModels[tag];
    }
    const { resolver, data } = getDataFromOpenAPIDoc(doc, options);
    return generateModels({ resolver, data, tag });
  };

  test("emits memoized factories, getters and a declared namespace", () => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: true,
      modelsInModules: true,
      tsNamespaces: true,
      lazySchemas: true,
    };

    const models = render("typescript", options, "users");

    expect(models).toContain("const once = <T>(create: () => T) => {");
    expect(models).toContain('const StatusSchema = once(() => z.enum(["active", "inactive"]));');
    expect(models).toContain("const Status = once(() => StatusSchema().enum);");
    // Sibling schemas become calls; object keys, member accesses and regex literals are untouched.
    expect(models).toContain(
      "const UserSchema = once(() => z.object({ status: StatusSchema(), code: z.string().regex(/^[A-Z]{2}\\/[0-9]+$/).optional(), Status: z.string().optional() }));",
    );
    expect(models).toContain("export const UsersModels = {");
    expect(models).toContain("  get UserSchema() {\n    return UserSchema();\n  },");
    expect(models).toContain("  get Status() {\n    return Status();\n  },");
    expect(models).toContain("export declare namespace UsersModels {");
    expect(models).toContain("  export type User = z.infer<typeof UsersModels.UserSchema>;");
    expect(models).not.toContain("export namespace");
    expect(models).not.toContain("export const UserSchema");
  });

  test("types circular schemas through the declared namespace", () => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: false,
      tsNamespaces: true,
      lazySchemas: true,
    };

    const models = render("typescript", options, options.defaultTag);

    expect(models).toContain(
      "const CategorySchema: () => z.ZodObject<z.ZodRawShape> & z.ZodType<CommonModels.Category> = once(",
    );
    expect(models).toContain("export declare namespace CommonModels {");
    expect(models).toContain("  export type Category = { name: string; children: Array<Category> };");
  });

  test("compiles non-circular factories when compileSchemas is enabled", () => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: false,
      tsNamespaces: true,
      lazySchemas: true,
      compileSchemas: true,
    };

    const models = render("typescript", options, options.defaultTag);

    expect(models).toContain('const StatusSchema = once(() => z.compile(z.enum(["active", "inactive"])));');
    expect(models).not.toMatch(/CategorySchema[^\n]*z\.compile/);
  });

  test("proxies common models through lazy getters", () => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: true,
      tsNamespaces: true,
      modelsInCommon: true,
      lazySchemas: true,
    };

    const proxy = render("typescript", options, "users");

    expect(proxy).toContain("export const UsersModels = {");
    expect(proxy).toContain("  get UserSchema() {\n    return CommonModels.UserSchema;\n  },");
    expect(proxy).toContain("  get Status() {\n    return CommonModels.Status;\n  },");
    expect(proxy).toContain("export declare namespace UsersModels {\n  export type User = CommonModels.User;");
    expect(proxy).not.toContain("export namespace");
  });

  test.each(["typescript", "native"] as const)("native output matches typescript output (%s)", (backend) => {
    for (const layout of [{ modelsInCommon: true }, { modelsInModules: true }, {}]) {
      const options = {
        ...DEFAULT_GENERATE_OPTIONS,
        excludeRedundantZodSchemas: false,
        splitByTags: true,
        tsNamespaces: true,
        lazySchemas: true,
        ...layout,
      };
      const models = render(backend, options, "users");
      expect(models).toBeDefined();
      expect(models).toContain("export const UsersModels = {");
      expect(models).toContain("export declare namespace UsersModels {");
    }
  });

  test.each(["typescript", "native"] as const)("builds schemas on first access at runtime (%s)", async (backend) => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      excludeRedundantZodSchemas: false,
      splitByTags: true,
      modelsInCommon: true,
      tsNamespaces: true,
      lazySchemas: true,
    };
    const models = render(backend, options, options.defaultTag);
    expect(models).toBeDefined();
    if (!models) {
      throw new Error("Expected generated models");
    }
    const tempDir = await fs.mkdtemp(path.join(process.cwd(), ".generated-lazy-models-"));
    const modulePath = path.join(tempDir, "models.ts");

    try {
      await fs.writeFile(modulePath, models);
      const module = await import(`${pathToFileURL(modulePath).href}?cacheBust=${Date.now()}`);
      const generated = module.CommonModels;

      expect(Object.keys(generated)).toEqual(["StatusSchema", "Status", "UserSchema", "CategorySchema"]);
      expect(generated.Status).toEqual({ active: "active", inactive: "inactive" });
      expect(generated.UserSchema).toBe(generated.UserSchema);
      expect(generated.UserSchema.safeParse({ status: "active", code: "AB/12" }).success).toBe(true);
      expect(generated.UserSchema.safeParse({ status: "active", code: "ab" }).success).toBe(false);
      expect(generated.UserSchema.safeParse({ status: "unknown" }).success).toBe(false);
      expect(Object.keys(generated.UserSchema.shape)).toEqual(["status", "code", "Status"]);
      expect(generated.UserSchema.shape.status).toBe(generated.StatusSchema);

      const category: { name: string; children: unknown[] } = { name: "root", children: [] };
      category.children.push(category);
      const parsedCategory = generated.CategorySchema.parse(category);
      expect(parsedCategory.children[0]).toBe(parsedCategory);
      expect(generated.CategorySchema.safeParse({ name: 1, children: [] }).success).toBe(false);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
