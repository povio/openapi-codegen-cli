import { CommonModels } from "@/data/common/common.models";

export namespace ControlTowerSearchModels {
  export const SearchResponseDtoSchema = CommonModels.SearchResponseDtoSchema;
  export const SearchRequestDtoSchema = CommonModels.SearchRequestDtoSchema;
  export const SearchItemTypeEnumSchema = CommonModels.SearchItemTypeEnumSchema;
  export const SearchItemDtoSchema = CommonModels.SearchItemDtoSchema;
  export type SearchResponseDto = CommonModels.SearchResponseDto;
  export type SearchRequestDto = CommonModels.SearchRequestDto;
  export type SearchItemTypeEnum = CommonModels.SearchItemTypeEnum;
  export type SearchItemDto = CommonModels.SearchItemDto;
  export const SearchItemTypeEnum = CommonModels.SearchItemTypeEnum;
}
