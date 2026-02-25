import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerMeModels } from "./controlTowerMe.models";

export namespace ControlTowerMeApi {
  export const getUserProfile = (config?: AxiosRequestConfig) => {
    return AppRestClient.get({ resSchema: ControlTowerMeModels.GetUserProfileResponseSchema }, `/me`, config);
  };
  export const updateUserData = (data: ControlTowerMeModels.UserUpdateDto, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
      { resSchema: ControlTowerMeModels.UpdateUserDataResponseSchema },
      `/me`,
      ZodExtended.parse(ControlTowerMeModels.UserUpdateDtoSchema, data),
      config,
    );
  };
  export const updateUserProfile = (data: ControlTowerMeModels.UserBasicUpdateDto, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
      { resSchema: ControlTowerMeModels.UpdateUserProfileResponseSchema },
      `/me/basic`,
      ZodExtended.parse(ControlTowerMeModels.UserBasicUpdateDtoSchema, data),
      config,
    );
  };
  export const updatePassword = (data: ControlTowerMeModels.UserPasswordUpdateDto, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
      { resSchema: z.void() },
      `/me/password`,
      ZodExtended.parse(ControlTowerMeModels.UserPasswordUpdateDtoSchema, data),
      config,
    );
  };
  export const updateEmailPreferences = (
    data: ControlTowerMeModels.UserEmailPreferencesUpdateDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: z.void() },
      `/me/email-preferences`,
      ZodExtended.parse(ControlTowerMeModels.UserEmailPreferencesUpdateDtoSchema, data),
      config,
    );
  };
  export const updateProjectAccess = (config?: AxiosRequestConfig) => {
    return AppRestClient.put({ resSchema: z.void() }, `/me/access`, undefined, config);
  };
}
