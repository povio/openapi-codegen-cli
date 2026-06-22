import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { EmployeeAccountApi } from "./employeeAccount.api";

export namespace EmployeeAccountQueries {
export const moduleName = QueryModule.EmployeeAccount;

export const keys = {
    all: [moduleName] as const,
    get: () => [...keys.all, "/employees/account", ] as const,
};

/** 
 * Query `useGet`
 * @summary Get profile of logged-in user
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeAccountModels.EmployeeAccountDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>(options?: AppQueryOptions<typeof EmployeeAccountApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.get(),
    queryFn: EmployeeAccountApi.get,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
