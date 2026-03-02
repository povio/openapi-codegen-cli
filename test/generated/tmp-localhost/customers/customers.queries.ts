import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
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
    queryKey: keys.findProfile(),
    queryFn: CustomersApi.findProfile,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create new customer
 * @permission Requires `canUseCreate` ability 
 * @param { CustomersModels.CreateCustomerDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof CustomersApi.create, { data: CustomersModels.CreateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useList`
 * @summary List customers
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, createdAt. Example: `firstName`
 * @param { CustomersModels.CustomerPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomersListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CustomersApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CustomersAcl.canUseList());
    return CustomersApi.list(limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List customers
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, createdAt. Example: `firstName`
 * @param { CustomersModels.CustomerPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CustomersModels.CustomersListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CustomersApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CustomersAcl.canUseList());
    return CustomersApi.list(limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useFindById`
 * @summary Get customer by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.customerId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ customerId }: { customerId: string }, options?: AppQueryOptions<typeof CustomersApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(customerId),
    queryFn: () => { 
    checkAcl(CustomersAcl.canUseFindById());
    return CustomersApi.findById(customerId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update customer
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.customerId Path parameter
 * @param { CustomersModels.UpdateCustomerDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof CustomersApi.update, { customerId: string, data: CustomersModels.UpdateCustomerDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useDeactivate = (options?: AppMutationOptions<typeof CustomersApi.deactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CustomersModels.CustomerResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useReactivate = (options?: AppMutationOptions<typeof CustomersApi.reactivate, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
