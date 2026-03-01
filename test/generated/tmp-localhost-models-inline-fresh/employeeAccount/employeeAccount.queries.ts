import { AppRestClient } from "@/data/app-rest-client";
import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { EmployeeAccountModels } from "./employeeAccount.models";

export namespace EmployeeAccountQueries {
const get = () => {
  return AppRestClient.get(
    { resSchema: EmployeeAccountModels.EmployeeAccountDtoSchema },
    `/employees/account`,
    
  );
};


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
export const useGet = <TData>(options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.get(),
    queryFn: get,
    ...options,
  });
};

}
