import { describe, expect, it } from "vitest";
import { OpenAPIV3 } from "openapi-types";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

const openApiDoc = {
  openapi: "3.0.0",
  info: { title: "Builder Configs Test", version: "1.0.0" },
  paths: {
    "/items": {
      get: {
        tags: ["items"],
        operationId: "list",
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
      },
      post: {
        tags: ["items"],
        operationId: "createItem",
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
      },
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

// Same as openApiDoc, but createItem has a no-conditions ACL ability so checkAcl must be
// called without an argument - tests checking acl:false reuse openApiDoc instead, since
// endpoint.acl metadata is extracted regardless of the acl/checkAcl options.
const openApiDocWithAcl = {
  ...openApiDoc,
  paths: {
    ...openApiDoc.paths,
    "/items": {
      ...openApiDoc.paths["/items"],
      post: {
        ...openApiDoc.paths["/items"]!.post,
        "x-acl": [{ action: "create", subject: "Item" }],
      },
    },
  },
} as OpenAPIV3.Document;

describe("generateConfigs builderConfigs", () => {
  it("imports the sibling <Domain>Queries namespace referenced by usePaginate", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      mutationEffects: false,
      acl: false,
      checkAcl: false,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/items/items.configs.ts"));

    expect(configsFile?.content).toContain('import { ItemsQueries } from "./items.queries";');
    expect(configsFile?.content).toContain("paginated: ItemsQueries.useList");
  });

  it("references the QueryModule const enum directly (no typeof) and types options with MutationEffectsOptions", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      mutationEffects: true,
      acl: false,
      checkAcl: false,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/items/items.configs.ts"));

    expect(configsFile?.content).toContain("useMutationEffects<QueryModule.items>");
    expect(configsFile?.content).not.toContain("useMutationEffects<typeof QueryModule.items>");
    expect(configsFile?.content).toContain("& MutationEffectsOptions)");
  });

  it("does not emit an unused OpenApiWorkspaceContext import when workspaceContext is empty", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      mutationEffects: true,
      acl: false,
      checkAcl: false,
      workspaceContext: [],
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/items/items.configs.ts"));

    expect(configsFile?.content).not.toContain("OpenApiWorkspaceContext");
  });

  it("calls runMutationEffects with the mutation result, variables and options, matching renderMutation", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      mutationEffects: true,
      acl: false,
      checkAcl: false,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/items/items.configs.ts"));

    expect(configsFile?.content).toContain("await runMutationEffects(resData, variables, options);");
    expect(configsFile?.content).not.toContain("await runMutationEffects();");
    // the wrapping onSuccess must come after ...options, or a caller-provided options.onSuccess
    // would silently disable mutation effects by overriding it.
    expect(configsFile?.content).toMatch(/\.\.\.options,[\s\S]*onSuccess: async \(resData, variables/);
  });

  it("does not pass an argument to checkAcl when the ability has no conditions", () => {
    const files = generateCodeFromOpenAPIDoc(openApiDocWithAcl, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      acl: true,
      checkAcl: true,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/items/items.configs.ts"));

    expect(configsFile?.content).toContain("checkAcl(ItemsAcl.canUseCreate());");
  });
});

describe("generateConfigs builderConfigs ACL conditions", () => {
  // createRocket's ability has an officeId condition, so checkAcl must be called with the
  // matching object - renderMutationContent must reuse the shared renderAclCheckCall helper
  // instead of unconditionally forwarding every destructured mutation arg.
  const officeScopedDoc = {
    openapi: "3.0.0",
    info: { title: "Builder Configs ACL Conditions Test", version: "1.0.0" },
    paths: {
      "/offices/{officeId}/rockets": {
        get: {
          tags: ["rockets"],
          operationId: "list",
          parameters: [
            { name: "officeId", in: "path", required: true, schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/RocketsPage" } } },
            },
          },
        },
        post: {
          tags: ["rockets"],
          operationId: "createRocket",
          "x-acl": [{ action: "create", subject: "Rocket", conditions: { officeId: "$params.officeId" } }],
          parameters: [{ name: "officeId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/Rocket" } } },
          },
          responses: {
            "201": {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Rocket" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Rocket: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
          required: ["id"],
        },
        RocketsPage: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/Rocket" } },
            page: { type: "integer" },
            totalItems: { type: "integer" },
            limit: { type: "integer" },
          },
          required: ["items"],
        },
      },
    },
  } as unknown as OpenAPIV3.Document;

  it("passes the matching conditions object to checkAcl when the ability has conditions", () => {
    const files = generateCodeFromOpenAPIDoc(officeScopedDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      acl: true,
      checkAcl: true,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/rockets/rockets.configs.ts"));

    expect(configsFile?.content).toContain("checkAcl(RocketsAcl.canUseCreate({ officeId }");
  });
});

describe("generateConfigs builderConfigs media upload", () => {
  // upload's endpoint function only accepts the DTO - the file itself is uploaded separately
  // to uploadInstructions.url, exactly like renderMutation does for *.queries.ts. Passing file
  // as a second argument to the endpoint call is a type error: "expected 1 argument, got 2".
  const mediaUploadDoc = {
    openapi: "3.0.0",
    info: { title: "Builder Configs Media Upload Test", version: "1.0.0" },
    paths: {
      "/media": {
        get: {
          tags: ["media"],
          operationId: "list",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MediaPage" } } },
            },
          },
        },
        post: {
          tags: ["media"],
          operationId: "upload",
          "x-media-upload": true,
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UploadDto" } } },
          },
          responses: {
            "201": {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/UploadInstructions" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        UploadDto: { type: "object", properties: { method: { type: "string" } } },
        UploadInstructions: { type: "object", properties: { url: { type: "string" } } },
        Media: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
        MediaPage: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/Media" } },
            page: { type: "integer" },
            totalItems: { type: "integer" },
            limit: { type: "integer" },
          },
          required: ["items"],
        },
      },
    },
  } as unknown as OpenAPIV3.Document;

  it("calls the endpoint with only the DTO and uploads the file separately to uploadInstructions.url", () => {
    const files = generateCodeFromOpenAPIDoc(mediaUploadDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      acl: false,
      checkAcl: false,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/media/media.configs.ts"));

    expect(configsFile?.content).toContain("const uploadInstructions = await MediaApi.upload(data);");
    expect(configsFile?.content).not.toContain("MediaApi.upload(data, file)");
    expect(configsFile?.content).toContain("await axios[method](uploadInstructions.url, dataToSend,");
    expect(configsFile?.content).toContain("return uploadInstructions;");
  });

  it("imports axios as the default import for the upload call", () => {
    const files = generateCodeFromOpenAPIDoc(mediaUploadDoc, {
      ...DEFAULT_GENERATE_OPTIONS,
      output: "test-output",
      builderConfigs: true,
      acl: false,
      checkAcl: false,
    });

    const configsFile = files.find((file) => file.fileName.endsWith("/media/media.configs.ts"));

    expect(configsFile?.content).toContain('import axios, { type AxiosRequestConfig } from "axios";');
  });
});
