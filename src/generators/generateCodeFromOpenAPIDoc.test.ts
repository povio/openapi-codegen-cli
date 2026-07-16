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

describe("generateCodeFromOpenAPIDoc - blob download with domain errors", () => {
  const domainErrorSchema = {
    type: "object",
    "x-domain-error-domain": "cmr",
    "x-domain-error-name": "CmrNotFound",
    properties: {
      code: { type: "number", enum: [4001] },
      message: { type: "string" },
    },
  } as unknown as OpenAPIV3.SchemaObject;

  const blobDoc = {
    openapi: "3.0.3",
    info: { title: "Blob Download Test", version: "1.0.0" },
    paths: {
      "/offices/{officeId}/cmrs/{cmrId}/preview": {
        get: {
          tags: ["Documents"],
          operationId: "previewCmr",
          "x-media-download": true,
          parameters: [
            { name: "officeId", in: "path", required: true, schema: { type: "string" } },
            { name: "cmrId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "PDF preview",
              content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
            },
            "400": {
              description: "Domain error",
              content: { "application/json": { schema: domainErrorSchema } },
            },
            "401": { description: "Unauthorized" },
          },
        } as unknown as OpenAPIV3.OperationObject,
      },
      "/offices/{officeId}/cmrs/{cmrId}/preview-no-error": {
        get: {
          tags: ["Documents"],
          operationId: "previewCmrNoError",
          "x-media-download": true,
          parameters: [
            { name: "officeId", in: "path", required: true, schema: { type: "string" } },
            { name: "cmrId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "PDF preview",
              content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
            },
            "401": { description: "Unauthorized" },
          },
        } as unknown as OpenAPIV3.OperationObject,
      },
      "/offices/{officeId}/cmrs/{cmrId}/download": {
        get: {
          tags: ["Documents"],
          operationId: "downloadCmr",
          "x-media-download": true,
          parameters: [
            { name: "officeId", in: "path", required: true, schema: { type: "string" } },
            { name: "cmrId", in: "path", required: true, schema: { type: "string" } },
            { name: "format", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "PDF download",
              content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
            },
            "400": {
              description: "Domain error",
              content: { "application/json": { schema: domainErrorSchema } },
            },
            "401": { description: "Unauthorized" },
          },
        } as unknown as OpenAPIV3.OperationObject,
      },
      "/files/eml": {
        post: {
          tags: ["Documents"],
          operationId: "getFilesEml",
          "x-media-download": true,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", properties: { ids: { type: "array", items: { type: "string" } } } },
              },
            },
          },
          responses: {
            "200": {
              description: "EML file",
              content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
            },
            "400": {
              description: "Domain error",
              content: { "application/json": { schema: domainErrorSchema } },
            },
            "401": { description: "Unauthorized" },
          },
        } as unknown as OpenAPIV3.OperationObject,
      },
      "/offices/{officeId}/items": {
        get: {
          tags: ["Documents"],
          operationId: "listItems",
          parameters: [{ name: "officeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { type: "array", items: { type: "string" } } } },
            },
            "400": {
              description: "Domain error",
              content: { "application/json": { schema: domainErrorSchema } },
            },
          },
        } as unknown as OpenAPIV3.OperationObject,
      },
    },
    components: { schemas: {} },
  } as unknown as OpenAPIV3.Document;

  const files = generateCodeFromOpenAPIDoc(blobDoc, DEFAULT_GENERATE_OPTIONS as GenerateOptions);
  const api = files.find(({ fileName }) => fileName === "output/documents/documents.api.ts")?.content;

  test("api file is generated", () => {
    expect(api).toBeDefined();
  });

  test("blob + domain error 400, path params only: emits responseType blob, rawResponse, and Accept header", () => {
    expect(api).toContain('responseType: "blob"');
    expect(api).toContain("rawResponse: true");
    expect(api).toContain("'Accept': 'application/pdf'");
  });

  test("blob + domain error 400, path params only: previewCmr endpoint has full blob config", () => {
    expect(api).toMatch(/previewCmr[\s\S]*?responseType: "blob"[\s\S]*?rawResponse: true/);
  });

  test("blob without domain error (regression): previewCmrNoError also emits blob config", () => {
    expect(api).toMatch(/previewCmrNoError[\s\S]*?responseType: "blob"[\s\S]*?rawResponse: true/);
  });

  test("blob + domain error + query param: downloadCmr emits blob config with params block", () => {
    expect(api).toMatch(/downloadCmr[\s\S]*?params[\s\S]*?responseType: "blob"[\s\S]*?rawResponse: true/);
  });

  test("blob + domain error, POST body only: getFilesEml emits blob config with octet-stream Accept", () => {
    expect(api).toMatch(/getFilesEml[\s\S]*?responseType: "blob"[\s\S]*?rawResponse: true/);
    expect(api).toContain("'Accept': 'application/octet-stream'");
  });

  test("non-blob JSON endpoint with 400 error: no rawResponse or responseType blob", () => {
    const listItemsSection = api?.slice(api.indexOf("listItems"));
    const nextFnStart = listItemsSection?.indexOf("export const", 1);
    const listItemsCode = nextFnStart ? listItemsSection?.slice(0, nextFnStart) : listItemsSection;
    expect(listItemsCode).not.toContain("rawResponse");
    expect(listItemsCode).not.toContain('responseType: "blob"');
  });
});

