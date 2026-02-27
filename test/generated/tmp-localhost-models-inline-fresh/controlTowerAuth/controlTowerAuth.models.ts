import { CommonModels } from "@/data/common/common.models";

export namespace ControlTowerAuthModels {
  export const LoginResponseDtoSchema = CommonModels.LoginResponseDtoSchema;
  export const LoginRequestDtoSchema = CommonModels.LoginRequestDtoSchema;
  export const PasswordResetDtoSchema = CommonModels.PasswordResetDtoSchema;
  export type LoginResponseDto = CommonModels.LoginResponseDto;
  export type LoginRequestDto = CommonModels.LoginRequestDto;
  export type PasswordResetDto = CommonModels.PasswordResetDto;
}
