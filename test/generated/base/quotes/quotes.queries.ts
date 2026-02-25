import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuotesAcl } from "./quotes.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuotesModels } from "./quotes.models";
import { CommonModels } from "@/data/common/common.models";
import { QuotesApi } from "./quotes.api";

export namespace QuotesQueries {
export const moduleName = QueryModule.Quotes;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", "infinite", officeId, limit, order, filter, cursor] as const,
    listAvailablePartnersFor: (officeId: string, quoteId: string, search?: string, useCase?: CommonModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/quotes/:quoteId/available-partners", officeId, quoteId, search, useCase] as const,
    getById: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId", officeId, quoteId] as const,
    getInvolvedParties: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/involved-parties", officeId, quoteId] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Quotes
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): number, statusDate, transportMode, status, direction, loadType, serviceType, createdAt, employee, profit. Example: `number`
 * @param { QuotesModels.QuoteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuotesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof QuotesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
    return QuotesApi.paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Quotes
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): number, statusDate, transportMode, status, direction, loadType, serviceType, createdAt, employee, profit. Example: `number`
 * @param { QuotesModels.QuoteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuotesModels.QuotesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof QuotesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
    return QuotesApi.paginate(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create Quote
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { QuotesModels.CreateQuoteRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof QuotesApi.create, { officeId: string, data: QuotesModels.CreateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseCreate({ officeId } ));
      return QuotesApi.create(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for a quote
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { string } object.search Query parameter
 * @param { CommonModels.PositionAvailablePartnersUseCase } object.useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuotesListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, quoteId, search, useCase }: { officeId: string, quoteId: string, search?: string, useCase?: CommonModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof QuotesApi.listAvailablePartnersFor, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listAvailablePartnersFor(officeId, quoteId, search, useCase),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseListAvailablePartnersFor({ officeId } ));
    return QuotesApi.listAvailablePartnersFor(officeId, quoteId, search, useCase) },
    ...options,
  });
};

/** 
 * Mutation `useExportQuotes` - recommended when file should not be cached
 * @summary Export quotes to Excel
 * @permission Requires `canUseExportQuotes` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { QuotesModels.QuoteExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportQuotes = (options?: AppMutationOptions<typeof QuotesApi.exportQuotes, { officeId: string, data: QuotesModels.QuoteExportRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseExportQuotes({ officeId } ));
      return QuotesApi.exportQuotes(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetById`
 * @summary Get quote by id
 * @permission Requires `canUseGetById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuotesApi.getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getById(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseGetById({ officeId } ));
    return QuotesApi.getById(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update quote
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuotesModels.UpdateQuoteRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof QuotesApi.update, { officeId: string, quoteId: string, data: QuotesModels.UpdateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdate({ officeId } ));
      return QuotesApi.update(officeId, quoteId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useCancel = (options?: AppMutationOptions<typeof QuotesApi.cancel, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuotesAcl.canUseCancel({ officeId } ));
      return QuotesApi.cancel(officeId, quoteId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuotesModels.DuplicateQuoteRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof QuotesApi.duplicate, { officeId: string, quoteId: string, data: QuotesModels.DuplicateQuoteRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseDuplicate({ officeId } ));
      return QuotesApi.duplicate(officeId, quoteId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId } = variables;
      const updateKeys = [keys.getById(officeId, quoteId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetInvolvedParties`
 * @summary Get involved parties for quote
 * @permission Requires `canUseGetInvolvedParties` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.GetInvolvedPartiesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetInvolvedParties = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuotesApi.getInvolvedParties, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getInvolvedParties(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseGetInvolvedParties({ officeId } ));
    return QuotesApi.getInvolvedParties(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateInvolvedParty`
 * @summary Create involved party for quote
 * @permission Requires `canUseCreateInvolvedParty` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { CommonModels.CreateInvolvedPartyRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.InvolvedPartyResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.createInvolvedParty, { officeId: string, quoteId: string, data: CommonModels.CreateInvolvedPartyRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseCreateInvolvedParty({ officeId } ));
      return QuotesApi.createInvolvedParty(officeId, quoteId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.partyId Path parameter
 * @param { CommonModels.UpdateInvolvedPartyDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.InvolvedPartyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.updateInvolvedParty, { officeId: string, quoteId: string, partyId: string, data: CommonModels.UpdateInvolvedPartyDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdateInvolvedParty({ officeId } ));
      return QuotesApi.updateInvolvedParty(officeId, quoteId, partyId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.partyId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteInvolvedParty = (options?: AppMutationOptions<typeof QuotesApi.deleteInvolvedParty, { officeId: string, quoteId: string, partyId: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId }) => { 
      checkAcl(QuotesAcl.canUseDeleteInvolvedParty({ officeId } ));
      return QuotesApi.deleteInvolvedParty(officeId, quoteId, partyId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
