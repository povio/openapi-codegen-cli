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
    "/items": {
      post: {
        tags: ["Workspace"],
        operationId: "createItem",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Item" },
            },
          },
        },
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
    "/offices/{officeId}/positions": {
      post: {
        tags: ["Workspace"],
        operationId: "createPosition",
        "x-acl": [
          {
            action: "create",
            subject: "Position",
            conditions: {
              officeId: "$params.officeId",
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
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Position" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Position" },
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
      workspaceContext: ["officeId", "positionId", "id"],
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "getPositionQueryOptions({ officeId: normalizeOfficeId, positionId: normalizePositionId })",
    );
    expect(queriesFile?.content).toContain(
      "return getPositionQueryOptions({ officeId: normalizeOfficeId, positionId: normalizePositionId }).queryFn();",
    );
    expect(queriesFile?.content).toContain("findByIdQueryOptions({ id: normalizeId })");
    expect(queriesFile?.content).toContain(
      "const { officeId: officeIdWorkspace, positionId: positionIdWorkspace } = useWorkspaceContext<{ officeId?: string; positionId?: string }>();",
    );
    expect(queriesFile?.content).toContain("const normalizeOfficeId = officeId ?? officeIdWorkspace;");
    expect(queriesFile?.content).toContain("throw Error(`OfficeId not provided`);");

    expect(queriesFile?.content).not.toContain("getPositionQueryOptions({ normalizeOfficeId, normalizePositionId })");
    expect(queriesFile?.content).not.toContain("findByIdQueryOptions({ normalizeId })");
  });

  it("only replaces allowlisted workspace context params", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      workspaceContext: ["officeId"],
      acl: false,
      checkAcl: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "export const useGetPosition = <TData>({ officeId, positionId }: { officeId?: string, positionId: string }, options?: AppQueryOptions<typeof WorkspaceApi.getPosition, TData>) => {",
    );
    expect(queriesFile?.content).toContain("...getPositionQueryOptions({ officeId: normalizeOfficeId, positionId }),");
    expect(queriesFile?.content).toContain(
      "const { officeId: officeIdWorkspace } = useWorkspaceContext<{ officeId?: string }>();",
    );
    expect(queriesFile?.content).toContain("const normalizeOfficeId = officeId ?? officeIdWorkspace;");
    expect(queriesFile?.content).not.toContain("const normalizePositionId =");
    expect(queriesFile?.content).not.toContain("positionId: normalizePositionId");
    expect(queriesFile?.content).toContain(
      "export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof WorkspaceApi.findById, TData>) => {",
    );
    expect(queriesFile?.content).not.toContain("const normalizeId =");
  });

  it("resolves allowlisted workspace params inside mutation callbacks", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      workspaceContext: ["officeId"],
      acl: false,
      checkAcl: false,
      mutationEffects: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "export const useCreatePosition = (options?: AppMutationOptions<typeof WorkspaceApi.createPosition, { officeId?: string, data: WorkspaceModels.Position }>) => {",
    );
    expect(queriesFile?.content).toContain(
      "const { officeId: officeIdWorkspace } = useWorkspaceContext<{ officeId?: string }>();",
    );
    expect(queriesFile?.content).toContain("mutationFn: ({ officeId, data }) => { ");
    expect(queriesFile?.content).toContain("const normalizeOfficeId = officeId ?? officeIdWorkspace;");
    expect(queriesFile?.content).toContain("return WorkspaceApi.createPosition(normalizeOfficeId, data)");
  });

  it("does not emit provider onError fallback for mutations by default", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      acl: false,
      checkAcl: false,
      mutationEffects: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).not.toContain("OpenApiQueryConfig");
    expect(queriesFile?.content).not.toContain("const queryConfig = OpenApiQueryConfig.useConfig();");
    expect(queriesFile?.content).not.toContain("onError: options?.onError ?? queryConfig.onError");
  });

  it("can use OpenApiQueryConfig.onError as the default onError for mutations", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      acl: false,
      checkAcl: false,
      mutationEffects: false,
      mutationDefaultOnError: true,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "import { OpenApiQueryConfig, type AppQueryOptions, type AppMutationOptions }",
    );
    expect(queriesFile?.content).toContain("const queryConfig = OpenApiQueryConfig.useConfig();");
    expect(queriesFile?.content).toContain("onError: options?.onError ?? queryConfig.onError");
  });
});
