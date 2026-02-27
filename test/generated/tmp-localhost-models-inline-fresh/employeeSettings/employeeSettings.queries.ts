import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeSettingsModels } from "./employeeSettings.models";

export namespace EmployeeSettingsQueries {
const getAll = () => {
  return AppRestClient.get(
    { resSchema: EmployeeSettingsModels.EmployeeSettingsResponseDtoSchema },
    `/employees/settings`,
    
  );
};

const update = (key: string, data: EmployeeSettingsModels.UpdateEmployeeSettingDto) => {
  return AppRestClient.patch(
    { resSchema: z.void() },
    `/employees/settings/${key}`,
    ZodExtended.parse(EmployeeSettingsModels.UpdateEmployeeSettingDtoSchema, data),
    
  );
};


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
export const useGetAll = <TData>(options?: AppQueryOptions<typeof getAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getAll(),
    queryFn: getAll,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
export const useUpdate = (options?: AppMutationOptions<typeof update, { key: string, data: EmployeeSettingsModels.UpdateEmployeeSettingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ key, data }) => 
      update(key, data)
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
