import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerMeModels } from "./controlTowerMe.models";

export namespace ControlTowerMeQueries {
const getUserProfile = () => {
  return AppRestClient.get(
    { resSchema: ControlTowerMeModels.GetUserProfileResponseSchema },
    `/me`,
    
  );
};

const updateUserData = (data: ControlTowerMeModels.UserUpdateDto) => {
  return AppRestClient.put(
    { resSchema: ControlTowerMeModels.UpdateUserDataResponseSchema },
    `/me`,
    ZodExtended.parse(ControlTowerMeModels.UserUpdateDtoSchema, data),
    
  );
};

const updateUserProfile = (data: ControlTowerMeModels.UserBasicUpdateDto) => {
  return AppRestClient.put(
    { resSchema: ControlTowerMeModels.UpdateUserProfileResponseSchema },
    `/me/basic`,
    ZodExtended.parse(ControlTowerMeModels.UserBasicUpdateDtoSchema, data),
    
  );
};

const updatePassword = (data: ControlTowerMeModels.UserPasswordUpdateDto) => {
  return AppRestClient.put(
    { resSchema: z.void() },
    `/me/password`,
    ZodExtended.parse(ControlTowerMeModels.UserPasswordUpdateDtoSchema, data),
    
  );
};

const updateEmailPreferences = (data: ControlTowerMeModels.UserEmailPreferencesUpdateDto) => {
  return AppRestClient.put(
    { resSchema: z.void() },
    `/me/email-preferences`,
    ZodExtended.parse(ControlTowerMeModels.UserEmailPreferencesUpdateDtoSchema, data),
    
  );
};

const updateProjectAccess = () => {
  return AppRestClient.put(
    { resSchema: z.void() },
    `/me/access`,
    
  );
};


export const moduleName = QueryModule.ControlTowerMe;

export const keys = {
    all: [moduleName] as const,
    getUserProfile: () => [...keys.all, "/me", ] as const,
};

/** 
 * Query `useGetUserProfile`
 * @description Get basic user profile data
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerMeModels.GetUserProfileResponse> } 
 * @statusCodes [200]
 */
export const useGetUserProfile = <TData>(options?: AppQueryOptions<typeof getUserProfile, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getUserProfile(),
    queryFn: getUserProfile,
    ...options,
  });
};

/** 
 * Mutation `useUpdateUserData`
 * @description Update user data
 * @param { ControlTowerMeModels.UserUpdateDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerMeModels.UpdateUserDataResponse> } 
 * @statusCodes [200]
 */
export const useUpdateUserData = (options?: AppMutationOptions<typeof updateUserData, { data: ControlTowerMeModels.UserUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      updateUserData(data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateUserProfile`
 * @description Update basic user profile data
 * @param { ControlTowerMeModels.UserBasicUpdateDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerMeModels.UpdateUserProfileResponse> } 
 * @statusCodes [200]
 */
export const useUpdateUserProfile = (options?: AppMutationOptions<typeof updateUserProfile, { data: ControlTowerMeModels.UserBasicUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      updateUserProfile(data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdatePassword`
 * @description Update user password
 * @param { ControlTowerMeModels.UserPasswordUpdateDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200]
 */
export const useUpdatePassword = (options?: AppMutationOptions<typeof updatePassword, { data: ControlTowerMeModels.UserPasswordUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      updatePassword(data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateEmailPreferences`
 * @description Update user email notification preferences
 * @param { ControlTowerMeModels.UserEmailPreferencesUpdateDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200]
 */
export const useUpdateEmailPreferences = (options?: AppMutationOptions<typeof updateEmailPreferences, { data: ControlTowerMeModels.UserEmailPreferencesUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      updateEmailPreferences(data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateProjectAccess`
 * @description Update user project access
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200]
 */
export const useUpdateProjectAccess = (options?: AppMutationOptions<typeof updateProjectAccess, {  }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: () => 
      updateProjectAccess()
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
