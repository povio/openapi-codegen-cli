import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerMeModels } from "./controlTowerMe.models";
import { ControlTowerMeApi } from "./controlTowerMe.api";

export namespace ControlTowerMeQueries {
export const moduleName = QueryModule.ControlTowerMe;

export const keys = {
    all: [moduleName] as const,
    getUserProfile: () => [...keys.all, "/me", ] as const,
};

export const getUserProfileQueryOptions = () => ({
  queryKey: keys.getUserProfile(),
  queryFn: () => ControlTowerMeApi.getUserProfile(),
});

/** 
 * Query `useGetUserProfile`
 * @description Get basic user profile data
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerMeModels.GetUserProfileResponse> } 
 * @statusCodes [200]
 */
export const useGetUserProfile = <TData>(options?: AppQueryOptions<typeof ControlTowerMeApi.getUserProfile, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...getUserProfileQueryOptions(),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetUserProfile = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getUserProfileQueryOptions(), ...options });
};

/** 
 * Mutation `useUpdateUserData`
 * @description Update user data
 * @param { ControlTowerMeModels.UserUpdateDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerMeModels.UpdateUserDataResponse> } 
 * @statusCodes [200]
 */
export const useUpdateUserData = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateUserData, { data: ControlTowerMeModels.UserUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerMe>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateUserData(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
export const useUpdateUserProfile = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateUserProfile, { data: ControlTowerMeModels.UserBasicUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerMe>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateUserProfile(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
export const useUpdatePassword = (options?: AppMutationOptions<typeof ControlTowerMeApi.updatePassword, { data: ControlTowerMeModels.UserPasswordUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerMe>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updatePassword(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
export const useUpdateEmailPreferences = (options?: AppMutationOptions<typeof ControlTowerMeApi.updateEmailPreferences, { data: ControlTowerMeModels.UserEmailPreferencesUpdateDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerMe>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerMeApi.updateEmailPreferences(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerMe>({ currentModule: moduleName });

  return useMutation({
    mutationFn: () => 
      ControlTowerMeApi.updateProjectAccess()
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
