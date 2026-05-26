import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
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
