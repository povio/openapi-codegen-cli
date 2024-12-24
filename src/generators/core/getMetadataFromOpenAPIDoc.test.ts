import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { DEFAULT_GENERATE_OPTIONS } from "../const/options.const";
import { ModelMetadata, QueryMetadata, TsNestedType } from "../types/metadata";
import { getMetadataFromOpenAPIDoc } from "./getMetadataFromOpenAPIDoc";

describe("getMetadataFromOpenAPIDoc", async () => {
  const openApiDoc = (await SwaggerParser.bundle("./test/petstore.yaml")) as OpenAPIV3.Document;

  test("getMetadataFromOpenAPIDoc", async () => {
    const metadata = await getMetadataFromOpenAPIDoc({ openApiDoc, options: DEFAULT_GENERATE_OPTIONS });

    const Category: TsNestedType = {
      type: "Category",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "name", type: "string", isRequired: false, dataType: "primitive" },
      ],
    };

    const Tag: TsNestedType = {
      type: "Tag",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "name", type: "string", isRequired: false, dataType: "primitive" },
      ],
    };

    const Pet: TsNestedType = {
      type: "Pet",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "name", type: "string", isRequired: true, dataType: "primitive" },
        { name: "category", isRequired: false, ...Category },
        {
          name: "photoUrls",
          type: "array",
          isRequired: true,
          dataType: "array",
          arrayType: { type: "string", dataType: "primitive" },
        },
        {
          name: "tags",
          type: "array",
          isRequired: false,
          dataType: "array",
          arrayType: { ...Tag },
        },
        { name: "status", type: "string", isRequired: false, dataType: "primitive" },
      ],
    };

    const ApiResponse: TsNestedType = {
      type: "ApiResponse",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      dataType: "object",
      objectProperties: [
        { name: "code", type: "number", isRequired: false, dataType: "primitive" },
        { name: "type", type: "string", isRequired: false, dataType: "primitive" },
        { name: "message", type: "string", isRequired: false, dataType: "primitive" },
      ],
    };

    const Order: TsNestedType = {
      type: "Order",
      namespace: "StoreModels",
      filePath: "store/store.models",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "petId", type: "number", isRequired: false, dataType: "primitive" },
        { name: "quantity", type: "number", isRequired: false, dataType: "primitive" },
        { name: "shipDate", type: "string", isRequired: false, dataType: "primitive" },
        { name: "status", type: "string", isRequired: false, dataType: "primitive" },
        { name: "complete", type: "boolean", isRequired: false, dataType: "primitive" },
      ],
    };

    const User: TsNestedType = {
      type: "User",
      namespace: "UserModels",
      filePath: "user/user.models",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "username", type: "string", isRequired: false, dataType: "primitive" },
        { name: "firstName", type: "string", isRequired: false, dataType: "primitive" },
        { name: "lastName", type: "string", isRequired: false, dataType: "primitive" },
        { name: "email", type: "string", isRequired: false, dataType: "primitive" },
        { name: "password", type: "string", isRequired: false, dataType: "primitive" },
        { name: "phone", type: "string", isRequired: false, dataType: "primitive" },
        { name: "userStatus", type: "number", isRequired: false, dataType: "primitive" },
      ],
    };

    const CreateUsersWithListInputBody: TsNestedType = {
      type: "CreateUsersWithListInputBody",
      namespace: "UserModels",
      filePath: "user/user.models",
      dataType: "array",
      arrayType: { ...User },
    };

    const FindPetsByStatusStatusParam: TsNestedType = {
      type: "FindPetsByStatusStatusParam",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      dataType: "primitive",
    };

    const FindPetsByStatusResponse: TsNestedType = {
      type: "FindPetsByStatusResponse",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      dataType: "array",
      arrayType: { ...Pet },
    };

    const FindPetsByTagsTagsParam: TsNestedType = {
      type: "FindPetsByTagsTagsParam",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      dataType: "array",
      arrayType: { type: "string", dataType: "primitive" },
    };

    const FindPetsByTagsResponse: TsNestedType = {
      type: "FindPetsByTagsResponse",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      dataType: "array",
      arrayType: { ...Pet },
    };

    const GetInventoryResponse: TsNestedType = {
      type: "GetInventoryResponse",
      filePath: "store/store.models",
      namespace: "StoreModels",
      dataType: "object",
      objectProperties: [],
    };

    const Address: TsNestedType = {
      type: "Address",
      filePath: "common/common.models",
      namespace: "CommonModels",
      dataType: "object",
      objectProperties: [
        { name: "street", type: "string", isRequired: false, dataType: "primitive" },
        { name: "city", type: "string", isRequired: false, dataType: "primitive" },
        { name: "state", type: "string", isRequired: false, dataType: "primitive" },
        { name: "zip", type: "string", isRequired: false, dataType: "primitive" },
      ],
    };

    const Customer: TsNestedType = {
      type: "Customer",
      filePath: "common/common.models",
      namespace: "CommonModels",
      dataType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, dataType: "primitive" },
        { name: "username", type: "string", isRequired: false, dataType: "primitive" },
        {
          name: "address",
          type: "array",
          isRequired: false,
          dataType: "array",
          arrayType: { ...Address },
        },
      ],
    };

    const models: ModelMetadata[] = [
      Category,
      Tag,
      Pet,
      ApiResponse,
      FindPetsByStatusStatusParam,
      FindPetsByStatusResponse,
      FindPetsByTagsTagsParam,
      FindPetsByTagsResponse,
      Order,
      GetInventoryResponse,
      User,
      CreateUsersWithListInputBody,
      Address,
      Customer,
    ];

    const queries: QueryMetadata[] = [
      {
        name: "useUpdatePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...Pet }],
        response: { ...Pet },
      },
      {
        name: "useAddPet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...Pet }],
        response: { ...Pet },
      },
      {
        name: "useFindPetsByStatus",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "status", isRequired: false, ...FindPetsByStatusStatusParam }],
        response: { ...FindPetsByStatusResponse },
      },
      {
        name: "useFindPetsByTags",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "tags", isRequired: false, ...FindPetsByTagsTagsParam }],
        response: { ...FindPetsByTagsResponse },
      },
      {
        name: "useGetPetById",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "petId", type: "number", isRequired: true, dataType: "primitive" }],
        response: { ...Pet },
      },
      {
        name: "useUpdatePetWithForm",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, dataType: "primitive" },
          { name: "name", type: "string", isRequired: true, dataType: "primitive" },
          { name: "status", type: "string", isRequired: true, dataType: "primitive" },
        ],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useDeletePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, dataType: "primitive" },
          { name: "api_key", type: "string", isRequired: false, dataType: "primitive" },
        ],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useUploadFile",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, dataType: "primitive" },
          { name: "data", type: "string", isRequired: true, dataType: "primitive" },
          { name: "additionalMetadata", type: "string", isRequired: false, dataType: "primitive" },
        ],
        response: { ...ApiResponse },
      },
      {
        name: "useGetInventory",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        isQuery: true,
        isMutation: false,
        params: [],
        response: { ...GetInventoryResponse },
      },
      {
        name: "usePlaceOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...Order }],
        response: { ...Order },
      },
      {
        name: "useGetOrderById",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "orderId", type: "number", isRequired: true, dataType: "primitive" }],
        response: { ...Order },
      },
      {
        name: "useDeleteOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "orderId", type: "number", isRequired: true, dataType: "primitive" }],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useCreateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...User }],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useCreateUsersWithListInput",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...CreateUsersWithListInputBody }],
        response: { ...User },
      },
      {
        name: "useLoginUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: true,
        isMutation: false,
        params: [
          { name: "username", type: "string", isRequired: false, dataType: "primitive" },
          { name: "password", type: "string", isRequired: false, dataType: "primitive" },
        ],
        response: { type: "string", dataType: "primitive" },
      },
      {
        name: "useLogoutUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: true,
        isMutation: false,
        params: [],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useGetUserByName",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "username", type: "string", isRequired: true, dataType: "primitive" }],
        response: { ...User },
      },
      {
        name: "useUpdateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "username", type: "string", isRequired: true, dataType: "primitive" },
          { name: "data", isRequired: true, ...User },
        ],
        response: { type: "void", dataType: "primitive" },
      },
      {
        name: "useDeleteUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "username", type: "string", isRequired: true, dataType: "primitive" }],
        response: { type: "void", dataType: "primitive" },
      },
    ];

    expect(metadata.models).toEqual(models);
    expect(metadata.queries).toEqual(queries);
  });
});
