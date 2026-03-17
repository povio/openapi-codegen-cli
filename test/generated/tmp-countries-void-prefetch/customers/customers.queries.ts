import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { CustomersAcl } from "./customers.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CustomersModels } from "./customers.models";
import { CustomersApi } from "./customers.api";

export namespace CustomersQueries {
export const moduleName = QueryModule.Customers;

export const keys = {
    all: [moduleName] as const,
    findProfile: () => [...keys.all, "/customers/me", ] as const,
    list: (limit?: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/customers", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string) => [...keys.all, "/customers", "infinite", limit, order, filter, cursor] as const,
    findById: (customerId: string) => [...keys.all, "/customers/:customerId", customerId] as const,
};

export const findProfileQueryOptions = () => ({
  queryKey: keys.findProfile(),
  queryFn: () => CustomersApi.findProfile(),
});

/** 
 * Query `useFindProfile`
 * @summary Get customer by id
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomerProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindProfile = <TData>(options?: AppQueryOptions<typeof CustomersApi.findProfile, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...findProfileQueryOptions(),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfile = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findProfileQueryOptions(), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create new customer
 * @permission Requires `canUseCreate` ability 
 * @param { CustomersModels.CreateCustomerDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof CustomersApi.create, { data: CustomersModels.CreateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CustomersAcl.canUseCreate());
      return CustomersApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(limit, order, filter, page, cursor),
  queryFn: () => CustomersApi.list(limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List customers
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, createdAt. Example: `firstName`
 * @param { CustomersModels.CustomerPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomersListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CustomersApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CustomersAcl.canUseList());
      return listQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CustomersApi.list(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List customers
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, createdAt. Example: `firstName`
 * @param { CustomersModels.CustomerPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CustomersModels.CustomersListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CustomersApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CustomersAcl.canUseList());
      return listInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

export const findByIdQueryOptions = ({ customerId }: { customerId: string }) => ({
  queryKey: keys.findById(customerId),
  queryFn: () => CustomersApi.findById(customerId),
});

/** 
 * Query `useFindById`
 * @summary Get customer by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } customerId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ customerId }: { customerId: string }, options?: AppQueryOptions<typeof CustomersApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ customerId }),
    queryFn: async () => {
    checkAcl(CustomersAcl.canUseFindById());
      return findByIdQueryOptions({ customerId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { customerId }: { customerId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByIdQueryOptions({ customerId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update customer
 * @permission Requires `canUseUpdate` ability 
 * @param { string } customerId Path parameter
 * @param { CustomersModels.UpdateCustomerDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof CustomersApi.update, { customerId: string, data: CustomersModels.UpdateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ customerId, data }) => { 
      checkAcl(CustomersAcl.canUseUpdate());
      return CustomersApi.update(customerId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { customerId } = variables;
      const updateKeys = [keys.findById(customerId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeactivate`
 * @summary Deactivate customer
 * @permission Requires `canUseDeactivate` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useDeactivate = (options?: AppMutationOptions<typeof CustomersApi.deactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CustomersAcl.canUseDeactivate());
      return CustomersApi.deactivate(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useReactivate`
 * @summary Reactivate customer
 * @permission Requires `canUseReactivate` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useReactivate = (options?: AppMutationOptions<typeof CustomersApi.reactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CustomersAcl.canUseReactivate());
      return CustomersApi.reactivate(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
