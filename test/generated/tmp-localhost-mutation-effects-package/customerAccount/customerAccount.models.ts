import { CommonModels } from "@/data/common/common.models";

export namespace CustomerAccountModels {
  export const CustomerAccountDtoSchema = CommonModels.CustomerAccountDtoSchema;
  export const CustomerCompanyDtoSchema = CommonModels.CustomerCompanyDtoSchema;
  export const CustomerBusinessPartnerDtoSchema = CommonModels.CustomerBusinessPartnerDtoSchema;
  export type CustomerAccountDto = CommonModels.CustomerAccountDto;
  export type CustomerCompanyDto = CommonModels.CustomerCompanyDto;
  export type CustomerBusinessPartnerDto = CommonModels.CustomerBusinessPartnerDto;
}
