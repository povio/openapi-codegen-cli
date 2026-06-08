import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

const openApiDoc = {
  openapi: "3.0.3",
  info: { title: "Mutation Scope Test", version: "1.0.0" },
  paths: {
    "/users/{userId}/documents/{documentId}": {
      put: {
        tags: ["documents"],
        operationId: "updateDocument",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "documentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateDocumentBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Document" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["documents"],
        operationId: "deleteDocument",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "documentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": {
            description: "Deleted",
          },
        },
      },
    },
    "/documents": {
      post: {
        tags: ["documents"],
        operationId: "createDocument",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateDocumentBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Document" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/avatar": {
      post: {
        tags: ["documents"],
        operationId: "uploadAvatar",
        "x-media-upload": true,
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/octet-stream": {
              schema: { type: "string", format: "binary" },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UploadInstructions" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Document: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
        },
      },
      UpdateDocumentBody: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string" },
        },
      },
      UploadInstructions: {
        type: "object",
        properties: {
          url: { type: "string" },
          method: { type: "string" },
        },
      },
    },
  },
} as unknown as OpenAPIV3.Document;

const options = {
  ...DEFAULT_GENERATE_OPTIONS,
  mutationEffects: false,
  mutationScope: true,
} as GenerateOptions;

describe("generateCodeFromOpenAPIDoc", () => {
  test("generates resource-scoped mutations from path params", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, options);
    const queries = files.find(({ fileName }) => fileName === "output/documents/documents.queries.ts")?.content;

    expect(queries).toBeDefined();

    // PUT with path params + body: path params become first arg, body stays in mutationFn, scope added
    expect(queries).toContain(
      "export const useUpdate = ({ userId, documentId }: { userId: string; documentId: string }, options?: AppMutationOptions<typeof DocumentsApi.update, { data: DocumentsModels.UpdateDocumentBody }>) => {",
    );
    expect(queries).toContain("mutationFn: ({ data }) =>");
    expect(queries).toContain("DocumentsApi.update(userId, documentId, data)");
    expect(queries).toContain("scope: { id: `update:${userId}:${documentId}` }");

    // DELETE with only path params: path params become first arg, mutationFn has no args, no TVariables type arg
    expect(queries).toContain(
      "export const useDeleteDocument = ({ userId, documentId }: { userId: string; documentId: string }, options?: AppMutationOptions<typeof DocumentsApi.deleteDocument>) => {",
    );
    expect(queries).toContain("mutationFn: () =>");
    expect(queries).toContain("DocumentsApi.deleteDocument(userId, documentId)");
    expect(queries).toContain("scope: { id: `deleteDocument:${userId}:${documentId}` }");

    // POST without path params: no scope, no API change
    expect(queries).toContain(
      "export const useCreate = (options?: AppMutationOptions<typeof DocumentsApi.create, { data: DocumentsModels.UpdateDocumentBody }>) => {",
    );
    expect(queries).not.toContain("scope: { id: `create");

    // POST with path params + media upload: POST is excluded from scoping, no API change
    expect(queries).toContain(
      "export const useUploadAvatar = (options?: AppMutationOptions<typeof DocumentsApi.uploadAvatar, { userId: string, data: string, file?: File;",
    );
    expect(queries).toContain("mutationFn: async ({ userId, data, file, abortController, onUploadProgress }) => {");
    expect(queries).toContain("DocumentsApi.uploadAvatar(userId, data)");
    expect(queries).not.toContain("scope: { id: `uploadAvatar:${userId}` }");
  });
});

