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
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "name", type: "string", required: false },
        ],
      },
      {
        name: "Tag",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "name", type: "string", required: false },
        ],
      },
      {
        name: "Pet",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "name", type: "string", required: true },
          { name: "category", type: "Category", required: false, namespace: "PetModels", filePath: "pet/pet.models" },
          { name: "photoUrls", type: "string[]", required: true },
          { name: "tags", type: "Tag[]", required: false, namespace: "PetModels", filePath: "pet/pet.models" },
          { name: "status", type: "string", required: false },
        ],
      },
      {
        name: "ApiResponse",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [
          { name: "code", type: "number", required: false },
          { name: "type", type: "string", required: false },
          { name: "message", type: "string", required: false },
        ],
      },
      {
        name: "FindPetsByStatusStatusParam",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [],
      },
      {
        name: "FindPetsByStatusResponse",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [],
      },
      {
        name: "FindPetsByTagsTagsParam",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [],
      },
      {
        name: "FindPetsByTagsResponse",
        filePath: "pet/pet.models",
        namespace: "PetModels",
        properties: [],
      },
      {
        name: "Order",
        filePath: "store/store.models",
        namespace: "StoreModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "petId", type: "number", required: false },
          { name: "quantity", type: "number", required: false },
          { name: "shipDate", type: "string", required: false },
          { name: "status", type: "string", required: false },
          { name: "complete", type: "boolean", required: false },
        ],
      },
      {
        name: "GetInventoryResponse",
        filePath: "store/store.models",
        namespace: "StoreModels",
        properties: [],
      },
      {
        name: "User",
        filePath: "user/user.models",
        namespace: "UserModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "username", type: "string", required: false },
          { name: "firstName", type: "string", required: false },
          { name: "lastName", type: "string", required: false },
          { name: "email", type: "string", required: false },
          { name: "password", type: "string", required: false },
          { name: "phone", type: "string", required: false },
          { name: "userStatus", type: "number", required: false },
        ],
      },
      {
        name: "CreateUsersWithListInputBody",
        filePath: "user/user.models",
        namespace: "UserModels",
        properties: [],
      },
      {
        name: "Address",
        filePath: "common/common.models",
        namespace: "CommonModels",
        properties: [
          { name: "street", type: "string", required: false },
          { name: "city", type: "string", required: false },
          { name: "state", type: "string", required: false },
          { name: "zip", type: "string", required: false },
        ],
      },
      {
        name: "Customer",
        filePath: "common/common.models",
        namespace: "CommonModels",
        properties: [
          { name: "id", type: "number", required: false },
          { name: "username", type: "string", required: false },
          {
            name: "address",
            type: "Address[]",
            required: false,
            namespace: "CommonModels",
            filePath: "common/common.models",
          },
        ],
      },
    ];

    const queries: QueryMetadata[] = [
      {
        name: "useUpdatePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [{ name: "data", type: "Pet", required: true, namespace: "PetModels", filePath: "pet/pet.models" }],
      },
      {
        name: "useAddPet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [{ name: "data", type: "Pet", required: true, namespace: "PetModels", filePath: "pet/pet.models" }],
      },
      {
        name: "useFindPetsByStatus",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [
          {
            name: "status",
            type: "FindPetsByStatusStatusParam",
            required: false,
            namespace: "PetModels",
            filePath: "pet/pet.models",
          },
        ],
      },
      {
        name: "useFindPetsByTags",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [
          {
            name: "tags",
            type: "FindPetsByTagsTagsParam",
            required: false,
            namespace: "PetModels",
            filePath: "pet/pet.models",
          },
        ],
      },
      {
        name: "useGetPetById",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [{ name: "petId", type: "number", required: true }],
      },
      {
        name: "useUpdatePetWithForm",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [
          { name: "petId", type: "number", required: true },
          { name: "name", type: "string", required: true },
          { name: "status", type: "string", required: true },
        ],
      },
      {
        name: "useDeletePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [
          { name: "petId", type: "number", required: true },
          { name: "api_key", type: "string", required: false },
        ],
      },
      {
        name: "useUploadFile",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        params: [
          { name: "petId", type: "number", required: true },
          { name: "data", type: "string", required: true },
          { name: "additionalMetadata", type: "string", required: false },
        ],
      },
      {
        name: "useGetInventory",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        params: [],
      },
      {
        name: "usePlaceOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        params: [
          { name: "data", type: "Order", required: true, namespace: "StoreModels", filePath: "store/store.models" },
        ],
      },
      {
        name: "useGetOrderById",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        params: [{ name: "orderId", type: "number", required: true }],
      },
      {
        name: "useDeleteOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        params: [{ name: "orderId", type: "number", required: true }],
      },
      {
        name: "useCreateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [
          {
            name: "data",
            type: "User",
            required: true,
            namespace: "UserModels",
            filePath: "user/user.models",
          },
        ],
      },
      {
        name: "useCreateUsersWithListInput",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [
          {
            name: "data",
            type: "CreateUsersWithListInputBody",
            required: true,
            namespace: "UserModels",
            filePath: "user/user.models",
          },
        ],
      },
      {
        name: "useLoginUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [
          { name: "username", type: "string", required: false },
          { name: "password", type: "string", required: false },
        ],
      },
      {
        name: "useLogoutUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [],
      },
      {
        name: "useGetUserByName",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [{ name: "username", type: "string", required: true }],
      },
      {
        name: "useUpdateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [
          { name: "username", type: "string", required: true },
          { name: "data", type: "User", required: true, namespace: "UserModels", filePath: "user/user.models" },
        ],
      },
      {
        name: "useDeleteUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        params: [{ name: "username", type: "string", required: true }],
      },
    ];

    expect(metadata.models).toEqual(models);
    expect(metadata.queries).toEqual(queries);
  });
});
