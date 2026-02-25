import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerMeModels } from "./controlTowerMe.models";
import { ControlTowerMeApi } from "./controlTowerMe.api";

export namespace ControlTowerMeQueries {
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
export const useGetUserProfile = <TData>(options?: AppQueryOptions<typeof ControlTowerMeApi.getUserProfile, TData>) => {
  
  return useQuery({
    queryKey: keys.getUserProfile(),
    queryFn: ControlTowerMeApi.getUserProfile,
    ...options,
  });
};

/** 
 * Mutation `useUpdateUserData`
 * @description Update user data
 * @param { ControlTowerMeModels.UserUpdateDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerMeModels.UpdateUserDataResponse> } 
 * @statusCodes [200]
 */
export const useUpdateUserData = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateUserData, { data: ControlTowerMeModels.UserUpdateDto }> & MutationEffectsOptions) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateUserData(data)
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
 * @param { ControlTowerMeModels.UserBasicUpdateDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerMeModels.UpdateUserProfileResponse> } 
 * @statusCodes [200]
 */
export const useUpdateUserProfile = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateUserProfile, { data: ControlTowerMeModels.UserBasicUpdateDto }> & MutationEffectsOptions) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateUserProfile(data)
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
 * @param { ControlTowerMeModels.UserPasswordUpdateDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200]
 */
export const useUpdatePassword = (options?: AppMutationOptions<typeof ControlTowerMeApi.updatePassword, { data: ControlTowerMeModels.UserPasswordUpdateDto }> & MutationEffectsOptions) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updatePassword(data)
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
 * @param { ControlTowerMeModels.UserEmailPreferencesUpdateDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200]
 */
export const useUpdateEmailPreferences = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateEmailPreferences, { data: ControlTowerMeModels.UserEmailPreferencesUpdateDto }> & MutationEffectsOptions) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateEmailPreferences(data)
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
export const useUpdateProjectAccess = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateProjectAccess, {  }> & MutationEffectsOptions) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: () => 
      ControlTowerMeApi.updateProjectAccess()
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
