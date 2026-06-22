import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DepotsAcl } from "./depots.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DepotsModels } from "./depots.models";
import { DepotsApi } from "./depots.api";

export namespace DepotsQueries {
export const moduleName = QueryModule.Depots;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/depots", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, cursor?: string) => [...keys.all, "/depots", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/depots/paginate/labels", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, cursor?: string) => [...keys.all, "/depots/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/depots/:id", id] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a new depot
 * @permission Requires `canUseCreate` ability 
 * @param { DepotsModels.CreateDepotRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DepotsModels.DepotResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof DepotsApi.create, { data: DepotsModels.CreateDepotRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Depots>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(DepotsAcl.canUseCreate());
      return DepotsApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const paginateQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, filter, page, cursor),
  queryFn: () => DepotsApi.paginate(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Depots
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DepotsModels.DepotPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DepotsModels.DepotsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DepotsApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DepotsAcl.canUsePaginate());
      return paginateQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DepotsApi.paginate(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Depots
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DepotsModels.DepotPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DepotsModels.DepotsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DepotsApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DepotsAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => DepotsApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate depots with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DepotsModels.DepotLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DepotsModels.DepotsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DepotsApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DepotsAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DepotsApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate depots with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DepotsModels.DepotLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DepotsModels.DepotsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DepotsApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DepotsAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const findByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.findById(id),
  queryFn: () => DepotsApi.findById(id),
});

/** 
 * Query `useFindById`
 * @summary Fetch depot by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DepotsModels.DepotResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof DepotsApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(DepotsAcl.canUseFindById());
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
 * @summary Update a depot
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { DepotsModels.UpdateDepotRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DepotsModels.DepotResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof DepotsApi.update, { id: string, data: DepotsModels.UpdateDepotRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Depots>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(DepotsAcl.canUseUpdate());
      return DepotsApi.update(id, data)
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
 * @summary Archive a depot
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof DepotsApi.archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Depots>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(DepotsAcl.canUseArchive());
      return DepotsApi.archive(id)
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
 * Mutation `useUnarchive`
 * @summary Unarchive a depot
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof DepotsApi.unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Depots>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(DepotsAcl.canUseUnarchive());
      return DepotsApi.unarchive(id)
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
