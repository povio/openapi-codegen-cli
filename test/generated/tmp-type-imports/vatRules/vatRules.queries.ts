import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { VatRulesAcl } from "./vatRules.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { VatRulesModels } from "./vatRules.models";
import { VatRulesApi } from "./vatRules.api";

export namespace VatRulesQueries {
export const moduleName = QueryModule.VatRules;

export const keys = {
    all: [moduleName] as const,
    paginateLabels: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => [...keys.all, "/vat-rules/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string) => [...keys.all, "/vat-rules/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    list: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => [...keys.all, "/vat-rules", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string) => [...keys.all, "/vat-rules", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/vat-rules/:id", id] as const,
};

const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => VatRulesApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate VAT rule labels (id and matchcode only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof VatRulesApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(VatRulesAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => VatRulesApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate VAT rule labels (id and matchcode only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof VatRulesApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(VatRulesAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const listQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(limit, order, filter, page, cursor),
  queryFn: () => VatRulesApi.list(limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List VAT rules
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRulesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof VatRulesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(VatRulesAcl.canUseList());
      return listQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const listInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => VatRulesApi.list(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List VAT rules
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof VatRulesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(VatRulesAcl.canUseList());
      return listInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create a new VAT rule
 * @permission Requires `canUseCreate` ability 
 * @param { VatRulesModels.CreateVatRuleRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [201, 401, 409]
 */
export const useCreate = (options?: AppMutationOptions<typeof VatRulesApi.create, { data: VatRulesModels.CreateVatRuleRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.VatRules>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(VatRulesAcl.canUseCreate());
      return VatRulesApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const findByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.findById(id),
  queryFn: () => VatRulesApi.findById(id),
});

/** 
 * Query `useFindById`
 * @summary Get VAT rule by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof VatRulesApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(VatRulesAcl.canUseFindById());
      return findByIdQueryOptions({ id }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { id }: { id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByIdQueryOptions({ id }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update VAT rule by ID
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { VatRulesModels.UpdateVatRuleRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUpdate = (options?: AppMutationOptions<typeof VatRulesApi.update, { id: string, data: VatRulesModels.UpdateVatRuleRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.VatRules>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(VatRulesAcl.canUseUpdate());
      return VatRulesApi.update(id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive VAT rule
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useArchive = (options?: AppMutationOptions<typeof VatRulesApi.archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.VatRules>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(VatRulesAcl.canUseArchive());
      return VatRulesApi.archive(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive VAT rule
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof VatRulesApi.unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.VatRules>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(VatRulesAcl.canUseUnarchive());
      return VatRulesApi.unarchive(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