describe("generateCodeFromOpenAPIDoc - shared parameter schema namespace", () => {
  // TokenFiltersDto is used as a query parameter by both pushNotificationAdmin and
  // pushNotification, so the resolver assigns it to the defaultTag ("Common"). The endpoint
  // parameter renderer (mapEndpointParamsToFunctionParams / renderEndpointParamParse) must not
  // force the endpoint's own tag as the namespace prefix, or it would emit
  // PushNotificationAdminModels.TokenFiltersDto instead of CommonModels.TokenFiltersDto.
  const sharedParamSchemaDoc = {
    openapi: "3.0.3",
    info: { title: "Shared Parameter Schema Test", version: "1.0.0" },
    paths: {
      "/push-notifications/admin/tokens": {
        get: {
          tags: ["pushNotificationAdmin"],
          operationId: "listAdminTokens",
          parameters: [
            { name: "filter", in: "query", schema: { $ref: "#/components/schemas/TokenFiltersDto" } },
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/TokensPage" } } },
            },
          },
        },
        post: {
          tags: ["pushNotificationAdmin"],
          operationId: "createAdminToken",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/TokenFiltersDto" } } },
          },
          responses: {
            "201": {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Token" } } },
            },
          },
        },
      },
      "/push-notifications/tokens": {
        get: {
          tags: ["pushNotification"],
          operationId: "listTokens",
          parameters: [{ name: "filter", in: "query", schema: { $ref: "#/components/schemas/TokenFiltersDto" } }],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/TokensPage" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        TokenFiltersDto: {
          type: "object",
          properties: { deviceId: { type: "string" } },
        },
        Token: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        TokensPage: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/Token" } },
            page: { type: "integer" },
            totalItems: { type: "integer" },
            limit: { type: "integer" },
          },
          required: ["items"],
        },
      },
    },
  } as unknown as OpenAPIV3.Document;

  const files = generateCodeFromOpenAPIDoc(sharedParamSchemaDoc, {
    ...(DEFAULT_GENERATE_OPTIONS as GenerateOptions),
    builderConfigs: true,
    acl: false,
    checkAcl: false,
  });
  const adminApi = files.find(({ fileName }) =>
    fileName.endsWith("/pushNotificationAdmin/pushNotificationAdmin.api.ts"),
  )?.content;
  const adminQueries = files.find(({ fileName }) =>
    fileName.endsWith("/pushNotificationAdmin/pushNotificationAdmin.queries.ts"),
  )?.content;
  const adminConfigs = files.find(({ fileName }) =>
    fileName.endsWith("/pushNotificationAdmin/pushNotificationAdmin.configs.ts"),
  )?.content;

  test("api file uses the owning namespace (CommonModels) for the shared parameter schema", () => {
    expect(adminApi).toBeDefined();
    expect(adminApi).toContain("CommonModels.TokenFiltersDto");
    expect(adminApi).not.toContain("PushNotificationAdminModels.TokenFiltersDto");
  });

  test("queries file uses the owning namespace (CommonModels) for the shared parameter schema", () => {
    expect(adminQueries).toBeDefined();
    expect(adminQueries).toContain("CommonModels.TokenFiltersDto");
    expect(adminQueries).not.toContain("PushNotificationAdminModels.TokenFiltersDto");
  });

  test("configs file uses the owning namespace (CommonModels) for the shared parameter schema", () => {
    expect(adminConfigs).toBeDefined();
    expect(adminConfigs).toContain("CommonModels.TokenFiltersDto");
    expect(adminConfigs).not.toContain("PushNotificationAdminModels.TokenFiltersDto");
  });
});