describe("generateCodeFromOpenAPIDoc - modelsInCommon regressions", () => {
  const regressionDoc = {
    openapi: "3.0.3",
    info: { title: "modelsInCommon regression", version: "1.0.0" },
    paths: {
      "/auth/token": {
        get: {
          tags: ["auth"],
          operationId: "getToken",
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AuthnTokenDto" } } },
            },
          },
        },
      },
      "/employee-roles": {
        get: {
          tags: ["employeeRoles"],
          operationId: "list",
          parameters: [
            {
              name: "sort",
              in: "query",
              schema: {
                allOf: [{ $ref: "#/components/schemas/SortExpression" }],
                nullable: true,
                "x-enumNames": ["Name"],
              },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeRolesListResponse" } } },
            },
          },
        },
      },
      "/employee-permissions/paginate": {
        post: {
          tags: ["employeePermissions"],
          operationId: "paginatePermissions",
          "x-acl": [
            {
              action: "Read",
              subject: "Permission",
              conditions: {
                context: "$body",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/EmployeePermissionContext" } },
            },
          },
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PermissionPage" } } },
            },
          },
        },
      },
      "/folders": {
        get: {
          tags: ["folders"],
          operationId: "listFolders",
          parameters: [
            {
              name: "filter",
              in: "query",
              schema: { $ref: "#/components/schemas/FolderContentFilterDto" },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/FolderContentPage" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        AuthnTokenDto: {
          type: "object",
          properties: { token: { type: "string" } },
          required: ["token"],
        },
        SortExpression: {
          type: "string",
        },
        EmployeeRolesListResponse: {
          type: "object",
          properties: { data: { type: "array", items: { type: "string" } } },
        },
        EmployeePermissionContext: {
          type: "object",
          properties: { employeeId: { type: "string" } },
          required: ["employeeId"],
        },
        PermissionPage: {
          type: "object",
          properties: { data: { type: "array", items: { type: "string" } } },
        },
        FolderContentFilterDto: {
          type: "object",
          properties: { search: { type: "string" } },
        },
        FolderContentPage: {
          type: "object",
          properties: { data: { type: "array", items: { type: "string" } } },
        },
      },
    },
  } as unknown as OpenAPIV3.Document;

  const regressionOptions = {
    ...DEFAULT_GENERATE_OPTIONS,
    output: "output",
    modelsInCommon: true,
    builderConfigs: false,
    prefetchQueries: false,
    mutationEffects: false,
  } as GenerateOptions;

  test("uses local model proxies in API files when models are generated in common", () => {
    const files = generateCodeFromOpenAPIDoc(regressionDoc, regressionOptions);
    const authApi = files.find(({ fileName }) => fileName === "output/auth/auth.api.ts")?.content;

    expect(authApi).toContain('import { AuthModels } from "./auth.models";');
    expect(authApi).toContain("{ resSchema: AuthModels.AuthnTokenDtoSchema }");
    expect(authApi).not.toContain("CommonModels.AuthnTokenDtoSchema");
  });

  test("turns x-enumNames order parameters into sort expression parsing", () => {
    const files = generateCodeFromOpenAPIDoc(regressionDoc, regressionOptions);
    const employeeRolesApi = files.find(
      ({ fileName }) => fileName === "output/employeeRoles/employeeRoles.api.ts",
    )?.content;

    expect(employeeRolesApi).toContain(
      'sort: ZodExtended.parse(ZodExtended.sortExp(EmployeeRolesModels.EmployeeRolesListSortParamEnumSchema).nullish(), sort, { type: "query", name: "sort" })',
    );
    expect(employeeRolesApi).not.toContain("sort: ZodExtended.parse(EmployeeRolesModels.ListSortParamSchema");
  });

  test("keeps ACL conditions typed through local model proxies", () => {
    const files = generateCodeFromOpenAPIDoc(regressionDoc, regressionOptions);
    const employeePermissionsAcl = files.find(
      ({ fileName }) => fileName === "output/employeePermissions/employeePermissions.acl.ts",
    )?.content;

    expect(employeePermissionsAcl).toContain(
      'import { EmployeePermissionsModels } from "./employeePermissions.models";',
    );
    expect(employeePermissionsAcl).toContain(
      "object?: { context: EmployeePermissionsModels.EmployeePermissionContext,  }",
    );
    expect(employeePermissionsAcl).toContain('subject("Permission", object) : "Permission"');
  });

  test("keeps used DTO aliases exported from tag model proxies", () => {
    const files = generateCodeFromOpenAPIDoc(regressionDoc, regressionOptions);
    const foldersModels = files.find(({ fileName }) => fileName === "output/folders/folders.models.ts")?.content;

    expect(foldersModels).toContain("export type FolderContentFilterDto = CommonModels.FolderContentFilterDto;");
  });
});

