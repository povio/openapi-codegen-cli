import { OpenAPIV3 } from "openapi-types";
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
    expect(models).not.toContain("ZodObject<any>");
    expect(models).toContain("export const UnrelatedSchema =");
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
