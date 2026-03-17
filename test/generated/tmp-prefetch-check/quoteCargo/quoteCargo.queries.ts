import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteCargoAcl } from "./quoteCargo.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteCargoModels } from "./quoteCargo.models";
import { CommonModels } from "@/data/common/common.models";
import { QuoteCargoApi } from "./quoteCargo.api";

export namespace QuoteCargoQueries {
export const moduleName = QueryModule.QuoteCargo;

export const keys = {
    all: [moduleName] as const,
    listCargosByQuoteId: (officeId: string, quoteId: string, limit?: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos", officeId, quoteId, limit, order, page, cursor] as const,
    listCargosByQuoteIdInfinite: (officeId: string, quoteId: string, limit?: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos", "infinite", officeId, quoteId, limit, order, cursor] as const,
    listCargoLabels: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/labels", officeId, quoteId] as const,
    getCargoSummary: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/summary", officeId, quoteId] as const,
    getCargoById: (officeId: string, quoteId: string, cargoId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/:cargoId", officeId, quoteId, cargoId] as const,
};

export const getListCargosByQuoteIdQueryOptions = ({ officeId, quoteId, limit, order, page, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string }) => ({
  queryKey: keys.listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor),
  queryFn: () => QuoteCargoApi.listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor),
});

/** 
 * Query `useListCargosByQuoteId`
 * @summary List all cargo items for a quote
 * @permission Requires `canUseListCargosByQuoteId` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteId = <TData>({ officeId, quoteId, limit, order, page, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string }, options?: AppQueryOptions<typeof QuoteCargoApi.listCargosByQuoteId, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getListCargosByQuoteIdQueryOptions({ officeId, quoteId, limit, order, page, cursor }),
    queryFn: async () => {
    checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
      return getListCargosByQuoteIdQueryOptions({ officeId, quoteId, limit, order, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchListCargosByQuoteId = (queryClient: QueryClient, { officeId, quoteId, limit, order, page, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getListCargosByQuoteIdQueryOptions({ officeId, quoteId, limit, order, page, cursor }), ...options });
};

export const getListCargosByQuoteIdInfiniteQueryOptions = ({ officeId, quoteId, limit, order, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string }) => ({
  queryKey: keys.listCargosByQuoteIdInfinite(officeId, quoteId, limit, order, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => QuoteCargoApi.listCargosByQuoteId(officeId, quoteId, limit, order, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListCargosByQuoteIdInfinite
 * @summary List all cargo items for a quote
 * @permission Requires `canUseListCargosByQuoteId` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteIdInfinite = <TData>({ officeId, quoteId, limit, order, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string }, options?: AppInfiniteQueryOptions<typeof QuoteCargoApi.listCargosByQuoteId, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getListCargosByQuoteIdInfiniteQueryOptions({ officeId, quoteId, limit, order, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
      return getListCargosByQuoteIdInfiniteQueryOptions({ officeId, quoteId, limit, order, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListCargosByQuoteIdInfinite = (queryClient: QueryClient, { officeId, quoteId, limit, order, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getListCargosByQuoteIdInfiniteQueryOptions({ officeId, quoteId, limit, order, cursor }), ...options });
};

export const getListCargoLabelsQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.listCargoLabels(officeId, quoteId),
  queryFn: () => QuoteCargoApi.listCargoLabels(officeId, quoteId),
});

/** 
 * Query `useListCargoLabels`
 * @summary List all cargo labels for a quote
 * @permission Requires `canUseListCargoLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoListCargoLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargoLabels = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.listCargoLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getListCargoLabelsQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuoteCargoAcl.canUseListCargoLabels({ officeId } ));
      return getListCargoLabelsQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
  });
};

export const prefetchListCargoLabels = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getListCargoLabelsQueryOptions({ officeId, quoteId }), ...options });
};

export const getGetCargoSummaryQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.getCargoSummary(officeId, quoteId),
  queryFn: () => QuoteCargoApi.getCargoSummary(officeId, quoteId),
});

/** 
 * Query `useGetCargoSummary`
 * @summary Get cargo summary grouped by transport unit type
 * @permission Requires `canUseGetCargoSummary` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoGetCargoSummaryResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoSummary = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.getCargoSummary, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getGetCargoSummaryQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuoteCargoAcl.canUseGetCargoSummary({ officeId } ));
      return getGetCargoSummaryQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCargoSummary = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetCargoSummaryQueryOptions({ officeId, quoteId }), ...options });
};

export const getGetCargoByIdQueryOptions = ({ officeId, quoteId, cargoId }: { officeId: string, quoteId: string, cargoId: string }) => ({
  queryKey: keys.getCargoById(officeId, quoteId, cargoId),
  queryFn: () => QuoteCargoApi.getCargoById(officeId, quoteId, cargoId),
});

/** 
 * Query `useGetCargoById`
 * @summary Get a specific cargo item
 * @permission Requires `canUseGetCargoById` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoById = <TData>({ officeId, quoteId, cargoId }: { officeId: string, quoteId: string, cargoId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.getCargoById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getGetCargoByIdQueryOptions({ officeId, quoteId, cargoId }),
    queryFn: async () => {
    checkAcl(QuoteCargoAcl.canUseGetCargoById({ officeId } ));
      return getGetCargoByIdQueryOptions({ officeId, quoteId, cargoId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCargoById = (queryClient: QueryClient, { officeId, quoteId, cargoId }: { officeId: string, quoteId: string, cargoId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetCargoByIdQueryOptions({ officeId, quoteId, cargoId }), ...options });
};

/** 
 * Mutation `useUpdateCargo`
 * @summary Update a cargo item
 * @permission Requires `canUseUpdateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { QuoteCargoModels.UpdatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.updateCargo, { officeId: string, quoteId: string, cargoId: string, data: QuoteCargoModels.UpdatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseUpdateCargo({ officeId } ));
      return QuoteCargoApi.updateCargo(officeId, quoteId, cargoId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, quoteId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteCargo`
 * @summary Delete a cargo item
 * @permission Requires `canUseDeleteCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.deleteCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDeleteCargo({ officeId } ));
      return QuoteCargoApi.deleteCargo(officeId, quoteId, cargoId)
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
 * Mutation `useCreateBulkCargos`
 * @summary Create a new cargo item
 * @permission Requires `canUseCreateBulkCargos` ability 
 * @param { number } numberOfCargos Path parameter
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteCargoModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.QuoteCargoCreateBulkCargosResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateBulkCargos = (options?: AppMutationOptions<typeof QuoteCargoApi.createBulkCargos, { numberOfCargos: number, officeId: string, quoteId: string, data: QuoteCargoModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ numberOfCargos, officeId, quoteId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseCreateBulkCargos({ officeId } ));
      return QuoteCargoApi.createBulkCargos(numberOfCargos, officeId, quoteId, data)
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
 * Mutation `useDuplicateCargo`
 * @summary Duplicate a cargo item
 * @permission Requires `canUseDuplicateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.duplicateCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDuplicateCargo({ officeId } ));
      return QuoteCargoApi.duplicateCargo(officeId, quoteId, cargoId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, quoteId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
