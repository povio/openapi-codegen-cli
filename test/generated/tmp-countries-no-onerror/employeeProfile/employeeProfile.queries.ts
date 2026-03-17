import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeProfileModels } from "./employeeProfile.models";
import { EmployeeProfileApi } from "./employeeProfile.api";

export namespace EmployeeProfileQueries {
export const moduleName = QueryModule.EmployeeProfile;

export const keys = {
    all: [moduleName] as const,
    getProfile: () => [...keys.all, "/employee-profile", ] as const,
};

export const getProfileQueryOptions = () => ({
  queryKey: keys.getProfile(),
  queryFn: () => EmployeeProfileApi.getProfile(),
});

/** 
 * Query `useGetProfile`
 * @summary Get employee profile
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeProfileModels.EmployeeProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetProfile = <TData>(options?: AppQueryOptions<typeof EmployeeProfileApi.getProfile, TData>) => {
  
  return useQuery({
    ...getProfileQueryOptions(),
    ...options,
  });
};

export const prefetchGetProfile = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getProfileQueryOptions(), ...options });
};

/** 
 * Mutation `useUpdateProfile`
 * @summary Update employee profile
 * @param { EmployeeProfileModels.UpdateEmployeeProfileRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeProfileModels.EmployeeProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateProfile = (options?: AppMutationOptions<typeof EmployeeProfileApi.updateProfile, { data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeProfile>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      EmployeeProfileApi.updateProfile(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const updateKeys = [keys.getProfile()];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
