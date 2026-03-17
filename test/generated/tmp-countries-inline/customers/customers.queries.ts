import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { CustomersAcl } from "./customers.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CustomersModels } from "./customers.models";

export namespace CustomersQueries {
const findProfile = () => {
  return AppRestClient.get(
    { resSchema: CustomersModels.CustomerProfileResponseDTOSchema },
    `/customers/me`,
    
  );
};

const create = (data: CustomersModels.CreateCustomerDTO) => {
  return AppRestClient.post(
    { resSchema: CustomersModels.CustomerResponseDTOSchema },
    `/customers`,
    ZodExtended.parse(CustomersModels.CreateCustomerDTOSchema, data),
    
  );
};

const list = (limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CustomersModels.CustomersListResponseSchema },
    `/customers`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CustomersModels.CustomersListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CustomersModels.CustomerPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (customerId: string) => {
  return AppRestClient.get(
    { resSchema: CustomersModels.CustomerResponseDTOSchema },
    `/customers/${customerId}`,
    
  );
};

const update = (customerId: string, data: CustomersModels.UpdateCustomerDTO) => {
  return AppRestClient.put(
    { resSchema: CustomersModels.CustomerResponseDTOSchema },
    `/customers/${customerId}`,
    ZodExtended.parse(CustomersModels.UpdateCustomerDTOSchema, data),
    
  );
};

const deactivate = (id: string) => {
  return AppRestClient.post(
    { resSchema: CustomersModels.CustomerResponseDTOSchema },
    `/customers/${id}/deactivate`,
    
  );
};

const reactivate = (id: string) => {
  return AppRestClient.post(
    { resSchema: CustomersModels.CustomerResponseDTOSchema },
    `/customers/${id}/reactivate`,
    
  );
};


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
  queryFn: () => findProfile(),
});

/** 
 * Query `useFindProfile`
 * @summary Get customer by id
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomerProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindProfile = <TData>(options?: AppQueryOptions<typeof findProfile, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...findProfileQueryOptions(),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfile = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findProfileQueryOptions(), ...options });
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
export const useCreate = (options?: AppMutationOptions<typeof create, { data: CustomersModels.CreateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CustomersAcl.canUseCreate());
      return create(data)
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
  queryFn: () => list(limit, order, filter, page, cursor),
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
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
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

export const prefetchList = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => list(limit, order, filter, pageParam, cursor),
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
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
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

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

export const findByIdQueryOptions = ({ customerId }: { customerId: string }) => ({
  queryKey: keys.findById(customerId),
  queryFn: () => findById(customerId),
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
export const useFindById = <TData>({ customerId }: { customerId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
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

export const prefetchFindById = (queryClient: QueryClient, { customerId }: { customerId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findByIdQueryOptions({ customerId }), ...options });
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
export const useUpdate = (options?: AppMutationOptions<typeof update, { customerId: string, data: CustomersModels.UpdateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ customerId, data }) => { 
      checkAcl(CustomersAcl.canUseUpdate());
      return update(customerId, data)
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
export const useDeactivate = (options?: AppMutationOptions<typeof deactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CustomersAcl.canUseDeactivate());
      return deactivate(id)
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
export const useReactivate = (options?: AppMutationOptions<typeof reactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Customers>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CustomersAcl.canUseReactivate());
      return reactivate(id)
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
