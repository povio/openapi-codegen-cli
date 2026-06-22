import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionsAcl } from "./positions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionsModels } from "./positions.models";
import { CommonModels } from "@/data/common/common.models";
import { PositionsApi } from "./positions.api";

export namespace PositionsQueries {
export const moduleName = QueryModule.Positions;

export const keys = {
    all: [moduleName] as const,
    findAll: (officeId: string, limit?: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/labels", officeId, limit, filter, page, cursor] as const,
    findAllInfinite: (officeId: string, limit?: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/labels", "infinite", officeId, limit, filter, cursor] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions", "infinite", officeId, limit, order, filter, cursor] as const,
    totalProfit: (officeId: string) => [...keys.all, "/offices/:officeId/positions/fake-total-profit", officeId] as const,
    listAvailablePartnersFor: (officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/positions/:positionId/available-partners", officeId, positionId, search, useCase] as const,
    get: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId", officeId, positionId] as const,
    listRouteLabels: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/routes/labels", officeId, positionId] as const,
    getDuplicateDefaultParameters: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/duplicate/default-parameters", officeId, positionId] as const,
    listChild: (officeId: string, positionId: string, limit?: number, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/children", officeId, positionId, limit, page, cursor] as const,
    listChildInfinite: (officeId: string, positionId: string, limit?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/children", "infinite", officeId, positionId, limit, cursor] as const,
};

export const findAllQueryOptions = ({ officeId, limit, filter, page, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.findAll(officeId, limit, filter, page, cursor),
  queryFn: () => PositionsApi.findAll(officeId, limit, filter, page, cursor),
});

/** 
 * Query `useFindAll`
 * @summary List all positions with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionsModels.PositionLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ officeId, limit, filter, page, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionsApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findAllQueryOptions({ officeId, limit, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseFindAll({ officeId } ));
      return findAllQueryOptions({ officeId, limit, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { officeId, limit, filter, page, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findAllQueryOptions({ officeId, limit, filter, page, cursor }), ...options });
};

export const findAllInfiniteQueryOptions = ({ officeId, limit, filter, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string }) => ({
  queryKey: keys.findAllInfinite(officeId, limit, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => PositionsApi.findAll(officeId, limit, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useFindAllInfinite
 * @summary List all positions with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionsModels.PositionLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.PositionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ officeId, limit, filter, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionsApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...findAllInfiniteQueryOptions({ officeId, limit, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(PositionsAcl.canUseFindAll({ officeId } ));
      return findAllInfiniteQueryOptions({ officeId, limit, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAllInfinite = (queryClient: QueryClient, { officeId, limit, filter, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...findAllInfiniteQueryOptions({ officeId, limit, filter, cursor }), ...options });
};

export const paginateQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
  queryFn: () => PositionsApi.paginate(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary List positions
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number`
 * @param { PositionsModels.PositionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUsePaginate({ officeId } ));
      return paginateQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => PositionsApi.paginate(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary List positions
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number`
 * @param { PositionsModels.PositionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.PositionsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(PositionsAcl.canUsePaginate({ officeId } ));
      return paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create position
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { PositionsModels.CreatePositionRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position created successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useCreate = (options?: AppMutationOptions<typeof PositionsApi.create, { officeId: string, data: PositionsModels.CreatePositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PositionsAcl.canUseCreate({ officeId } ));
      return PositionsApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const totalProfitQueryOptions = ({ officeId }: { officeId: string }) => ({
  queryKey: keys.totalProfit(officeId),
  queryFn: () => PositionsApi.totalProfit(officeId),
});

/** 
 * Query `useTotalProfit`
 * @summary List positions
 * @permission Requires `canUseTotalProfit` ability 
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.TotalProfitResponse> } 
 * @statusCodes [200, 401]
 */
export const useTotalProfit = <TData>({ officeId }: { officeId: string }, options?: AppQueryOptions<typeof PositionsApi.totalProfit, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...totalProfitQueryOptions({ officeId }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseTotalProfit({ officeId } ));
      return totalProfitQueryOptions({ officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchTotalProfit = (queryClient: QueryClient, { officeId }: { officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...totalProfitQueryOptions({ officeId }), ...options });
};

export const listAvailablePartnersForQueryOptions = ({ officeId, positionId, search, useCase }: { officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase }) => ({
  queryKey: keys.listAvailablePartnersFor(officeId, positionId, search, useCase),
  queryFn: () => PositionsApi.listAvailablePartnersFor(officeId, positionId, search, useCase),
});

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for a position
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } search Query parameter
 * @param { PositionsModels.PositionAvailablePartnersUseCase } useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, positionId, search, useCase }: { officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof PositionsApi.listAvailablePartnersFor, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listAvailablePartnersForQueryOptions({ officeId, positionId, search, useCase }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseListAvailablePartnersFor({ officeId } ));
      return listAvailablePartnersForQueryOptions({ officeId, positionId, search, useCase }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListAvailablePartnersFor = (queryClient: QueryClient, { officeId, positionId, search, useCase }: { officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listAvailablePartnersForQueryOptions({ officeId, positionId, search, useCase }), ...options });
};

/** 
 * Mutation `useExportPositions` - recommended when file should not be cached
 * @summary Export positions to Excel
 * @permission Requires `canUseExportPositions` ability 
 * @param { string } officeId Path parameter
 * @param { PositionsModels.PositionExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportPositions = (options?: AppMutationOptions<typeof PositionsApi.exportPositions, { officeId: string, data: PositionsModels.PositionExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PositionsAcl.canUseExportPositions({ officeId } ));
      return PositionsApi.exportPositions(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.get(officeId, positionId),
  queryFn: () => PositionsApi.get(officeId, positionId),
});

/** 
 * Query `useGet`
 * @summary Get position by ID
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionCoreResponseDto> } Position retrieved successfully
 * @statusCodes [200, 401, 403, 404]
 */
export const useGet = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionsApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseGet({ officeId } ));
      return getQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGet = (queryClient: QueryClient, { officeId, positionId }: { officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getQueryOptions({ officeId, positionId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update position
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.UpdatePositionDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position updated successfully
 * @statusCodes [200, 400, 401, 404]
 */
export const useUpdate = (options?: AppMutationOptions<typeof PositionsApi.update, { officeId: string, positionId: string, data: PositionsModels.UpdatePositionDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseUpdate({ officeId } ));
      return PositionsApi.update(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listRouteLabelsQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.listRouteLabels(officeId, positionId),
  queryFn: () => PositionsApi.listRouteLabels(officeId, positionId),
});

/** 
 * Query `useListRouteLabels`
 * @summary List all route labels for a position
 * @permission Requires `canUseListRouteLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.ListRouteLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRouteLabels = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionsApi.listRouteLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listRouteLabelsQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseListRouteLabels({ officeId } ));
      return listRouteLabelsQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListRouteLabels = (queryClient: QueryClient, { officeId, positionId }: { officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listRouteLabelsQueryOptions({ officeId, positionId }), ...options });
};

export const getDuplicateDefaultParametersQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.getDuplicateDefaultParameters(officeId, positionId),
  queryFn: () => PositionsApi.getDuplicateDefaultParameters(officeId, positionId),
});

/** 
 * Query `useGetDuplicateDefaultParameters`
 * @summary Get default duplication parameters for a position
 * @permission Requires `canUseGetDuplicateDefaultParameters` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.DuplicatePositionDefaultParametersResponseDto> } Default parameters and suggested estimated service date
 * @statusCodes [200, 401, 404]
 */
export const useGetDuplicateDefaultParameters = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionsApi.getDuplicateDefaultParameters, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getDuplicateDefaultParametersQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseGetDuplicateDefaultParameters({ officeId } ));
      return getDuplicateDefaultParametersQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetDuplicateDefaultParameters = (queryClient: QueryClient, { officeId, positionId }: { officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getDuplicateDefaultParametersQueryOptions({ officeId, positionId }), ...options });
};

/** 
 * Mutation `useDuplicate`
 * @summary Duplicate position
 * @permission Requires `canUseDuplicate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.DuplicatePositionRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position duplicated successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof PositionsApi.duplicate, { officeId: string, positionId: string, data: PositionsModels.DuplicatePositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseDuplicate({ officeId } ));
      return PositionsApi.duplicate(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCancel`
 * @summary Cancel position
 * @permission Requires `canUseCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position cancelled successfully
 * @statusCodes [200, 400, 401, 403, 404]
 */
export const useCancel = (options?: AppMutationOptions<typeof PositionsApi.cancel, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionsAcl.canUseCancel({ officeId } ));
      return PositionsApi.cancel(officeId, positionId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRevertCancel`
 * @summary Revert cancelled position (accounting)
 * @permission Requires `canUseRevertCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position reverted successfully
 * @statusCodes [200, 400, 401, 403, 404]
 */
export const useRevertCancel = (options?: AppMutationOptions<typeof PositionsApi.revertCancel, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionsAcl.canUseRevertCancel({ officeId } ));
      return PositionsApi.revertCancel(officeId, positionId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useLinkChild`
 * @summary Link child positions to parent
 * @permission Requires `canUseLinkChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.LinkChildPositionsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useLinkChild = (options?: AppMutationOptions<typeof PositionsApi.linkChild, { officeId: string, positionId: string, data: PositionsModels.LinkChildPositionsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseLinkChild({ officeId } ));
      return PositionsApi.linkChild(officeId, positionId, data)
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
 * Mutation `useUnlinkChild`
 * @summary Unlink child positions from parent
 * @permission Requires `canUseUnlinkChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.UnlinkChildPositionsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnlinkChild = (options?: AppMutationOptions<typeof PositionsApi.unlinkChild, { officeId: string, positionId: string, data: PositionsModels.UnlinkChildPositionsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Positions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseUnlinkChild({ officeId } ));
      return PositionsApi.unlinkChild(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listChildQueryOptions = ({ officeId, positionId, limit, page, cursor }: { officeId: string, positionId: string, limit: number, page?: number, cursor?: string }) => ({
  queryKey: keys.listChild(officeId, positionId, limit, page, cursor),
  queryFn: () => PositionsApi.listChild(officeId, positionId, limit, page, cursor),
});

/** 
 * Query `useListChild`
 * @summary Get child positions for parent
 * @permission Requires `canUseListChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.ListChildResponse> } 
 * @statusCodes [200, 401]
 */
export const useListChild = <TData>({ officeId, positionId, limit, page, cursor }: { officeId: string, positionId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionsApi.listChild, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listChildQueryOptions({ officeId, positionId, limit, page, cursor }),
    queryFn: async () => {
    checkAcl(PositionsAcl.canUseListChild({ officeId } ));
      return listChildQueryOptions({ officeId, positionId, limit, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListChild = (queryClient: QueryClient, { officeId, positionId, limit, page, cursor }: { officeId: string, positionId: string, limit: number, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listChildQueryOptions({ officeId, positionId, limit, page, cursor }), ...options });
};

export const listChildInfiniteQueryOptions = ({ officeId, positionId, limit, cursor }: { officeId: string, positionId: string, limit: number, cursor?: string }) => ({
  queryKey: keys.listChildInfinite(officeId, positionId, limit, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => PositionsApi.listChild(officeId, positionId, limit, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListChildInfinite
 * @summary Get child positions for parent
 * @permission Requires `canUseListChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.ListChildResponse> } 
 * @statusCodes [200, 401]
 */
export const useListChildInfinite = <TData>({ officeId, positionId, limit, cursor }: { officeId: string, positionId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionsApi.listChild, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listChildInfiniteQueryOptions({ officeId, positionId, limit, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(PositionsAcl.canUseListChild({ officeId } ));
      return listChildInfiniteQueryOptions({ officeId, positionId, limit, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListChildInfinite = (queryClient: QueryClient, { officeId, positionId, limit, cursor }: { officeId: string, positionId: string, limit: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listChildInfiniteQueryOptions({ officeId, positionId, limit, cursor }), ...options });
};

}
