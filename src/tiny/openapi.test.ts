import fs from "fs";
import os from "os";
import path from "path";

import { afterEach, describe, expect, test } from "vitest";
import { z } from "zod";

import {
  applyEnumExtensions,
  collectContractSchemas,
  collectExtraSchemas,
  getOpenApiSchemaName,
  type ZodSchema,
  namedControllerActionInputDtoSchema,
  namedOpenApiSchema,
  namedOpenApiOutputSchema,
  schemaExportName,
  toOpenAPI30Document,
  toOpenAPI30Schema,
  generateOpenApiFile,
  resolveOpenApiOutputPath,
} from "./openapi";

const tmpRoots: string[] = [];

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function createTmpRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "openapi-codegen-tiny-"));
  tmpRoots.push(root);

  return root;
}

describe("tiny openapi file writer", () => {
  test("resolves --output before env and default output", () => {
    const root = path.resolve("/app");

    expect(
      resolveOpenApiOutputPath({
        argv: ["node", "script", "--output", "./from-flag.json"],
        cwd: root,
        defaultOutput: "./default.json",
        env: { TINY_OPENAPI_OUTPUT: "./from-env.json" },
      }),
    ).toBe(path.join(root, "from-flag.json"));
  });

  test("resolves TINY_OPENAPI_OUTPUT before default output", () => {
    const root = path.resolve("/app");

    expect(
      resolveOpenApiOutputPath({
        argv: ["node", "script"],
        cwd: root,
        defaultOutput: "./default.json",
        env: { TINY_OPENAPI_OUTPUT: "./from-env.json" },
      }),
    ).toBe(path.join(root, "from-env.json"));
  });

  test("writes generated OpenAPI JSON and reports unchanged content", async () => {
    const root = createTmpRoot();
    const output = path.join(root, "nested/openapi.json");
    const generateOpenApiSpec = () => ({ openapi: "3.0.3", info: { title: "Tiny", version: "1.0.0" } });

    await expect(
      generateOpenApiFile({
        defaultOutput: output,
        generateOpenApiSpec,
      }),
    ).resolves.toEqual({ outputPath: output, changed: true });

    expect(fs.readFileSync(output, "utf8")).toBe(
      `${JSON.stringify({ openapi: "3.0.3", info: { title: "Tiny", version: "1.0.0" } }, null, 2)}\n`,
    );

    await expect(
      generateOpenApiFile({
        defaultOutput: output,
        generateOpenApiSpec,
      }),
    ).resolves.toEqual({ outputPath: output, changed: false });
  });
});

describe("tiny ORPC openapi helpers", () => {
  test("tracks explicit schema names", () => {
    const schema = {};

    expect(getOpenApiSchemaName(schema)).toBeUndefined();
    expect(namedOpenApiSchema(schema, "PlanetDto")).toBe(schema);
    expect(getOpenApiSchemaName(schema)).toBe("PlanetDto");
  });

  test("legacy tiny naming helpers emit request and response names", () => {
    const outputSchema = {};
    const inputSchema = {};

    expect(namedOpenApiOutputSchema(outputSchema, "Planet")).toBe(outputSchema);
    expect(getOpenApiSchemaName(outputSchema)).toBe("PlanetResponse");
    expect(namedControllerActionInputDtoSchema(inputSchema, "Planet", "update")).toBe(inputSchema);
    expect(getOpenApiSchemaName(inputSchema)).toBe("PlanetControllerUpdateRequest");
  });

  test("uses request query params and response suffixes for automatic contract schemas", () => {
    const querySchema = z.object({ search: z.string().optional() });
    const paramsSchema = z.object({ id: z.string() });
    const bodySchema = z.object({ name: z.string() });
    const responseSchema = z.object({ id: z.string(), name: z.string() });
    const router = {
      aliens: {
        getLabels: {
          "~orpc": {
            inputSchema: querySchema,
            outputSchema: z.array(responseSchema),
            meta: { bl: "List labels" },
            route: { method: "GET", path: "/api/aliens/labels" },
          },
        },
      },
      planets: {
        getById: {
          "~orpc": {
            inputSchema: paramsSchema,
            outputSchema: responseSchema,
            meta: { bl: "Get planet" },
            route: { method: "GET", path: "/api/planets/{id}" },
          },
        },
        update: {
          "~orpc": {
            inputSchema: z.object({ params: paramsSchema, body: bodySchema }),
            outputSchema: responseSchema,
            meta: { bl: "Update planet" },
            route: { method: "PUT", path: "/api/planets/{id}", inputStructure: "detailed" },
          },
        },
      },
    };

    expect(Object.keys(collectContractSchemas(router))).toEqual([
      "AliensGetLabelsQuery",
      "AliensGetLabelsResponse",
      "PlanetsGetByIdParams",
      "PlanetsGetByIdResponse",
      "PlanetsUpdateParams",
      "PlanetsUpdateRequest",
      "PlanetsUpdateResponse",
    ]);
  });

  test("strips DTO from exported API model schema names without adding Dto", () => {
    const planetImageRequestSchema = z.object({ id: z.string() }) as unknown as ZodSchema;
    const getLabelsQuerySchema = z.object({ search: z.string().optional() }) as unknown as ZodSchema;

    expect(schemaExportName("planets", "PlanetImageRequestDTOSchema", planetImageRequestSchema)).toBe(
      "PlanetImageRequest",
    );
    expect(schemaExportName("aliens", "GetLabelsQueryDTOSchema", getLabelsQuerySchema)).toBe("AliensGetLabelsQuery");
  });

  test("converts OpenAPI 3.1 JSON schema output to OpenAPI 3.0 compatible schema", () => {
    expect(
      toOpenAPI30Schema({
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: ["string", "null"],
        const: "active",
      }),
    ).toEqual({
      type: "string",
      nullable: true,
      enum: ["active"],
    });

    expect(toOpenAPI30Schema({ $ref: "#/components/schemas/User", nullable: true })).toEqual({
      nullable: true,
      allOf: [{ $ref: "#/components/schemas/User" }],
    });
  });

  test("adds enum extensions and OpenAPI 3.0 document defaults", () => {
    const spec = toOpenAPI30Document({
      openapi: "3.1.0",
      paths: {
        "/health": {
          get: {
            responses: {
              "204": {
                description: "No content",
                content: { "application/json": {} },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Status: {
            type: "string",
            enum: ["active", "inactive"],
          },
        },
      },
    });

    applyEnumExtensions(spec);

    expect(spec.openapi).toBe("3.0.3");
    expect(spec.components).toMatchObject({
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
      schemas: { Status: { "x-enumNames": ["active", "inactive"] } },
    });
    expect(
      (spec.paths as Record<string, Record<string, { responses: Record<string, Record<string, unknown>> }>>)["/health"]
        .get.responses["204"].content,
    ).toBeUndefined();
  });

  test("collects extra schemas from api modules", () => {
    const schema = {};

    expect(
      collectExtraSchemas({
        planets: { extraSchemas: { PlanetDto: { schema } } },
        empty: {},
      }),
    ).toEqual({ PlanetDto: { schema } });
  });
});
