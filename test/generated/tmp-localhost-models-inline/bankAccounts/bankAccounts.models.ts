import { CommonModels } from "@/data/common/common.models";

export namespace BankAccountsModels {
  export const BankAccountsFindAllResponseSchema = CommonModels.BankAccountsFindAllResponseSchema;
  export const BankAccountsPaginateLabelsResponseSchema = CommonModels.BankAccountsPaginateLabelsResponseSchema;
  export const BankAccountsPaginateLabelsOrderParamEnumSchema = CommonModels.BankAccountsPaginateLabelsOrderParamEnumSchema;
  export const BankAccountFilterDtoSchema = CommonModels.BankAccountFilterDtoSchema;
  export const LabelResponseDTOSchema = CommonModels.LabelResponseDTOSchema;
  export const PaginationDtoSchema = CommonModels.PaginationDtoSchema;
  export type BankAccountsFindAllResponse = CommonModels.BankAccountsFindAllResponse;
  export type BankAccountsPaginateLabelsResponse = CommonModels.BankAccountsPaginateLabelsResponse;
  export type BankAccountsPaginateLabelsOrderParamEnum = CommonModels.BankAccountsPaginateLabelsOrderParamEnum;
  export type BankAccountFilterDto = CommonModels.BankAccountFilterDto;
  export type LabelResponseDTO = CommonModels.LabelResponseDTO;
  export type PaginationDto = CommonModels.PaginationDto;
  export const BankAccountsPaginateLabelsOrderParamEnum = CommonModels.BankAccountsPaginateLabelsOrderParamEnum;
}
