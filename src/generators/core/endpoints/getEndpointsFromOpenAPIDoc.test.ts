import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { GenerateOptions } from "../../types/options";
import { SchemaResolver } from "../SchemaResolver.class";
import { getEndpointsFromOpenAPIDoc } from "./getEndpointsFromOpenAPIDoc";

const baseDoc = {
  openapi: "3.0.3",
  info: {
    title: "Swagger Petstore - OpenAPI 3.0",
    description:
      "This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about\nSwagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!\nYou can now help us improve the API whether it's by making changes to the definition itself or to the code.\nThat way, with time, we can improve the API in general, and expose some of the new features in OAS3.\n\n_If you're looking for the Swagger 2.0/OAS 2.0 version of Petstore, then click [here](https://editor.swagger.io/?url=https://petstore.swagger.io/v2/swagger.yaml). Alternatively, you can load via the `Edit > Load Petstore OAS 2.0` menu option!_\n\nSome useful links:\n- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)\n- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)",
    termsOfService: "http://swagger.io/terms/",
    contact: {
      email: "apiteam@swagger.io",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
    version: "1.0.11",
  },
} as OpenAPIV3.Document;

const schemas = {
  Order: {
    type: "object",
    properties: {
      id: { type: "integer", format: "int64", example: 10 },
      petId: { type: "integer", format: "int64", example: 198772 },
      quantity: { type: "integer", format: "int32", example: 7 },
      shipDate: { type: "string", format: "date-time" },
      status: {
        type: "string",
        description: "Order Status",
        example: "approved",
        enum: ["placed", "approved", "delivered"],
      },
      complete: { type: "boolean" },
    },
    xml: { name: "order" },
  } as OpenAPIV3.SchemaObject,
  Pet: {
    required: ["name", "photoUrls"],
    type: "object",
    properties: {
      id: { type: "integer", format: "int64", example: 10 },
      name: { type: "string", example: "doggie" },
      category: { $ref: "#/components/schemas/Category" },
      photoUrls: { type: "array", xml: { wrapped: true }, items: { type: "string", xml: { name: "photoUrl" } } },
      tags: { type: "array", xml: { wrapped: true }, items: { $ref: "#/components/schemas/Tag" } },
      status: { type: "string", description: "pet status in the store", enum: ["available", "pending", "sold"] },
    },
    xml: { name: "pet" },
  } as OpenAPIV3.SchemaObject,
  ReasonDetails: {
    required: ["details"],
    type: "object",
    properties: {
      details: { type: "string", example: "found an owner" },
    },
    xml: { name: "reasonDetails" },
  } as OpenAPIV3.SchemaObject,
  Reason: {
    required: ["reason"],
    type: "object",
    properties: {
      reason: { $ref: "#/components/schemas/ReasonDetails" },
    },
    xml: { name: "reason" },
  } as OpenAPIV3.SchemaObject,
  Category: {
    type: "object",
    properties: { id: { type: "integer", format: "int64", example: 1 }, name: { type: "string", example: "Dogs" } },
    xml: { name: "category" },
  } as OpenAPIV3.SchemaObject,
  Tag: {
    type: "object",
    properties: { id: { type: "integer", format: "int64" }, name: { type: "string" } },
    xml: { name: "tag" },
  } as OpenAPIV3.SchemaObject,
} as const;

const generateOptions = {
  schemaSuffix: "",
  defaultTag: "",
} as GenerateOptions;

describe("getEndpointsFromOpenAPIDoc", () => {
  test("getEndpointsFromOpenAPIDocPaths /store/order", () => {
    const openApiDoc: OpenAPIV3.Document = {
      ...baseDoc,
      components: { schemas: { Order: schemas.Order } },
      paths: {
        "/store/order": {
          post: {
            tags: ["store"],
            summary: "Place an order for a pet",
            description: "Place a new order in the store",
            operationId: "placeOrder",
            requestBody: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Order" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Order" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Order" } },
              },
            },
            responses: {
              "200": {
                description: "successful operation",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } },
              },
              "405": { description: "Invalid input" },
            },
          },
        },
      },
    };

    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);

    expect(endpoints).toStrictEqual([
      {
        description: "Place a new order in the store",
        errors: [
          {
            description: "Invalid input",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "post",
        operationName: "placeOrder",
        parameters: [
          {
            description: undefined,
            name: "data",
            zodSchema: "Order",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Order" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Order" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Order" } },
              },
            },
          },
        ],
        path: "/store/order",
        requestFormat: "application/json",
        response: "Order",
        responseFormat: "application/json",
        responseObject: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } },
          description: "successful operation",
        },
        tags: ["store"],
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Order: `z.object({ id: z.number().int(), petId: z.number().int(), quantity: z.number().int(), shipDate: z.string().datetime({ offset: true }), status: z.enum(["placed", "approved", "delivered"]), complete: z.boolean() }).partial().passthrough()`,
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual([]);
  });

  test("getEndpointsFromOpenAPIDocPaths /pet", () => {
    const openApiDoc: OpenAPIV3.Document = {
      ...baseDoc,
      components: { schemas: { Pet: schemas.Pet, Category: schemas.Category, Tag: schemas.Tag } },
      paths: {
        "/pet": {
          put: {
            tags: ["pet"],
            summary: "Update an existing pet",
            description: "Update an existing pet by Id",
            operationId: "updatePet",
            requestBody: {
              description: "Update an existent pet in the store",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Successful operation",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                  "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                },
              },
              "400": { description: "Invalid ID supplied" },
              "404": { description: "Pet not found" },
              "405": { description: "Validation exception" },
            },
            security: [{ petstore_auth: ["write:pets", "read:pets"] }],
          },
          post: {
            tags: ["pet"],
            summary: "Add a new pet to the store",
            description: "Add a new pet to the store",
            operationId: "addPet",
            requestBody: {
              description: "Create a new pet in the store",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Successful operation",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                  "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                },
              },
              "405": { description: "Invalid input" },
            },
            security: [{ petstore_auth: ["write:pets", "read:pets"] }],
          },
        },
      },
    };

    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);

    expect(endpoints).toStrictEqual([
      {
        description: "Update an existing pet by Id",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Pet not found",
            zodSchema: "z.void()",
            status: 404,
          },
          {
            description: "Validation exception",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "put",
        operationName: "updatePet",
        parameters: [
          {
            description: "Update an existent pet in the store",
            name: "data",
            zodSchema: "Pet",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              description: "Update an existent pet in the store",
              required: true,
            },
          },
        ],
        path: "/pet",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },

          description: "Successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Add a new pet to the store",
        errors: [
          {
            description: "Invalid input",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "post",
        operationName: "addPet",
        parameters: [
          {
            description: "Create a new pet in the store",
            name: "data",
            zodSchema: "Pet",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              description: "Create a new pet in the store",
              required: true,
            },
          },
        ],
        path: "/pet",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },
          description: "Successful operation",
        },
        tags: ["pet"],
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Category: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      Pet: `z.object({ id: z.number().int().optional(), name: z.string(), category: Category.optional(), photoUrls: z.array(z.string()), tags: z.array(Tag).optional(), status: z.enum(["available", "pending", "sold"]).optional() }).passthrough()`,
      Tag: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual([]);
  });

  test("getEndpointsFromOpenAPIDocPaths /pet without schema ref", () => {
    const openApiDoc: OpenAPIV3.Document = {
      ...baseDoc,
      components: {
        schemas: {
          Pet: schemas.Pet,
          Category: schemas.Category,
          Tag: schemas.Tag,
          Reason: schemas.Reason,
          ReasonDetails: schemas.ReasonDetails,
        },
      },
      paths: {
        "/pet": {
          put: {
            tags: ["pet"],
            summary: "Update an existing pet",
            description: "Update an existing pet by Id",
            operationId: "updatePet",
            requestBody: {
              description: "Update an existent pet in the store",
              content: {
                "application/json": {
                  schema: {
                    allOf: [{ $ref: "#/components/schemas/Pet" }, { $ref: "#/components/schemas/Reason" }],
                  },
                },
                "application/xml": {
                  schema: {
                    allOf: [{ $ref: "#/components/schemas/Pet" }, { $ref: "#/components/schemas/Reason" }],
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Successful operation",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                  "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                },
              },
              "400": { description: "Invalid ID supplied" },
              "404": { description: "Pet not found" },
              "405": { description: "Validation exception" },
            },
            security: [{ petstore_auth: ["write:pets", "read:pets"] }],
          },
        },
      },
    };

    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);
    expect(endpoints).toStrictEqual([
      {
        description: "Update an existing pet by Id",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Pet not found",
            zodSchema: "z.void()",
            status: 404,
          },
          {
            description: "Validation exception",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "put",
        operationName: "updatePet",
        parameters: [
          {
            description: "Update an existent pet in the store",
            name: "data",
            zodSchema: "UpdatePetBody",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": {
                  schema: { allOf: [{ $ref: "#/components/schemas/Pet" }, { $ref: "#/components/schemas/Reason" }] },
                },
                "application/xml": {
                  schema: { allOf: [{ $ref: "#/components/schemas/Pet" }, { $ref: "#/components/schemas/Reason" }] },
                },
              },
              description: "Update an existent pet in the store",
              required: true,
            },
          },
        ],
        path: "/pet",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },
          description: "Successful operation",
        },
        tags: ["pet"],
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Category: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      Pet: `z.object({ id: z.number().int().optional(), name: z.string(), category: Category.optional(), photoUrls: z.array(z.string()), tags: z.array(Tag).optional(), status: z.enum(["available", "pending", "sold"]).optional() }).passthrough()`,
      Reason: "z.object({ reason: ReasonDetails }).passthrough()",
      ReasonDetails: "z.object({ details: z.string() }).passthrough()",
      Tag: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      UpdatePetBody: "Pet.merge(Reason)",
    });

    expect(resolver["compositeZodSchemaData"]).toStrictEqual([
      {
        code: "Pet.merge(Reason)",
        zodSchemas: expect.arrayContaining([
          expect.objectContaining({
            zodSchemaName: "UpdatePetBody",
            schema: { allOf: [{ $ref: "#/components/schemas/Pet" }, { $ref: "#/components/schemas/Reason" }] },
          }),
        ]),
      },
    ]);
  });

  test("getEndpointsFromOpenAPIDocPaths /pet/findXXX", () => {
    const openApiDoc: OpenAPIV3.Document = {
      ...baseDoc,
      components: { schemas: { Pet: schemas.Pet, Category: schemas.Category, Tag: schemas.Tag } },
      paths: {
        "/pet/findByStatus": {
          get: {
            tags: ["pet"],
            summary: "Finds Pets by status",
            description: "Multiple status values can be provided with comma separated strings",
            operationId: "findPetsByStatus",
            parameters: [
              {
                name: "status",
                in: "query",
                description: "Status values that need to be considered for filter",
                required: false,
                explode: true,
                schema: {
                  type: "string",
                  default: "available",
                  enum: ["available", "pending", "sold"],
                },
              },
            ],
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                  "application/xml": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Invalid status value",
              },
            },
            security: [
              {
                petstore_auth: ["write:pets", "read:pets"],
              },
            ],
          },
        },
        "/pet/findByTags": {
          get: {
            tags: ["pet"],
            summary: "Finds Pets by tags",
            description:
              "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
            operationId: "findPetsByTags",
            parameters: [
              {
                name: "tags",
                in: "query",
                description: "Tags to filter by",
                required: false,
                explode: true,
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            ],
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                  "application/xml": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Invalid tag value",
              },
            },
            security: [
              {
                petstore_auth: ["write:pets", "read:pets"],
              },
            ],
          },
        },
      },
    };

    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);
    expect(endpoints).toStrictEqual([
      {
        description: "Multiple status values can be provided with comma separated strings",
        errors: [
          {
            description: "Invalid status value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "findPetsByStatus",
        parameters: [
          {
            name: "status",
            parameterObject: {
              description: "Status values that need to be considered for filter",
              explode: true,
              in: "query",
              name: "status",
              required: false,
              schema: {
                default: "available",
                enum: ["available", "pending", "sold"],
                type: "string",
              },
            },
            zodSchema: "FindPetsByStatusStatusParam",
            type: "Query",
          },
        ],
        path: "/pet/findByStatus",
        requestFormat: "application/json",
        response: "FindPetsByStatusResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
            "application/xml": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
        errors: [
          {
            description: "Invalid tag value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "findPetsByTags",
        parameters: [
          {
            name: "tags",
            parameterObject: {
              description: "Tags to filter by",
              explode: true,
              in: "query",
              name: "tags",
              required: false,
              schema: {
                items: {
                  type: "string",
                },
                type: "array",
              },
            },
            zodSchema: "FindPetsByTagsTagsParam",
            type: "Query",
          },
        ],
        path: "/pet/findByTags",
        requestFormat: "application/json",
        response: "FindPetsByTagsResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
            "application/xml": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Category: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      FindPetsByStatusResponse: "z.array(Pet)",
      FindPetsByStatusStatusParam: `z.enum(["available", "pending", "sold"]).optional().default("available")`,
      FindPetsByTagsResponse: "z.array(Pet)",
      FindPetsByTagsTagsParam: "z.array(z.string()).optional()",
      Pet: `z.object({ id: z.number().int().optional(), name: z.string(), category: Category.optional(), photoUrls: z.array(z.string()), tags: z.array(Tag).optional(), status: z.enum(["available", "pending", "sold"]).optional() }).passthrough()`,
      Tag: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "z.array(Pet)",
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({
              zodSchemaName: "FindPetsByStatusResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
            expect.objectContaining({
              zodSchemaName: "FindPetsByTagsResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
          ]),
        }),
        expect.objectContaining({
          code: "z.array(z.string()).optional()",
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({
              zodSchemaName: "FindPetsByTagsTagsParam",
              schema: {
                items: {
                  type: "string",
                },
                type: "array",
              },
            }),
          ]),
        }),
        expect.objectContaining({
          code: 'z.enum(["available", "pending", "sold"]).optional().default("available")',
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({
              zodSchemaName: "FindPetsByStatusStatusParam",
              schema: {
                default: "available",
                enum: ["available", "pending", "sold"],
                type: "string",
              },
            }),
          ]),
        }),
      ]),
    );
  });

  test("petstore.yaml", async () => {
    const openApiDoc = (await SwaggerParser.parse("./test/petstore.yaml")) as OpenAPIV3.Document;
    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);
    expect(endpoints).toStrictEqual([
      {
        description: "Update an existing pet by Id",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Pet not found",
            zodSchema: "z.void()",
            status: 404,
          },
          {
            description: "Validation exception",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "put",
        operationName: "updatePet",
        parameters: [
          {
            description: "Update an existent pet in the store",
            name: "data",
            zodSchema: "Pet",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              description: "Update an existent pet in the store",
              required: true,
            },
          },
        ],
        path: "/pet",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },
          description: "Successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Add a new pet to the store",
        errors: [
          {
            description: "Invalid input",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "post",
        operationName: "addPet",
        parameters: [
          {
            description: "Create a new pet in the store",
            name: "data",
            zodSchema: "Pet",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Pet" } },
              },
              description: "Create a new pet in the store",
              required: true,
            },
          },
        ],
        path: "/pet",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },
          description: "Successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Multiple status values can be provided with comma separated strings",
        errors: [
          {
            description: "Invalid status value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "findPetsByStatus",
        parameters: [
          {
            name: "status",
            parameterObject: {
              description: "Status values that need to be considered for filter",
              explode: true,
              in: "query",
              name: "status",
              required: false,
              schema: {
                default: "available",
                enum: ["available", "pending", "sold"],
                type: "string",
              },
            },
            zodSchema: "FindPetsByStatusStatusParam",
            type: "Query",
          },
        ],
        path: "/pet/findByStatus",
        requestFormat: "application/json",
        response: "FindPetsByStatusResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
            "application/xml": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
        errors: [
          {
            description: "Invalid tag value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "findPetsByTags",
        parameters: [
          {
            name: "tags",
            parameterObject: {
              description: "Tags to filter by",
              explode: true,
              in: "query",
              name: "tags",
              required: false,
              schema: {
                items: {
                  type: "string",
                },
                type: "array",
              },
            },
            zodSchema: "FindPetsByTagsTagsParam",
            type: "Query",
          },
        ],
        path: "/pet/findByTags",
        requestFormat: "application/json",
        response: "FindPetsByTagsResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
            "application/xml": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Returns a single pet",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Pet not found",
            zodSchema: "z.void()",
            status: 404,
          },
        ],
        method: "get",
        operationName: "getPetById",
        parameters: [
          {
            name: "petId",
            parameterObject: {
              description: "ID of pet to return",
              in: "path",
              name: "petId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
        ],
        path: "/pet/:petId",
        requestFormat: "application/json",
        response: "Pet",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Pet" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Pet" } },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "",
        errors: [
          {
            description: "Invalid input",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "post",
        operationName: "updatePetWithForm",
        parameters: [
          {
            name: "petId",
            parameterObject: {
              description: "ID of pet that needs to be updated",
              in: "path",
              name: "petId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
          {
            name: "name",
            parameterObject: {
              description: "Name of pet that needs to be updated",
              in: "query",
              name: "name",
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Query",
          },
          {
            name: "status",
            parameterObject: {
              description: "Status of pet that needs to be updated",
              in: "query",
              name: "status",
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Query",
          },
        ],
        path: "/pet/:petId",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["pet"],
      },
      {
        description: "delete a pet",
        errors: [
          {
            description: "Invalid pet value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "delete",
        operationName: "deletePet",
        parameters: [
          {
            name: "api_key",
            parameterObject: {
              description: "",
              in: "header",
              name: "api_key",
              required: false,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Header",
          },
          {
            name: "petId",
            parameterObject: {
              description: "Pet id to delete",
              in: "path",
              name: "petId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
        ],
        path: "/pet/:petId",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["pet"],
      },
      {
        description: "",
        errors: [],
        method: "post",
        operationName: "uploadFile",
        parameters: [
          {
            description: undefined,
            name: "data",
            zodSchema: "z.instanceof(File)",
            type: "Body",
            bodyObject: {
              content: {
                "application/octet-stream": { schema: { type: "string", format: "binary" } },
              },
            },
          },
          {
            name: "petId",
            parameterObject: {
              description: "ID of pet to update",
              in: "path",
              name: "petId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
          {
            name: "additionalMetadata",
            parameterObject: {
              description: "Additional Metadata",
              in: "query",
              name: "additionalMetadata",
              required: false,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Query",
          },
        ],
        path: "/pet/:petId/uploadImage",
        requestFormat: "application/octet-stream",
        response: "ApiResponse",
        responseFormat: "application/json",
        responseObject: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Returns a map of status codes to quantities",
        errors: [],
        method: "get",
        operationName: "getInventory",
        parameters: [],
        path: "/store/inventory",
        requestFormat: "application/json",
        response: "GetInventoryResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: {
                  type: "integer",
                  format: "int32",
                },
              },
            },
          },
          description: "successful operation",
        },
        tags: ["store"],
      },
      {
        description: "Place a new order in the store",
        errors: [
          {
            description: "Invalid input",
            zodSchema: "z.void()",
            status: 405,
          },
        ],
        method: "post",
        operationName: "placeOrder",
        parameters: [
          {
            description: undefined,
            name: "data",
            zodSchema: "Order",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Order" } },
                "application/xml": { schema: { $ref: "#/components/schemas/Order" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/Order" } },
              },
            },
          },
        ],
        path: "/store/order",
        requestFormat: "application/json",
        response: "Order",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Order" } },
          },
          description: "successful operation",
        },
        tags: ["store"],
      },
      {
        description:
          "For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Order not found",
            zodSchema: "z.void()",
            status: 404,
          },
        ],
        method: "get",
        operationName: "getOrderById",
        parameters: [
          {
            name: "orderId",
            parameterObject: {
              description: "ID of order that needs to be fetched",
              in: "path",
              name: "orderId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
        ],
        path: "/store/order/:orderId",
        requestFormat: "application/json",
        response: "Order",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Order" } },
            "application/xml": { schema: { $ref: "#/components/schemas/Order" } },
          },
          description: "successful operation",
        },
        tags: ["store"],
      },
      {
        description:
          "For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors",
        errors: [
          {
            description: "Invalid ID supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "Order not found",
            zodSchema: "z.void()",
            status: 404,
          },
        ],
        method: "delete",
        operationName: "deleteOrder",
        parameters: [
          {
            name: "orderId",
            parameterObject: {
              description: "ID of the order that needs to be deleted",
              in: "path",
              name: "orderId",
              required: true,
              schema: {
                format: "int64",
                type: "integer",
              },
            },
            zodSchema: "z.number().int()",
            type: "Path",
          },
        ],
        path: "/store/order/:orderId",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["store"],
      },
      {
        description: "This can only be done by the logged in user.",
        errors: [],
        method: "post",
        operationName: "createUser",
        parameters: [
          {
            description: "Created user object",
            name: "data",
            zodSchema: "User",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/User" } },
                "application/xml": { schema: { $ref: "#/components/schemas/User" } },
                "application/x-www-form-urlencoded": { schema: { $ref: "#/components/schemas/User" } },
              },
              description: "Created user object",
            },
          },
        ],
        path: "/user",
        requestFormat: "application/json",
        response: "z.void()",
        responseFormat: "application/json",
        tags: ["user"],
      },
      {
        description: "Creates list of users with given input array",
        errors: [],
        method: "post",
        operationName: "createUsersWithListInput",
        parameters: [
          {
            description: undefined,
            name: "data",
            zodSchema: "CreateUsersWithListInputBody",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": { schema: { items: { $ref: "#/components/schemas/User" }, type: "array" } },
              },
            },
          },
        ],
        path: "/user/createWithList",
        requestFormat: "application/json",
        response: "User",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/User" } },
            "application/xml": { schema: { $ref: "#/components/schemas/User" } },
          },
          description: "Successful operation",
        },
        tags: ["user"],
      },
      {
        description: "",
        errors: [
          {
            description: "Invalid username/password supplied",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "loginUser",
        parameters: [
          {
            name: "username",
            parameterObject: {
              description: "The user name for login",
              in: "query",
              name: "username",
              required: false,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Query",
          },
          {
            name: "password",
            parameterObject: {
              description: "The password for login in clear text",
              in: "query",
              name: "password",
              required: false,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string().optional()",
            type: "Query",
          },
        ],
        path: "/user/login",
        requestFormat: "application/json",
        response: "z.string()",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { type: "string" } },
            "application/xml": { schema: { type: "string" } },
          },
          description: "successful operation",
          headers: {
            "X-Rate-Limit": {
              description: "calls per hour allowed by the user",
              schema: {
                format: "int32",
                type: "integer",
              },
            },
            "X-Expires-After": {
              description: "date in UTC when token expires",
              schema: {
                format: "date-time",
                type: "string",
              },
            },
          },
        },
        tags: ["user"],
      },
      {
        description: "",
        errors: [],
        method: "get",
        operationName: "logoutUser",
        parameters: [],
        path: "/user/logout",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["user"],
      },
      {
        description: "",
        errors: [
          {
            description: "Invalid username supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "User not found",
            zodSchema: "z.void()",
            status: 404,
          },
        ],
        method: "get",
        operationName: "getUserByName",
        parameters: [
          {
            name: "username",
            parameterObject: {
              description: "The name that needs to be fetched. Use user1 for testing. ",
              in: "path",
              name: "username",
              required: true,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string()",
            type: "Path",
          },
        ],
        path: "/user/:username",
        requestFormat: "application/json",
        response: "User",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/User" } },
            "application/xml": { schema: { $ref: "#/components/schemas/User" } },
          },
          description: "successful operation",
        },
        tags: ["user"],
      },
      {
        description: "This can only be done by the logged in user.",
        errors: [],
        method: "put",
        operationName: "updateUser",
        parameters: [
          {
            description: "Update an existent user in the store",
            name: "data",
            zodSchema: "User",
            type: "Body",
            bodyObject: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
                "application/x-www-form-urlencoded": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
                "application/xml": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
              description: "Update an existent user in the store",
            },
          },
          {
            name: "username",
            parameterObject: {
              description: "name that need to be deleted",
              in: "path",
              name: "username",
              required: true,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string()",
            type: "Path",
          },
        ],
        path: "/user/:username",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["user"],
      },
      {
        description: "This can only be done by the logged in user.",
        errors: [
          {
            description: "Invalid username supplied",
            zodSchema: "z.void()",
            status: 400,
          },
          {
            description: "User not found",
            zodSchema: "z.void()",
            status: 404,
          },
        ],
        method: "delete",
        operationName: "deleteUser",
        parameters: [
          {
            name: "username",
            parameterObject: {
              description: "The name that needs to be deleted",
              in: "path",
              name: "username",
              required: true,
              schema: {
                type: "string",
              },
            },
            zodSchema: "z.string()",
            type: "Path",
          },
        ],
        path: "/user/:username",
        requestFormat: "application/json",
        response: "z.void()",
        tags: ["user"],
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      ApiResponse:
        "z.object({ code: z.number().int(), type: z.string(), message: z.string() }).partial().passthrough()",
      Category: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      CreateUsersWithListInputBody: "z.array(User)",
      FindPetsByStatusResponse: "z.array(Pet)",
      FindPetsByStatusStatusParam: `z.enum(["available", "pending", "sold"]).optional().default("available")`,
      FindPetsByTagsResponse: "z.array(Pet)",
      FindPetsByTagsTagsParam: "z.array(z.string()).optional()",
      GetInventoryResponse: "z.record(z.number().int())",
      Order: `z.object({ id: z.number().int(), petId: z.number().int(), quantity: z.number().int(), shipDate: z.string().datetime({ offset: true }), status: z.enum(["placed", "approved", "delivered"]), complete: z.boolean() }).partial().passthrough()`,
      Pet: `z.object({ id: z.number().int().optional(), name: z.string(), category: Category.optional(), photoUrls: z.array(z.string()), tags: z.array(Tag).optional(), status: z.enum(["available", "pending", "sold"]).optional() }).passthrough()`,
      Tag: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      User: "z.object({ id: z.number().int(), username: z.string(), firstName: z.string(), lastName: z.string(), email: z.string(), password: z.string(), phone: z.string(), userStatus: z.number().int() }).partial().passthrough()",
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "z.array(Pet)",
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({
              zodSchemaName: "FindPetsByStatusResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
            expect.objectContaining({
              zodSchemaName: "FindPetsByTagsResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
          ]),
        }),
        expect.objectContaining({
          code: "z.array(User)",
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({ zodSchemaName: "CreateUsersWithListInputBody" }),
          ]),
        }),
        expect.objectContaining({
          code: "z.array(z.string()).optional()",
          zodSchemas: expect.arrayContaining([expect.objectContaining({ zodSchemaName: "FindPetsByTagsTagsParam" })]),
        }),
        expect.objectContaining({
          code: 'z.enum(["available", "pending", "sold"]).optional().default("available")',
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({ zodSchemaName: "FindPetsByStatusStatusParam" }),
          ]),
        }),
        expect.objectContaining({
          code: "z.record(z.number().int())",
          zodSchemas: expect.arrayContaining([expect.objectContaining({ zodSchemaName: "GetInventoryResponse" })]),
        }),
      ]),
    );
  });

  test("getEndpointsFromOpenAPIDocPaths should return responses", () => {
    const openApiDoc: OpenAPIV3.Document = {
      ...baseDoc,
      components: { schemas: { Pet: schemas.Pet, Category: schemas.Category, Tag: schemas.Tag } },
      paths: {
        "/pet/findByStatus": {
          get: {
            tags: ["pet"],
            summary: "Finds Pets by status",
            description: "Multiple status values can be provided with comma separated strings",
            operationId: "findPetsByStatus",
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Invalid status value",
                content: {
                  "application/json": {
                    schema: {
                      type: "string",
                    },
                  },
                },
              },
              "500": {
                description: "Network error",
              },
            },
          },
        },
        "/pet/findByTags": {
          get: {
            tags: ["pet"],
            summary: "Finds Pets by tags",
            description:
              "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
            operationId: "findPetsByTags",
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Invalid tag value",
              },
            },
          },
        },
      },
    };
    const resolver = new SchemaResolver(openApiDoc, generateOptions);
    const { endpoints } = getEndpointsFromOpenAPIDoc(resolver, generateOptions);
    expect(endpoints).toStrictEqual([
      {
        description: "Multiple status values can be provided with comma separated strings",
        errors: [
          {
            description: "Invalid status value",
            zodSchema: "z.string()",
            status: 400,
          },
          {
            description: "Network error",
            zodSchema: "z.void()",
            status: 500,
          },
        ],
        method: "get",
        operationName: "findPetsByStatus",
        parameters: [],
        path: "/pet/findByStatus",
        requestFormat: "application/json",
        response: "FindPetsByStatusResponse",
        responseFormat: "application/json",
        responseObject: {
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
          },
          description: "successful operation",
        },
        tags: ["pet"],
      },
      {
        description: "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
        errors: [
          {
            description: "Invalid tag value",
            zodSchema: "z.void()",
            status: 400,
          },
        ],
        method: "get",
        operationName: "findPetsByTags",
        parameters: [],
        path: "/pet/findByTags",
        requestFormat: "application/json",
        response: "FindPetsByTagsResponse",
        responseFormat: "application/json",
        tags: ["pet"],
        responseObject: {
          content: {
            "application/json": { schema: { items: { $ref: "#/components/schemas/Pet" }, type: "array" } },
          },
          description: "successful operation",
        },
      },
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Category: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
      FindPetsByStatusResponse: "z.array(Pet)",
      FindPetsByTagsResponse: "z.array(Pet)",
      Pet: `z.object({ id: z.number().int().optional(), name: z.string(), category: Category.optional(), photoUrls: z.array(z.string()), tags: z.array(Tag).optional(), status: z.enum(["available", "pending", "sold"]).optional() }).passthrough()`,
      Tag: "z.object({ id: z.number().int(), name: z.string() }).partial().passthrough()",
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "z.array(Pet)",
          zodSchemas: expect.arrayContaining([
            expect.objectContaining({
              zodSchemaName: "FindPetsByStatusResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
            expect.objectContaining({
              zodSchemaName: "FindPetsByTagsResponse",
              schema: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
            }),
          ]),
        }),
      ]),
    );
  });
});
