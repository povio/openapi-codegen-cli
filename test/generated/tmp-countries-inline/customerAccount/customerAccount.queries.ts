import { AppRestClient } from "@/data/app-rest-client";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { CustomerAccountModels } from "./customerAccount.models";

export namespace CustomerAccountQueries {
const get = () => {
  return AppRestClient.get(
    { resSchema: CustomerAccountModels.CustomerAccountDtoSchema },
    `/customers/account`,
    
  );
};


export const moduleName = QueryModule.CustomerAccount;

export const keys = {
    all: [moduleName] as const,
    get: () => [...keys.all, "/customers/account", ] as const,
};

export const getQueryOptions = () => ({
  queryKey: keys.get(),
  queryFn: () => get(),
});

/** 
 * Query `useGet`
 * @summary Get profile of logged-in user
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomerAccountModels.CustomerAccountDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>(options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...getQueryOptions(),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGet = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getQueryOptions(), ...options });
};

}
