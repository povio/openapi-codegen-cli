import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { DEFAULT_GENERATE_OPTIONS } from "../const/options.const";
import { ModelMetadata, QueryMetadata, TsType } from "../types/metadata";
import { getMetadataFromOpenAPIDoc } from "./getMetadataFromOpenAPIDoc";

describe("getMetadataFromOpenAPIDoc", async () => {
  const openApiDoc = (await SwaggerParser.bundle("./test/petstore.yaml")) as OpenAPIV3.Document;

  const Category: TsType = {
    type: "Category",
    namespace: "PetModels",
    importPath: "pet/pet.models",
    metaType: "object",
    objectProperties: [
      { name: "id", type: "number", isRequired: false, metaType: "primitive" },
      { name: "name", type: "string", isRequired: false, metaType: "primitive" },
    ],
  };

  const Tag: TsType = {
    type: "Tag",
    namespace: "PetModels",
    importPath: "pet/pet.models",
    metaType: "object",
    objectProperties: [
      { name: "id", type: "number", isRequired: false, metaType: "primitive" },
      { name: "name", type: "string", isRequired: false, metaType: "primitive" },
    ],
  };

  const Pet: TsType = {
    type: "Pet",
    namespace: "PetModels",
    importPath: "pet/pet.models",
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
    importPath: "pet/pet.models",
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
    importPath: "store/store.models",
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
    importPath: "user/user.models",
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
    importPath: "user/user.models",
    metaType: "array",
    arrayType: { ...User },
  };

  const FindPetsByStatusStatusParam: TsType = {
    type: "FindPetsByStatusStatusParam",
    importPath: "pet/pet.models",
    namespace: "PetModels",
    metaType: "primitive",
  };

  const FindPetsByStatusResponse: TsType = {
    type: "FindPetsByStatusResponse",
    importPath: "pet/pet.models",
    namespace: "PetModels",
    metaType: "array",
    arrayType: { ...Pet },
  };

  const FindPetsByTagsTagsParam: TsType = {
    type: "FindPetsByTagsTagsParam",
    importPath: "pet/pet.models",
    namespace: "PetModels",
    metaType: "array",
    arrayType: { type: "string", metaType: "primitive" },
  };

  const FindPetsByTagsResponse: TsType = {
    type: "FindPetsByTagsResponse",
    importPath: "pet/pet.models",
    namespace: "PetModels",
    metaType: "array",
    arrayType: { ...Pet },
  };

  const GetInventoryResponse: TsType = {
    type: "GetInventoryResponse",
    importPath: "store/store.models",
    namespace: "StoreModels",
    metaType: "object",
    objectProperties: [],
  };

  const Address: TsType = {
    type: "Address",
    importPath: "common/common.models",
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
    importPath: "common/common.models",
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

  const FindPetsByStatusStatusEnum: ModelMetadata = {
    type: "FindPetsByStatusStatusEnum",
    namespace: "PetModels",
    importPath: "pet/pet.models",
    metaType: "primitive",
  };

  const OrderStatusEnum: ModelMetadata = {
    type: "OrderStatusEnum",
    namespace: "StoreModels",
    importPath: "store/store.models",
    metaType: "primitive",
  };

  const models = (withEnums = true): ModelMetadata[] => [
    ...(withEnums ? [FindPetsByStatusStatusEnum] : []),
    Category,
    Tag,
    Pet,
    ApiResponse,
    FindPetsByStatusStatusParam,
    FindPetsByStatusResponse,
    FindPetsByTagsTagsParam,
    FindPetsByTagsResponse,
    ...(withEnums ? [OrderStatusEnum] : []),
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
      importPath: "pet/pet.queries",
      namespace: "PetQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "data", isRequired: true, ...Pet }],
      response: { ...Pet },
    },
    {
      name: "useAddPet",
      importPath: "pet/pet.queries",
      namespace: "PetQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "data", isRequired: true, ...Pet }],
      response: { ...Pet },
    },
    {
      name: "useFindPetsByStatus",
      importPath: "pet/pet.queries",
      namespace: "PetQueries",
      isQuery: true,
      isMutation: false,
      params: [{ name: "status", isRequired: false, ...FindPetsByStatusStatusParam }],
      response: { ...FindPetsByStatusResponse },
    },
    {
      name: "useFindPetsByTags",
      importPath: "pet/pet.queries",
      namespace: "PetQueries",
      isQuery: true,
      isMutation: false,
      params: [{ name: "tags", isRequired: false, ...FindPetsByTagsTagsParam }],
      response: { ...FindPetsByTagsResponse },
    },
    {
      name: "useGetPetById",
      importPath: "pet/pet.queries",
      namespace: "PetQueries",
      isQuery: true,
      isMutation: false,
      params: [{ name: "petId", type: "number", isRequired: true, metaType: "primitive" }],
      response: { ...Pet },
    },
    {
      name: "useUpdatePetWithForm",
      importPath: "pet/pet.queries",
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
      importPath: "pet/pet.queries",
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
      importPath: "pet/pet.queries",
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
      importPath: "store/store.queries",
      namespace: "StoreQueries",
      isQuery: true,
      isMutation: false,
      params: [],
      response: { ...GetInventoryResponse },
    },
    {
      name: "usePlaceOrder",
      importPath: "store/store.queries",
      namespace: "StoreQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "data", isRequired: true, ...Order }],
      response: { ...Order },
    },
    {
      name: "useGetOrderById",
      importPath: "store/store.queries",
      namespace: "StoreQueries",
      isQuery: true,
      isMutation: false,
      params: [{ name: "orderId", type: "number", isRequired: true, metaType: "primitive" }],
      response: { ...Order },
    },
    {
      name: "useDeleteOrder",
      importPath: "store/store.queries",
      namespace: "StoreQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "orderId", type: "number", isRequired: true, metaType: "primitive" }],
      response: { type: "void", metaType: "primitive" },
    },
    {
      name: "useCreateUser",
      importPath: "user/user.queries",
      namespace: "UserQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "data", isRequired: true, ...User }],
      response: { type: "void", metaType: "primitive" },
    },
    {
      name: "useCreateUsersWithListInput",
      importPath: "user/user.queries",
      namespace: "UserQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "data", isRequired: true, ...CreateUsersWithListInputBody }],
      response: { ...User },
    },
    {
      name: "useLoginUser",
      importPath: "user/user.queries",
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
      importPath: "user/user.queries",
      namespace: "UserQueries",
      isQuery: true,
      isMutation: false,
      params: [],
      response: { type: "void", metaType: "primitive" },
    },
    {
      name: "useGetUserByName",
      importPath: "user/user.queries",
      namespace: "UserQueries",
      isQuery: true,
      isMutation: false,
      params: [{ name: "username", type: "string", isRequired: true, metaType: "primitive" }],
      response: { ...User },
    },
    {
      name: "useUpdateUser",
      importPath: "user/user.queries",
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
      importPath: "user/user.queries",
      namespace: "UserQueries",
      isQuery: false,
      isMutation: true,
      params: [{ name: "username", type: "string", isRequired: true, metaType: "primitive" }],
      response: { type: "void", metaType: "primitive" },
    },
  ];

  test("getMetadataFromOpenAPIDoc", async () => {
    const metadata = await getMetadataFromOpenAPIDoc(openApiDoc, DEFAULT_GENERATE_OPTIONS);

    expect(metadata.models).toEqual(models());
    expect(metadata.queries).toEqual(queries);
  });

  test("getMetadataFromOpenAPIDoc", async () => {
    const extractEnums = false;
    const metadata = await getMetadataFromOpenAPIDoc(openApiDoc, { ...DEFAULT_GENERATE_OPTIONS, extractEnums });

    expect(metadata.models).toEqual(models(extractEnums));
    expect(metadata.queries).toEqual(queries);
  });
});
