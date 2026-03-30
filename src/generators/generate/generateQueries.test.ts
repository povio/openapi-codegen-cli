import { describe, expect, it } from "vitest";
import { OpenAPIV3 } from "openapi-types";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "Workspace Context Test",
    version: "1.0.0",
  },
  paths: {
    "/offices/{officeId}/positions/{positionId}": {
      get: {
        tags: ["Workspace"],
        operationId: "getPosition",
        "x-acl": [
          {
            action: "read",
            subject: "Position",
            conditions: {
              officeId: "$params.officeId",
              positionId: "$params.positionId",
            },
          },
        ],
        parameters: [
          {
            name: "officeId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "positionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Position" },
              },
            },
          },
          403: {
            description: "Forbidden",
          },
        },
      } as OpenAPIV3.OperationObject,
    },
    "/items/{id}": {
      get: {
        tags: ["Workspace"],
        operationId: "findById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Item" },
              },
            },
          },
        },
      } as OpenAPIV3.OperationObject,
    },
  },
  components: {
    schemas: {
      Position: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      Item: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
} as OpenAPIV3.Document;

describe("generateQueries workspaceContext", () => {
  it("maps workspace-resolved values back to the original helper property names", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      workspaceContext: true,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "getPositionQueryOptions({ officeId: officeIdFromWorkspace, positionId: positionIdFromWorkspace })",
    );
    expect(queriesFile?.content).toContain(
      "return getPositionQueryOptions({ officeId: officeIdFromWorkspace, positionId: positionIdFromWorkspace }).queryFn();",
    );
    expect(queriesFile?.content).toContain("findByIdQueryOptions({ id: idFromWorkspace })");

    expect(queriesFile?.content).not.toContain(
      "getPositionQueryOptions({ officeIdFromWorkspace, positionIdFromWorkspace })",
    );
    expect(queriesFile?.content).not.toContain("findByIdQueryOptions({ idFromWorkspace })");
  });
});
