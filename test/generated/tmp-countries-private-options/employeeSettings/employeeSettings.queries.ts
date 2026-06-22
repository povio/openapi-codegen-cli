import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeSettingsModels } from "./employeeSettings.models";
import { EmployeeSettingsApi } from "./employeeSettings.api";

export namespace EmployeeSettingsQueries {
export const moduleName = QueryModule.EmployeeSettings;

export const keys = {
    all: [moduleName] as const,
    getAll: () => [...keys.all, "/employees/settings", ] as const,
};

const getAllQueryOptions = () => ({
  queryKey: keys.getAll(),
  queryFn: () => EmployeeSettingsApi.getAll(),
});

/** 
 * Query `useGetAll`
 * @summary Get all employee settings
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeSettingsModels.EmployeeSettingsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetAll = <TData>(options?: AppQueryOptions<typeof EmployeeSettingsApi.getAll, TData>) => {
  
  return useQuery({
    ...getAllQueryOptions(),
    ...options,
  });
};

export const prefetchGetAll = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getAllQueryOptions(), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update employee setting
 * @param { string } key Path parameter
 * @param { EmployeeSettingsModels.UpdateEmployeeSettingDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmployeeSettingsApi.update, { key: string, data: EmployeeSettingsModels.UpdateEmployeeSettingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeSettings>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ key, data }) => 
      EmployeeSettingsApi.update(key, data)
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
