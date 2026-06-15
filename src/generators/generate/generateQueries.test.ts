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
  it("passes runtime allowInvalidResponseData config through generated GET query hooks", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      acl: false,
      checkAcl: false,
      mutationEffects: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const apiFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.api.ts"));
    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(apiFile?.content).toContain(
      "export const getPosition = (officeId: string, positionId: string, config?: AxiosRequestConfig & { allowInvalidResponseData?: boolean })",
    );
    expect(apiFile?.content).toContain("{ resSchema: WorkspaceModels.PositionSchema },");
    expect(apiFile?.content).not.toContain("allowInvalidResponseData: true");
    expect(apiFile?.content).toContain(
      "export const createPosition = (officeId: string, data: WorkspaceModels.Position, )",
    );
    expect(queriesFile?.content).toContain("const queryConfig = OpenApiQueryConfig.useConfig();");
    expect(queriesFile?.content).toContain(
      "...getPositionQueryOptions({ officeId, positionId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData }),",
    );
  });

  it("passes runtime allowInvalidResponseData config through inline GET query hooks", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      inlineEndpoints: true,
      acl: false,
      checkAcl: false,
      mutationEffects: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.queries.ts"));

    expect(queriesFile?.content).toContain(
      "const getPosition = (officeId: string, positionId: string, config?: AxiosRequestConfig & { allowInvalidResponseData?: boolean })",
    );
    expect(queriesFile?.content).toContain("{ resSchema: WorkspaceModels.PositionSchema },");
    expect(queriesFile?.content).not.toContain("allowInvalidResponseData: true");
    expect(queriesFile?.content).toContain(
      "...getPositionQueryOptions({ officeId, positionId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData }),",
    );
  });

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
      "getPositionQueryOptions({ officeId: normalizeOfficeId, positionId: normalizePositionId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData })",
    );
    expect(queriesFile?.content).toContain(
      "return getPositionQueryOptions({ officeId: normalizeOfficeId, positionId: normalizePositionId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData }).queryFn();",
    );
    expect(queriesFile?.content).toContain(
      "findByIdQueryOptions({ id: normalizeId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData })",
    );
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
    expect(queriesFile?.content).toContain(
      "...getPositionQueryOptions({ officeId: normalizeOfficeId, positionId }, { allowInvalidResponseData: queryConfig.allowInvalidResponseData }),",
    );
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

  it("emits context-aware ACL hooks for allowlisted workspace conditions", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      workspaceContext: ["officeId"],
      builderConfigs: false,
      prefetchQueries: false,
    });

    const aclFile = files.find((file) => file.fileName.endsWith("/workspace/workspace.acl.ts"));

    expect(aclFile?.content).toContain('import { useWorkspaceContext } from "@povio/openapi-codegen-cli";');
    expect(aclFile?.content).toContain("object?: { officeId: string, positionId: string,  }");
    expect(aclFile?.content).toContain("export const useCanUseGetPosition = (");
    expect(aclFile?.content).toContain("object: { officeId?: string, positionId: string,  }");
    expect(aclFile?.content).toContain(
      "const { officeId: officeIdWorkspace } = useWorkspaceContext<{ officeId?: string }>();",
    );
    expect(aclFile?.content).toContain("const normalizeOfficeId = object?.officeId ?? officeIdWorkspace;");
    expect(aclFile?.content).toContain("throw Error(`OfficeId not provided`);");
    expect(aclFile?.content).toContain("return canUseGetPosition({ ...object, officeId: normalizeOfficeId });");
    expect(aclFile?.content).not.toContain("positionId: normalizePositionId");
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

    expect(queriesFile?.content).toContain("OpenApiQueryConfig");
    expect(queriesFile?.content).toContain("const queryConfig = OpenApiQueryConfig.useConfig();");
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

