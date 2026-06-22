import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerMeModels } from "./controlTowerMe.models";

export namespace ControlTowerMeApi {
export const getUserProfile = () => {
    return AppRestClient.get(
        { resSchema: ControlTowerMeModels.GetUserProfileResponseSchema },
        `/me`,
        
    )
};
export const updateUserData = (data: ControlTowerMeModels.UserUpdateDto, ) => {
    return AppRestClient.put(
        { resSchema: ControlTowerMeModels.UpdateUserDataResponseSchema },
        `/me`,
        ZodExtended.parse(ControlTowerMeModels.UserUpdateDtoSchema, data),
        
    )
};
export const updateUserProfile = (data: ControlTowerMeModels.UserBasicUpdateDto, ) => {
    return AppRestClient.put(
        { resSchema: ControlTowerMeModels.UpdateUserProfileResponseSchema },
        `/me/basic`,
        ZodExtended.parse(ControlTowerMeModels.UserBasicUpdateDtoSchema, data),
        
    )
};
export const updatePassword = (data: ControlTowerMeModels.UserPasswordUpdateDto, ) => {
    return AppRestClient.put(
        { resSchema: z.void() },
        `/me/password`,
        ZodExtended.parse(ControlTowerMeModels.UserPasswordUpdateDtoSchema, data),
        
    )
};
export const updateEmailPreferences = (data: ControlTowerMeModels.UserEmailPreferencesUpdateDto, ) => {
    return AppRestClient.put(
        { resSchema: z.void() },
        `/me/email-preferences`,
        ZodExtended.parse(ControlTowerMeModels.UserEmailPreferencesUpdateDtoSchema, data),
        
    )
};
export const updateProjectAccess = () => {
    return AppRestClient.put(
        { resSchema: z.void() },
        `/me/access`,
        
    )
};
}
