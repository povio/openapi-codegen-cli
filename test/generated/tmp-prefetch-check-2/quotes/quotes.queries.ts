import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuotesAcl } from "./quotes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuotesModels } from "./quotes.models";
import { CommonModels } from "@/data/common/common.models";
import { QuotesApi } from "./quotes.api";

export namespace QuotesQueries {
export const moduleName = QueryModule.Quotes;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", "infinite", officeId, limit, order, filter, cursor] as const,
    listAvailablePartnersFor: (officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/quotes/:quoteId/available-partners", officeId, quoteId, search, useCase] as const,
    getById: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId", officeId, quoteId] as const,
    getInvolvedParties: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/involved-parties", officeId, quoteId] as const,
};

export const paginateQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
  queryFn: () => QuotesApi.paginate(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Quotes
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, statusDate, transportMode, status, direction, loadType, serviceType, createdAt, employee, profit. Example: `number`
 * @param { QuotesModels.QuoteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuotesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof QuotesApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
      return paginateQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => QuotesApi.paginate(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Quotes
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, statusDate, transportMode, status, direction, loadType, serviceType, createdAt, employee, profit. Example: `number`
 * @param { QuotesModels.QuoteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuotesModels.QuotesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof QuotesApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
      return paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create Quote
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { QuotesModels.CreateQuoteRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof QuotesApi.create, { officeId: string, data: QuotesModels.CreateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseCreate({ officeId } ));
      return QuotesApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listAvailablePartnersForQueryOptions = ({ officeId, quoteId, search, useCase }: { officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase }) => ({
  queryKey: keys.listAvailablePartnersFor(officeId, quoteId, search, useCase),
  queryFn: () => QuotesApi.listAvailablePartnersFor(officeId, quoteId, search, useCase),
});

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for a quote
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } search Query parameter
 * @param { QuotesModels.PositionAvailablePartnersUseCase } useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuotesListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, quoteId, search, useCase }: { officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof QuotesApi.listAvailablePartnersFor, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listAvailablePartnersForQueryOptions({ officeId, quoteId, search, useCase }),
    queryFn: async () => {
    checkAcl(QuotesAcl.canUseListAvailablePartnersFor({ officeId } ));
      return listAvailablePartnersForQueryOptions({ officeId, quoteId, search, useCase }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListAvailablePartnersFor = (queryClient: QueryClient, { officeId, quoteId, search, useCase }: { officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listAvailablePartnersForQueryOptions({ officeId, quoteId, search, useCase }), ...options });
};

/** 
 * Mutation `useExportQuotes` - recommended when file should not be cached
 * @summary Export quotes to Excel
 * @permission Requires `canUseExportQuotes` ability 
 * @param { string } officeId Path parameter
 * @param { QuotesModels.QuoteExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportQuotes = (options?: AppMutationOptions<typeof QuotesApi.exportQuotes, { officeId: string, data: QuotesModels.QuoteExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseExportQuotes({ officeId } ));
      return QuotesApi.exportQuotes(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getByIdQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.getById(officeId, quoteId),
  queryFn: () => QuotesApi.getById(officeId, quoteId),
});

/** 
 * Query `useGetById`
 * @summary Get quote by id
 * @permission Requires `canUseGetById` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuotesApi.getById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getByIdQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuotesAcl.canUseGetById({ officeId } ));
      return getByIdQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetById = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getByIdQueryOptions({ officeId, quoteId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update quote
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuotesModels.UpdateQuoteRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof QuotesApi.update, { officeId: string, quoteId: string, data: QuotesModels.UpdateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdate({ officeId } ));
      return QuotesApi.update(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId } = variables;
      const updateKeys = [keys.getById(officeId, quoteId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCancel`
 * @summary Cancel quote
 * @permission Requires `canUseCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useCancel = (options?: AppMutationOptions<typeof QuotesApi.cancel, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuotesAcl.canUseCancel({ officeId } ));
      return QuotesApi.cancel(officeId, quoteId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId } = variables;
      const updateKeys = [keys.getById(officeId, quoteId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDuplicate`
 * @summary Duplicate quote
 * @permission Requires `canUseDuplicate` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuotesModels.DuplicateQuoteRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof QuotesApi.duplicate, { officeId: string, quoteId: string, data: QuotesModels.DuplicateQuoteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseDuplicate({ officeId } ));
      return QuotesApi.duplicate(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId } = variables;
      const updateKeys = [keys.getById(officeId, quoteId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getInvolvedPartiesQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.getInvolvedParties(officeId, quoteId),
  queryFn: () => QuotesApi.getInvolvedParties(officeId, quoteId),
});

/** 
 * Query `useGetInvolvedParties`
 * @summary Get involved parties for quote
 * @permission Requires `canUseGetInvolvedParties` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.GetInvolvedPartiesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetInvolvedParties = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuotesApi.getInvolvedParties, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getInvolvedPartiesQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuotesAcl.canUseGetInvolvedParties({ officeId } ));
      return getInvolvedPartiesQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetInvolvedParties = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getInvolvedPartiesQueryOptions({ officeId, quoteId }), ...options });
};

/** 
 * Mutation `useCreateInvolvedParty`
 * @summary Create involved party for quote
 * @permission Requires `canUseCreateInvolvedParty` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuotesModels.CreateInvolvedPartyRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.InvolvedPartyResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.createInvolvedParty, { officeId: string, quoteId: string, data: QuotesModels.CreateInvolvedPartyRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseCreateInvolvedParty({ officeId } ));
      return QuotesApi.createInvolvedParty(officeId, quoteId, data)
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
 * Mutation `useUpdateInvolvedParty`
 * @summary Update involved party for quote
 * @permission Requires `canUseUpdateInvolvedParty` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } partyId Path parameter
 * @param { QuotesModels.UpdateInvolvedPartyDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.InvolvedPartyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.updateInvolvedParty, { officeId: string, quoteId: string, partyId: string, data: QuotesModels.UpdateInvolvedPartyDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdateInvolvedParty({ officeId } ));
      return QuotesApi.updateInvolvedParty(officeId, quoteId, partyId, data)
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
 * Mutation `useDeleteInvolvedParty`
 * @summary Delete involved party for quote
 * @permission Requires `canUseDeleteInvolvedParty` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } partyId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.deleteInvolvedParty, { officeId: string, quoteId: string, partyId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Quotes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId }) => { 
      checkAcl(QuotesAcl.canUseDeleteInvolvedParty({ officeId } ));
      return QuotesApi.deleteInvolvedParty(officeId, quoteId, partyId)
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
