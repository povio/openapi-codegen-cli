import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { DEFAULT_GENERATE_OPTIONS } from "../const/options.const";
import { ModelMetadata, QueryMetadata, TsType } from "../types/metadata";
import { getMetadataFromOpenAPIDoc } from "./getMetadataFromOpenAPIDoc";

describe("getMetadataFromOpenAPIDoc", async () => {
  const openApiDoc = (await SwaggerParser.bundle("./test/petstore.yaml")) as OpenAPIV3.Document;

  test("getMetadataFromOpenAPIDoc", async () => {
    const metadata = await getMetadataFromOpenAPIDoc(openApiDoc, DEFAULT_GENERATE_OPTIONS);

    const Category: TsType = {
      type: "Category",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "name", type: "string", isRequired: false, metaType: "primitive" },
      ],
    };

    const Tag: TsType = {
      type: "Tag",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "name", type: "string", isRequired: false, metaType: "primitive" },
      ],
    };

    const Pet: TsType = {
      type: "Pet",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "name", type: "string", isRequired: true, metaType: "primitive" },
        { name: "category", isRequired: false, ...Category },
        {
          name: "photoUrls",
          type: "array",
          isRequired: true,
          metaType: "array",
          arrayType: { type: "string", metaType: "primitive" },
        },
        {
          name: "tags",
          type: "array",
          isRequired: false,
          metaType: "array",
          arrayType: { ...Tag },
        },
        { name: "status", type: "string", isRequired: false, metaType: "primitive" },
      ],
    };

    const ApiResponse: TsType = {
      type: "ApiResponse",
      namespace: "PetModels",
      filePath: "pet/pet.models",
      metaType: "object",
      objectProperties: [
        { name: "code", type: "number", isRequired: false, metaType: "primitive" },
        { name: "type", type: "string", isRequired: false, metaType: "primitive" },
        { name: "message", type: "string", isRequired: false, metaType: "primitive" },
      ],
    };

    const Order: TsType = {
      type: "Order",
      namespace: "StoreModels",
      filePath: "store/store.models",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "petId", type: "number", isRequired: false, metaType: "primitive" },
        { name: "quantity", type: "number", isRequired: false, metaType: "primitive" },
        { name: "shipDate", type: "string", isRequired: false, metaType: "primitive" },
        { name: "status", type: "string", isRequired: false, metaType: "primitive" },
        { name: "complete", type: "boolean", isRequired: false, metaType: "primitive" },
      ],
    };

    const User: TsType = {
      type: "User",
      namespace: "UserModels",
      filePath: "user/user.models",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "username", type: "string", isRequired: false, metaType: "primitive" },
        { name: "firstName", type: "string", isRequired: false, metaType: "primitive" },
        { name: "lastName", type: "string", isRequired: false, metaType: "primitive" },
        { name: "email", type: "string", isRequired: false, metaType: "primitive" },
        { name: "password", type: "string", isRequired: false, metaType: "primitive" },
        { name: "phone", type: "string", isRequired: false, metaType: "primitive" },
        { name: "userStatus", type: "number", isRequired: false, metaType: "primitive" },
      ],
    };

    const CreateUsersWithListInputBody: TsType = {
      type: "CreateUsersWithListInputBody",
      namespace: "UserModels",
      filePath: "user/user.models",
      metaType: "array",
      arrayType: { ...User },
    };

    const FindPetsByStatusStatusParam: TsType = {
      type: "FindPetsByStatusStatusParam",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      metaType: "primitive",
    };

    const FindPetsByStatusResponse: TsType = {
      type: "FindPetsByStatusResponse",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      metaType: "array",
      arrayType: { ...Pet },
    };

    const FindPetsByTagsTagsParam: TsType = {
      type: "FindPetsByTagsTagsParam",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      metaType: "array",
      arrayType: { type: "string", metaType: "primitive" },
    };

    const FindPetsByTagsResponse: TsType = {
      type: "FindPetsByTagsResponse",
      filePath: "pet/pet.models",
      namespace: "PetModels",
      metaType: "array",
      arrayType: { ...Pet },
    };

    const GetInventoryResponse: TsType = {
      type: "GetInventoryResponse",
      filePath: "store/store.models",
      namespace: "StoreModels",
      metaType: "object",
      objectProperties: [],
    };

    const Address: TsType = {
      type: "Address",
      filePath: "common/common.models",
      namespace: "CommonModels",
      metaType: "object",
      objectProperties: [
        { name: "street", type: "string", isRequired: false, metaType: "primitive" },
        { name: "city", type: "string", isRequired: false, metaType: "primitive" },
        { name: "state", type: "string", isRequired: false, metaType: "primitive" },
        { name: "zip", type: "string", isRequired: false, metaType: "primitive" },
      ],
    };

    const Customer: TsType = {
      type: "Customer",
      filePath: "common/common.models",
      namespace: "CommonModels",
      metaType: "object",
      objectProperties: [
        { name: "id", type: "number", isRequired: false, metaType: "primitive" },
        { name: "username", type: "string", isRequired: false, metaType: "primitive" },
        {
          name: "address",
          type: "array",
          isRequired: false,
          metaType: "array",
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
        params: [{ name: "petId", type: "number", isRequired: true, metaType: "primitive" }],
        response: { ...Pet },
      },
      {
        name: "useUpdatePetWithForm",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, metaType: "primitive" },
          { name: "name", type: "string", isRequired: true, metaType: "primitive" },
          { name: "status", type: "string", isRequired: true, metaType: "primitive" },
        ],
        response: { type: "void", metaType: "primitive" },
      },
      {
        name: "useDeletePet",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, metaType: "primitive" },
          { name: "api_key", type: "string", isRequired: false, metaType: "primitive" },
        ],
        response: { type: "void", metaType: "primitive" },
      },
      {
        name: "useUploadFile",
        filePath: "pet/pet.queries",
        namespace: "PetQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "petId", type: "number", isRequired: true, metaType: "primitive" },
          { name: "data", type: "string", isRequired: true, metaType: "primitive" },
          { name: "additionalMetadata", type: "string", isRequired: false, metaType: "primitive" },
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
        params: [{ name: "orderId", type: "number", isRequired: true, metaType: "primitive" }],
        response: { ...Order },
      },
      {
        name: "useDeleteOrder",
        filePath: "store/store.queries",
        namespace: "StoreQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "orderId", type: "number", isRequired: true, metaType: "primitive" }],
        response: { type: "void", metaType: "primitive" },
      },
      {
        name: "useCreateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "data", isRequired: true, ...User }],
        response: { type: "void", metaType: "primitive" },
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
          { name: "username", type: "string", isRequired: false, metaType: "primitive" },
          { name: "password", type: "string", isRequired: false, metaType: "primitive" },
        ],
        response: { type: "string", metaType: "primitive" },
      },
      {
        name: "useLogoutUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: true,
        isMutation: false,
        params: [],
        response: { type: "void", metaType: "primitive" },
      },
      {
        name: "useGetUserByName",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: true,
        isMutation: false,
        params: [{ name: "username", type: "string", isRequired: true, metaType: "primitive" }],
        response: { ...User },
      },
      {
        name: "useUpdateUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [
          { name: "username", type: "string", isRequired: true, metaType: "primitive" },
          { name: "data", isRequired: true, ...User },
        ],
        response: { type: "void", metaType: "primitive" },
      },
      {
        name: "useDeleteUser",
        filePath: "user/user.queries",
        namespace: "UserQueries",
        isQuery: false,
        isMutation: true,
        params: [{ name: "username", type: "string", isRequired: true, metaType: "primitive" }],
        response: { type: "void", metaType: "primitive" },
      },
    ];

    expect(metadata.models).toEqual(models);
    expect(metadata.queries).toEqual(queries);
  });
});
