import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { CustomerAccountApi } from "./customerAccount.api";

export namespace CustomerAccountQueries {
export const moduleName = QueryModule.CustomerAccount;

export const keys = {
    all: [moduleName] as const,
    get: () => [...keys.all, "/customers/account", ] as const,
};

const getQueryOptions = () => ({
  queryKey: keys.get(),
  queryFn: () => CustomerAccountApi.get(),
});

/** 
 * Query `useGet`
 * @summary Get profile of logged-in user
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomerAccountModels.CustomerAccountDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>(options?: AppQueryOptions<typeof CustomerAccountApi.get, TData>) => {
  
  return useQuery({
    ...getQueryOptions(),
    ...options,
  });
};

export const prefetchGet = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getQueryOptions(), ...options });
};

}
