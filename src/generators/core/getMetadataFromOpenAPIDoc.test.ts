import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { DEFAULT_GENERATE_OPTIONS } from "../const/options.const";
import { ModelMetadata, QueryMetadata } from "../types/metadata";
import { getMetadataFromOpenAPIDoc } from "./getMetadataFromOpenAPIDoc";

describe("getMetadataFromOpenAPIDoc", async () => {
  const openApiDoc = (await SwaggerParser.bundle("./test/petstore.yaml")) as OpenAPIV3.Document;

  test("getMetadataFromOpenAPIDoc", async () => {
    const metadata = await getMetadataFromOpenAPIDoc({ openApiDoc, options: DEFAULT_GENERATE_OPTIONS });

    const models: ModelMetadata[] = [
      {
        name: "Category",
        zodSchemaName: "CategorySchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            name: {
              type: "string",
              example: "Dogs",
            },
          },
          xml: {
            name: "category",
          },
        },
      },
      {
        name: "Tag",
        zodSchemaName: "TagSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
            },
            name: {
              type: "string",
            },
          },
          xml: {
            name: "tag",
          },
        },
      },
      {
        name: "Pet",
        zodSchemaName: "PetSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          required: ["name", "photoUrls"],
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 10,
            },
            name: {
              type: "string",
              example: "doggie",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            photoUrls: {
              type: "array",
              xml: {
                wrapped: true,
              },
              items: {
                type: "string",
                xml: {
                  name: "photoUrl",
                },
              },
            },
            tags: {
              type: "array",
              xml: {
                wrapped: true,
              },
              items: {
                $ref: "#/components/schemas/Tag",
              },
            },
            status: {
              type: "string",
              description: "pet status in the store",
              enum: ["available", "pending", "sold"],
            },
          },
          xml: {
            name: "pet",
          },
        },
      },
      {
        name: "ApiResponse",
        zodSchemaName: "ApiResponseSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              format: "int32",
            },
            type: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          xml: {
            name: "##default",
          },
        },
      },
      {
        name: "FindPetsByStatusStatusParam",
        zodSchemaName: "FindPetsByStatusStatusParamSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "string",
          default: "available",
          enum: ["available", "pending", "sold"],
        },
      },
      {
        name: "FindPetsByStatusResponse",
        zodSchemaName: "FindPetsByStatusResponseSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Pet",
          },
        },
      },
      {
        name: "FindPetsByTagsTagsParam",
        zodSchemaName: "FindPetsByTagsTagsParamSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      {
        name: "FindPetsByTagsResponse",
        zodSchemaName: "FindPetsByTagsResponseSchema",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        openApiSchema: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Pet",
          },
        },
      },
      {
        name: "Order",
        zodSchemaName: "OrderSchema",
        filePath: "store/store.models",
        namespace: "StoreModels",
        openApiSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 10,
            },
            petId: {
              type: "integer",
              format: "int64",
              example: 198772,
            },
            quantity: {
              type: "integer",
              format: "int32",
              example: 7,
            },
            shipDate: {
              type: "string",
              format: "date-time",
            },
            status: {
              type: "string",
              description: "Order Status",
              example: "approved",
              enum: ["placed", "approved", "delivered"],
            },
            complete: {
              type: "boolean",
            },
          },
          xml: {
            name: "order",
          },
        },
      },
      {
        name: "GetInventoryResponse",
        zodSchemaName: "GetInventoryResponseSchema",
        filePath: "store/store.models",
        namespace: "StoreModels",
        openApiSchema: {
          type: "object",
          additionalProperties: {
            type: "integer",
            format: "int32",
          },
        },
      },
      {
        name: "User",
        zodSchemaName: "UserSchema",
        filePath: "user/user.models",
        namespace: "UserModels",
        openApiSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 10,
            },
            username: {
              type: "string",
              example: "theUser",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "James",
            },
            email: {
              type: "string",
              example: "john@email.com",
            },
            password: {
              type: "string",
              example: "12345",
            },
            phone: {
              type: "string",
              example: "12345",
            },
            userStatus: {
              type: "integer",
              description: "User Status",
              format: "int32",
              example: 1,
            },
          },
          xml: {
            name: "user",
          },
        },
      },
      {
        name: "CreateUsersWithListInputBody",
        zodSchemaName: "CreateUsersWithListInputBodySchema",
        filePath: "user/user.models",
        namespace: "UserModels",
        openApiSchema: {
          type: "array",
          items: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      {
        name: "Address",
        zodSchemaName: "AddressSchema",
        filePath: "common/common.models",
        namespace: "CommonModels",
        openApiSchema: {
          type: "object",
          properties: {
            street: {
              type: "string",
              example: "437 Lytton",
            },
            city: {
              type: "string",
              example: "Palo Alto",
            },
            state: {
              type: "string",
              example: "CA",
            },
            zip: {
              type: "string",
              example: "94301",
            },
          },
          xml: {
            name: "address",
          },
        },
      },
      {
        name: "Customer",
        zodSchemaName: "CustomerSchema",
        filePath: "common/common.models",
        namespace: "CommonModels",
        openApiSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 100000,
            },
            username: {
              type: "string",
              example: "fehguy",
            },
            address: {
              type: "array",
              xml: {
                name: "addresses",
                wrapped: true,
              },
              items: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
          xml: {
            name: "customer",
          },
        },
      },
    ];

    const queries: QueryMetadata[] = [
      {
        name: "useUpdatePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useAddPet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useFindPetsByStatus",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useFindPetsByTags",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useGetPetById",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useUpdatePetWithForm",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useDeletePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useUploadFile",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
      },
      {
        name: "useGetInventory",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
      },
      {
        name: "usePlaceOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
      },
      {
        name: "useGetOrderById",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
      },
      {
        name: "useDeleteOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
      },
      {
        name: "useCreateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useCreateUsersWithListInput",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useLoginUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useLogoutUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useGetUserByName",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useUpdateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
      {
        name: "useDeleteUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
      },
    ];

    expect(metadata.models).toEqual(metadata.models);
    expect(metadata.queries).toEqual(metadata.queries);
  });
});
