import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerAuthModels } from "./controlTowerAuth.models";

export namespace ControlTowerAuthApi {
  export const login = (data: ControlTowerAuthModels.LoginRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
      `/auth/move/login`,
      ZodExtended.parse(ControlTowerAuthModels.LoginRequestDtoSchema, data),
      config,
    );
  };

  export const resetPassword = (data: ControlTowerAuthModels.PasswordResetDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
      `/auth/reset-password`,
      ZodExtended.parse(ControlTowerAuthModels.PasswordResetDtoSchema, data),
      config,
    );
  };
}
