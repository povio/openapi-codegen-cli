import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { AirportsAcl } from "./airports.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { AirportsModels } from "./airports.models";
import { AirportsApi } from "./airports.api";

export namespace AirportsQueries {
export const moduleName = QueryModule.Airports;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/airports", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, cursor?: string) => [...keys.all, "/airports", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/airports/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, cursor?: string) => [...keys.all, "/airports/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/airports/:id", id] as const,
};

const paginateQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, filter, page, cursor),
  queryFn: () => AirportsApi.paginate(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Airports
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, iataCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { AirportsModels.AirportPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AirportsModels.AirportsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof AirportsApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(AirportsAcl.canUsePaginate());
      return paginateQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => AirportsApi.paginate(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Airports
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, iataCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { AirportsModels.AirportPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<AirportsModels.AirportsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof AirportsApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(AirportsAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create airport
 * @permission Requires `canUseCreate` ability 
 * @param { AirportsModels.CreateAirportRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AirportsModels.AirportResponseDTO> } 
 * @statusCodes [200, 201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof AirportsApi.create, { data: AirportsModels.CreateAirportRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Airports>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(AirportsAcl.canUseCreate());
      return AirportsApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => AirportsApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate airports with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, iataCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { AirportsModels.AirportLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AirportsModels.AirportsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof AirportsApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(AirportsAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => AirportsApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate airports with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, iataCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { AirportsModels.AirportLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<AirportsModels.AirportsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof AirportsApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(AirportsAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update airport
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { AirportsModels.UpdateAirportRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AirportsModels.AirportResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof AirportsApi.update, { id: string, data: AirportsModels.UpdateAirportRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Airports>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(AirportsAcl.canUseUpdate());
      return AirportsApi.update(id, data)
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

const findByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.findById(id),
  queryFn: () => AirportsApi.findById(id),
});

/** 
 * Query `useFindById`
 * @summary Get airport
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AirportsModels.AirportResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof AirportsApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(AirportsAcl.canUseFindById());
      return findByIdQueryOptions({ id }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { id }: { id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByIdQueryOptions({ id }), ...options });
};

}
