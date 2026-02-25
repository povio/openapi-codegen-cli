import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeSettingsModels } from "./employeeSettings.models";
import { EmployeeSettingsApi } from "./employeeSettings.api";

export namespace EmployeeSettingsQueries {
export const moduleName = QueryModule.EmployeeSettings;

export const keys = {
    all: [moduleName] as const,
    getAll: () => [...keys.all, "/employees/settings", ] as const,
};

/** 
 * Query `useGetAll`
 * @summary Get all employee settings
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeSettingsModels.EmployeeSettingsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetAll = <TData>(options?: AppQueryOptions<typeof EmployeeSettingsApi.getAll, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.getAll(),
    queryFn: () => 
    EmployeeSettingsApi.getAll(config),
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update employee setting
 * @param { string } mutation.key Path parameter
 * @param { EmployeeSettingsModels.UpdateEmployeeSettingDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmployeeSettingsApi.update, { key: string, data: EmployeeSettingsModels.UpdateEmployeeSettingDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ key, data }) => 
      EmployeeSettingsApi.update(key, data, config)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