const paginatedDoc = {
  openapi: "3.0.0",
  info: { title: "Paginated Test", version: "1.0.0" },
  paths: {
    "/items": {
      get: {
        tags: ["items"],
        operationId: "listItems",
        "x-acl": [
          {
            action: "read",
            subject: "Item",
          },
        ],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ItemsPage" } } },
          },
        },
      } as OpenAPIV3.OperationObject,
      post: {
        tags: ["items"],
        operationId: "createItem",
        "x-acl": [
          {
            action: "create",
            subject: "Item",
          },
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } },
          },
        },
      } as OpenAPIV3.OperationObject,
    },
  },
  components: {
    schemas: {
      Item: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
      ItemsPage: {
        type: "object",
        properties: {
          items: { type: "array", items: { $ref: "#/components/schemas/Item" } },
          page: { type: "integer" },
          totalItems: { type: "integer" },
          limit: { type: "integer" },
        },
        required: ["items", "limit"],
      },
    },
  },
} as OpenAPIV3.Document;

describe("generateQueries mutationEffects + infiniteQuery", () => {
  it("allows ACL-protected hooks to skip ACL checks for auth bootstrap calls", () => {
    const files = generateCodeFromOpenAPIDoc(paginatedDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      mutationEffects: true,
      infiniteQueries: true,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/items/items.queries.ts"));

    expect(queriesFile?.content).toContain("const { skipAcl, ...queryOptions } = options ?? {};");
    expect(queriesFile?.content).toContain("if (!skipAcl) {");
    expect(queriesFile?.content).toContain("checkAcl(ItemsAcl.canUseList());");
    expect(queriesFile?.content).toContain("checkAcl(ItemsAcl.canUseCreate());");
    expect(queriesFile?.content).toContain("...queryOptions,");
    expect(queriesFile?.content).not.toContain("...options,");
  });

  it("emits QueryModule.tag (no typeof) in useMutationEffects type arg", () => {
    const files = generateCodeFromOpenAPIDoc(paginatedDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      mutationEffects: true,
      infiniteQueries: true,
      acl: false,
      checkAcl: false,
      builderConfigs: false,
      prefetchQueries: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/items/items.queries.ts"));

    // Bug 1: const enum must be referenced directly, not via typeof
    expect(queriesFile?.content).toContain("useMutationEffects<QueryModule.items>");
    expect(queriesFile?.content).not.toContain("useMutationEffects<typeof QueryModule.items>");

    // Bug 2: MutationEffectsOptions must have no type arg so invalidateModules stays QueryModule[] (cross-module capable)
    expect(queriesFile?.content).toContain("& MutationEffectsOptions)");
    expect(queriesFile?.content).not.toContain("MutationEffectsOptions<QueryModule");

    // Bug 3: getNextPageParam parameter has an explicit type annotation (no implicit any)
    expect(queriesFile?.content).toContain("}: Awaited<ReturnType<typeof ItemsApi.list>>)");
    expect(queriesFile?.content).toContain("pageParam * limitParam < (totalItems ?? 0)");
    // queryFn retains precise pageParam: number typing
    expect(queriesFile?.content).toContain("queryFn: ({ pageParam }: { pageParam: number })");
    // no unknown casts or pages: 1 in the shared options factory
    expect(queriesFile?.content).not.toContain("pageParam: unknown");
    expect(queriesFile?.content).not.toContain("pages: 1,");
  });

  it("prefetchInfiniteQuery casts options to {} and emits no pages", () => {
    const files = generateCodeFromOpenAPIDoc(paginatedDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      mutationEffects: false,
      infiniteQueries: true,
      prefetchQueries: true,
      acl: false,
      checkAcl: false,
      builderConfigs: false,
    });

    const queriesFile = files.find((file) => file.fileName.endsWith("/items/items.queries.ts"));

    // options is cast to {} so it contributes no typed properties to the spread; without the cast
    // the options type defaults prefetchInfiniteQuery generics to unknown, which conflicts with the
    // generated queryFn expecting pageParam: number.
    expect(queriesFile?.content).toContain("...(options as {})");
    // no pages emitted anywhere
    expect(queriesFile?.content).not.toContain("pages:");
  });
});
