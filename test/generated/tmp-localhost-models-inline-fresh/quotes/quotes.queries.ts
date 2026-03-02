import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useInfiniteQuery, UseInfiniteQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuotesAcl } from "./quotes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuotesModels } from "./quotes.models";

export namespace QuotesQueries {
const paginate = (officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: QuotesModels.QuotesPaginateResponseSchema },
    `/offices/${officeId}/quotes`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(QuotesModels.QuotesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(QuotesModels.QuoteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: QuotesModels.CreateQuoteRequestDTO) => {
  return AppRestClient.post(
    { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
    `/offices/${officeId}/quotes`,
    ZodExtended.parse(QuotesModels.CreateQuoteRequestDTOSchema, data),
    
  );
};

const listAvailablePartnersFor = (officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase) => {
  return AppRestClient.get(
    { resSchema: QuotesModels.QuotesListAvailablePartnersForResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/available-partners`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        useCase: ZodExtended.parse(QuotesModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
      },
    }
  );
};

const exportQuotes = (officeId: string, data: QuotesModels.QuoteExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/quotes/exports`,
    ZodExtended.parse(QuotesModels.QuoteExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const getById = (officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}`,
    
  );
};

const update = (officeId: string, quoteId: string, data: QuotesModels.UpdateQuoteRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}`,
    ZodExtended.parse(QuotesModels.UpdateQuoteRequestDTOSchema, data),
    
  );
};

const cancel = (officeId: string, quoteId: string) => {
  return AppRestClient.post(
    { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}/cancel`,
    
  );
};

const duplicate = (officeId: string, quoteId: string, data: QuotesModels.DuplicateQuoteRequestDto) => {
  return AppRestClient.post(
    { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}/duplicate`,
    ZodExtended.parse(QuotesModels.DuplicateQuoteRequestDtoSchema, data),
    
  );
};

const getInvolvedParties = (officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuotesModels.GetInvolvedPartiesResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
    
  );
};

const createInvolvedParty = (officeId: string, quoteId: string, data: QuotesModels.CreateInvolvedPartyRequestDto) => {
  return AppRestClient.post(
    { resSchema: QuotesModels.InvolvedPartyResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
    ZodExtended.parse(QuotesModels.CreateInvolvedPartyRequestDtoSchema, data),
    
  );
};

const updateInvolvedParty = (officeId: string, quoteId: string, partyId: string, data: QuotesModels.UpdateInvolvedPartyDto) => {
  return AppRestClient.patch(
    { resSchema: QuotesModels.InvolvedPartyResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
    ZodExtended.parse(QuotesModels.UpdateInvolvedPartyDtoSchema, data),
    
  );
};

const deleteInvolvedParty = (officeId: string, quoteId: string, partyId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
    
  );
};


export const moduleName = QueryModule.Quotes;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/quotes", "infinite", officeId, limit, order, filter, cursor] as const,
    listAvailablePartnersFor: (officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/quotes/:quoteId/available-partners", officeId, quoteId, search, useCase] as const,
    getById: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId", officeId, quoteId] as const,
    getInvolvedParties: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/involved-parties", officeId, quoteId] as const,
};

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
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(QuotesAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, pageParam, cursor) },
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
 * @param { string } officeId Path parameter
 * @param { QuotesModels.CreateQuoteRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: QuotesModels.CreateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
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
export const useListAvailablePartnersFor = <TData>({ officeId, quoteId, search, useCase }: { officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof listAvailablePartnersFor, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listAvailablePartnersFor(officeId, quoteId, search, useCase),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseListAvailablePartnersFor({ officeId } ));
    return listAvailablePartnersFor(officeId, quoteId, search, useCase) },
    ...options,
  });
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
export const useExportQuotes = (options?: AppMutationOptions<typeof exportQuotes, { officeId: string, data: QuotesModels.QuoteExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(QuotesAcl.canUseExportQuotes({ officeId } ));
      return exportQuotes(officeId, data)
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
 * Query `useGetById`
 * @summary Get quote by id
 * @permission Requires `canUseGetById` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.QuoteCoreResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getById(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseGetById({ officeId } ));
    return getById(officeId, quoteId) },
    ...options,
  });
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
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, quoteId: string, data: QuotesModels.UpdateQuoteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdate({ officeId } ));
      return update(officeId, quoteId, data)
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
export const useCancel = (options?: AppMutationOptions<typeof cancel, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuotesAcl.canUseCancel({ officeId } ));
      return cancel(officeId, quoteId)
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
export const useDuplicate = (options?: AppMutationOptions<typeof duplicate, { officeId: string, quoteId: string, data: QuotesModels.DuplicateQuoteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseDuplicate({ officeId } ));
      return duplicate(officeId, quoteId, data)
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
 * Query `useGetInvolvedParties`
 * @summary Get involved parties for quote
 * @permission Requires `canUseGetInvolvedParties` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuotesModels.GetInvolvedPartiesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetInvolvedParties = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof getInvolvedParties, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getInvolvedParties(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuotesAcl.canUseGetInvolvedParties({ officeId } ));
    return getInvolvedParties(officeId, quoteId) },
    ...options,
  });
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
export const useCreateInvolvedParty = (options?: AppMutationOptions<typeof createInvolvedParty, { officeId: string, quoteId: string, data: QuotesModels.CreateInvolvedPartyRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuotesAcl.canUseCreateInvolvedParty({ officeId } ));
      return createInvolvedParty(officeId, quoteId, data)
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
export const useUpdateInvolvedParty = (options?: AppMutationOptions<typeof updateInvolvedParty, { officeId: string, quoteId: string, partyId: string, data: QuotesModels.UpdateInvolvedPartyDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId, data }) => { 
      checkAcl(QuotesAcl.canUseUpdateInvolvedParty({ officeId } ));
      return updateInvolvedParty(officeId, quoteId, partyId, data)
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
export const useDeleteInvolvedParty = (options?: AppMutationOptions<typeof deleteInvolvedParty, { officeId: string, quoteId: string, partyId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, partyId }) => { 
      checkAcl(QuotesAcl.canUseDeleteInvolvedParty({ officeId } ));
      return deleteInvolvedParty(officeId, quoteId, partyId)
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
