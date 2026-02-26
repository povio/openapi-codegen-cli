import { CommonModels } from "../common/common.models";

export namespace PetModels {
  export const PetSchema = CommonModels.PetSchema;
  export const FindByStatusResponseSchema = CommonModels.FindByStatusResponseSchema;
  export const FindByStatusStatusParamSchema = CommonModels.FindByStatusStatusParamSchema;
  export const FindByTagsResponseSchema = CommonModels.FindByTagsResponseSchema;
  export const FindByTagsTagsParamSchema = CommonModels.FindByTagsTagsParamSchema;
  export const ApiResponseSchema = CommonModels.ApiResponseSchema;
  export const CategorySchema = CommonModels.CategorySchema;
  export const TagSchema = CommonModels.TagSchema;
  export const FindByStatusStatusEnumSchema = CommonModels.FindByStatusStatusEnumSchema;
  export type Pet = CommonModels.Pet;
  export type FindByStatusResponse = CommonModels.FindByStatusResponse;
  export type FindByStatusStatusParam = CommonModels.FindByStatusStatusParam;
  export type FindByTagsResponse = CommonModels.FindByTagsResponse;
  export type FindByTagsTagsParam = CommonModels.FindByTagsTagsParam;
  export type ApiResponse = CommonModels.ApiResponse;
  export type Category = CommonModels.Category;
  export type Tag = CommonModels.Tag;
  export type FindByStatusStatusEnum = CommonModels.FindByStatusStatusEnum;
  export const FindByStatusStatusEnum = CommonModels.FindByStatusStatusEnum;
}
