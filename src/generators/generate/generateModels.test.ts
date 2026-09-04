import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { getDataFromOpenAPIDoc } from "@/generators/core/getDataFromOpenAPIDoc";

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

  test("generated compiled schemas retain runtime behavior", async () => {
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
      splitByTags: false,
      tsNamespaces: false,
    };
    const { resolver, data } = getDataFromOpenAPIDoc(doc, options);
    const models = generateModels({ resolver, data, tag: options.defaultTag });
    expect(models).toBeDefined();
    if (!models) {
      throw new Error("Expected generated models");
    }
    const tempDir = await fs.mkdtemp(path.join(process.cwd(), ".generated-models-"));
    const modulePath = path.join(tempDir, "models.mjs");

    try {
      const javascript = ts.transpile(models, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext });
      await fs.writeFile(modulePath, javascript);
      const generated = await import(`${pathToFileURL(modulePath).href}?cacheBust=${Date.now()}`);

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
  });

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