describe("generateCodeFromOpenAPIDoc - inline enum validation for domain error schemas", () => {
  // Doc with two endpoints:
  //   - rockets launch: 400 response carries x-domain-error-domain with inline status/code enums
  //   - widgets list:   200 response has a plain inline enum (no x-domain-error-domain)
  const mixedDoc = {
    openapi: "3.0.3",
    info: { title: "Domain Error Enum Test", version: "1.0.0" },
    paths: {
      "/rockets/{id}/launch": {
        post: {
          tags: ["rockets"],
          operationId: "RocketController_launch",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "Launched",
              content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } },
            },
            "400": {
              description: "Could not launch",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    "x-domain-error-domain": "rocket",
                    properties: {
                      status: { type: "string", enum: ["error"] },
                      code: { type: "number", enum: [1001] },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/widgets": {
        get: {
          tags: ["widgets"],
          operationId: "WidgetController_list",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["active", "inactive"] },
                    },
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
        StatusResponse: { type: "object", properties: { status: { type: "string" } } },
      },
    },
  } as unknown as OpenAPIV3.Document;

  test("does not produce not-allowed-inline-enum errors for schemas with x-domain-error-domain", () => {
    const { resolver } = getDataFromOpenAPIDoc(mixedDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const inlineEnumErrors = resolver.validationErrors.filter((e) => e.type === "not-allowed-inline-enum");

    expect(inlineEnumErrors.every((e) => !e.message.includes("RocketController_launch"))).toBe(true);
  });

  test("still produces not-allowed-inline-enum errors for normal schemas without x-domain-error-domain", () => {
    const { resolver } = getDataFromOpenAPIDoc(mixedDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const inlineEnumErrors = resolver.validationErrors.filter((e) => e.type === "not-allowed-inline-enum");

    expect(inlineEnumErrors.some((e) => e.message.includes("WidgetController_list"))).toBe(true);
  });

  test("generates inline z.enum for domain error status field and does not emit StatusEnumSchema", () => {
    const files = generateCodeFromOpenAPIDoc(mixedDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const rocketsModels = files.find(({ fileName }) => fileName === "output/rockets/rockets.models.ts")?.content;

    expect(rocketsModels).toBeDefined();
    expect(rocketsModels).toContain('z.enum(["error"])');
    expect(rocketsModels).not.toContain("StatusEnumSchema");
  });
});

describe("generateCodeFromOpenAPIDoc - shared response schema namespace", () => {
  // StatusResponse is referenced by both rockets and pilots, so the resolver assigns it
  // to the defaultTag ("Common"). The endpoint generator must not force the endpoint's
  // own tag as the namespace prefix, or it would emit RocketsModels.StatusResponseSchema
  // instead of CommonModels.StatusResponseSchema, leaving resSchema undefined at runtime.
  const sharedSchemaDoc = {
    openapi: "3.0.3",
    info: { title: "Shared Schema Test", version: "1.0.0" },
    paths: {
      "/api/rockets/{id}/launch": {
        post: {
          tags: ["rockets"],
          operationId: "launchRocket",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "201": {
              description: "Launched",
              content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } },
            },
          },
        },
      },
      "/api/rockets/{id}": {
        delete: {
          tags: ["rockets"],
          operationId: "deleteRocket",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "Deleted",
              content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } },
            },
          },
        },
      },
      "/api/pilots/{id}": {
        delete: {
          tags: ["pilots"],
          operationId: "deletePilot",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "Deleted",
              content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } },
            },
          },
        },
      },
      "/api/rockets": {
        get: {
          tags: ["rockets"],
          operationId: "getRockets",
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/RocketResponse" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        StatusResponse: {
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" },
            code: { type: "string" },
          },
        },
        RocketResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  } as unknown as OpenAPIV3.Document;

  test("uses the owning namespace (CommonModels) for a response schema shared across tags", () => {
    const files = generateCodeFromOpenAPIDoc(sharedSchemaDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const rocketsApi = files.find(({ fileName }) => fileName === "output/rockets/rockets.api.ts")?.content;

    expect(rocketsApi).toBeDefined();
    expect(rocketsApi).toContain("CommonModels.StatusResponseSchema");
    expect(rocketsApi).not.toContain("RocketsModels.StatusResponseSchema");
  });

  test("emits correct resSchema namespace for launch and delete endpoints", () => {
    const files = generateCodeFromOpenAPIDoc(sharedSchemaDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const rocketsApi = files.find(({ fileName }) => fileName === "output/rockets/rockets.api.ts")?.content;

    expect(rocketsApi).toContain("resSchema: CommonModels.StatusResponseSchema");
  });

  test("uses the tag's own namespace for a response schema owned by a single tag", () => {
    // RocketResponse is referenced only by the rockets tag, so getTagByZodSchemaName
    // returns "rockets" and the generator must emit RocketsModels.RocketResponseSchema.
    // This guards against a regression where auto-detection collapses all schemas into
    // CommonModels regardless of ownership.
    const files = generateCodeFromOpenAPIDoc(sharedSchemaDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
    const rocketsApi = files.find(({ fileName }) => fileName === "output/rockets/rockets.api.ts")?.content;

    expect(rocketsApi).toContain("RocketsModels.RocketResponseSchema");
    expect(rocketsApi).not.toContain("CommonModels.RocketResponseSchema");
  });
});
