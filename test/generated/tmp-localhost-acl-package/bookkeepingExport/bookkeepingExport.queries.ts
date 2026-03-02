import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BookkeepingExportAcl } from "./bookkeepingExport.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BookkeepingExportModels } from "./bookkeepingExport.models";

export namespace BookkeepingExportQueries {
const createBatch = (officeId: string, data: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDto) => {
  return AppRestClient.post(
    { resSchema: BookkeepingExportModels.CreateBookkeepingExportBatchResponseDtoSchema },
    `/offices/${officeId}/bookkeeping-exports`,
    ZodExtended.parse(BookkeepingExportModels.CreateBookkeepingExportBatchRequestDtoSchema, data),
    
  );
};

const paginateBatches = (officeId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BookkeepingExportModels.PaginateBatchesResponseSchema },
    `/offices/${officeId}/bookkeeping-exports`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const getBatch = (officeId: string, batchId: string) => {
  return AppRestClient.get(
    { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
    `/offices/${officeId}/bookkeeping-exports/${batchId}`,
    
  );
};

const updateBatchFormat = (officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDto) => {
  return AppRestClient.patch(
    { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
    `/offices/${officeId}/bookkeeping-exports/${batchId}`,
    ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDtoSchema, data),
    
  );
};

const updateBatchItem = (officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDto) => {
  return AppRestClient.patch(
    { resSchema: z.void() },
    `/offices/${officeId}/bookkeeping-exports/${batchId}/items`,
    ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDtoSchema, data),
    
  );
};

const paginateBatchItems = (officeId: string, batchId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BookkeepingExportModels.PaginateBatchItemsResponseSchema },
    `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/items`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchItemsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BookkeepingExportModels.BookkeepingExportItemDetailFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const validateBookkeepingBatch = (officeId: string, batchId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/bookkeeping-exports/${batchId}/validate`,
    
  );
};

const exportBookkeepingBatch = (officeId: string, batchId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/bookkeeping-exports/${batchId}/export`,
    
  );
};

const revertBookkeepingBatch = (officeId: string, batchId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/bookkeeping-exports/${batchId}/revert`,
    
  );
};

const getVatLineItems = (officeId: string, batchId: string, order?: string) => {
  return AppRestClient.get(
    { resSchema: BookkeepingExportModels.GetVatLineItemsResponseSchema },
    `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/vat-line-items`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.GetVatLineItemsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
      },
    }
  );
};


export const moduleName = QueryModule.BookkeepingExport;

export const keys = {
    all: [moduleName] as const,
    paginateBatches: (officeId: string, limit?: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports", officeId, limit, order, filter, page, cursor] as const,
    paginateBatchesInfinite: (officeId: string, limit?: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports", "infinite", officeId, limit, order, filter, cursor] as const,
    getBatch: (officeId: string, batchId: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports/:batchId", officeId, batchId] as const,
    paginateBatchItems: (officeId: string, batchId: string, limit?: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports/batches/:batchId/items", officeId, batchId, limit, order, filter, page, cursor] as const,
    paginateBatchItemsInfinite: (officeId: string, batchId: string, limit?: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports/batches/:batchId/items", "infinite", officeId, batchId, limit, order, filter, cursor] as const,
    getVatLineItems: (officeId: string, batchId: string, order?: string) => [...keys.all, "/offices/:officeId/bookkeeping-exports/batches/:batchId/vat-line-items", officeId, batchId, order] as const,
};

/** 
 * Mutation `useCreateBatch`
 * @summary Create bookkeeping export batch
 * @permission Requires `canUseCreateBatch` ability 
 * @param { string } officeId Path parameter
 * @param { BookkeepingExportModels.CreateBookkeepingExportBatchRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BookkeepingExportModels.CreateBookkeepingExportBatchResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateBatch = (options?: AppMutationOptions<typeof createBatch, { officeId: string, data: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(BookkeepingExportAcl.canUseCreateBatch({ officeId } ));
      return createBatch(officeId, data)
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
 * Query `usePaginateBatches`
 * @summary List bookkeeping export batches
 * @permission Requires `canUsePaginateBatches` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, format, totalInvoiceCount. Example: `createdAt`
 * @param { BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BookkeepingExportModels.PaginateBatchesResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateBatches = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateBatches, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateBatches(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BookkeepingExportAcl.canUsePaginateBatches({ officeId } ));
    return paginateBatches(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateBatchesInfinite
 * @summary List bookkeeping export batches
 * @permission Requires `canUsePaginateBatches` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, format, totalInvoiceCount. Example: `createdAt`
 * @param { BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BookkeepingExportModels.PaginateBatchesResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateBatchesInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateBatches, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateBatchesInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BookkeepingExportAcl.canUsePaginateBatches({ officeId } ));
    return paginateBatches(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useGetBatch`
 * @summary Get bookkeeping export batch details
 * @permission Requires `canUseGetBatch` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BookkeepingExportModels.BookkeepingExportBatchDetailsDto> } 
 * @statusCodes [200, 401]
 */
export const useGetBatch = <TData>({ officeId, batchId }: { officeId: string, batchId: string }, options?: AppQueryOptions<typeof getBatch, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBatch(officeId, batchId),
    queryFn: () => { 
    checkAcl(BookkeepingExportAcl.canUseGetBatch({ officeId } ));
    return getBatch(officeId, batchId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateBatchFormat`
 * @summary Update bookkeeping export batch format
 * @permission Requires `canUseUpdateBatchFormat` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BookkeepingExportModels.BookkeepingExportBatchDetailsDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBatchFormat = (options?: AppMutationOptions<typeof updateBatchFormat, { officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId, data }) => { 
      checkAcl(BookkeepingExportAcl.canUseUpdateBatchFormat({ officeId } ));
      return updateBatchFormat(officeId, batchId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, batchId } = variables;
      const updateKeys = [keys.getBatch(officeId, batchId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateBatchItem`
 * @summary Update bookkeeping export batch item inclusion
 * @permission Requires `canUseUpdateBatchItem` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBatchItem = (options?: AppMutationOptions<typeof updateBatchItem, { officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId, data }) => { 
      checkAcl(BookkeepingExportAcl.canUseUpdateBatchItem({ officeId } ));
      return updateBatchItem(officeId, batchId, data)
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
 * Query `usePaginateBatchItems`
 * @summary List batch items with filters and pagination
 * @permission Requires `canUsePaginateBatchItems` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): issuingDate. Example: `issuingDate`
 * @param { BookkeepingExportModels.BookkeepingExportItemDetailFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BookkeepingExportModels.PaginateBatchItemsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateBatchItems = <TData>({ officeId, batchId, limit, order, filter, page, cursor }: { officeId: string, batchId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateBatchItems, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateBatchItems(officeId, batchId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BookkeepingExportAcl.canUsePaginateBatchItems({ officeId } ));
    return paginateBatchItems(officeId, batchId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateBatchItemsInfinite
 * @summary List batch items with filters and pagination
 * @permission Requires `canUsePaginateBatchItems` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): issuingDate. Example: `issuingDate`
 * @param { BookkeepingExportModels.BookkeepingExportItemDetailFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BookkeepingExportModels.PaginateBatchItemsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateBatchItemsInfinite = <TData>({ officeId, batchId, limit, order, filter, cursor }: { officeId: string, batchId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateBatchItems, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateBatchItemsInfinite(officeId, batchId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BookkeepingExportAcl.canUsePaginateBatchItems({ officeId } ));
    return paginateBatchItems(officeId, batchId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useValidateBookkeepingBatch`
 * @summary Validate bookkeeping batch
 * @permission Requires `canUseValidateBookkeepingBatch` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useValidateBookkeepingBatch = (options?: AppMutationOptions<typeof validateBookkeepingBatch, { officeId: string, batchId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId }) => { 
      checkAcl(BookkeepingExportAcl.canUseValidateBookkeepingBatch({ officeId } ));
      return validateBookkeepingBatch(officeId, batchId)
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
 * Mutation `useExportBookkeepingBatch`
 * @summary Export bookkeeping batch
 * @permission Requires `canUseExportBookkeepingBatch` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useExportBookkeepingBatch = (options?: AppMutationOptions<typeof exportBookkeepingBatch, { officeId: string, batchId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId }) => { 
      checkAcl(BookkeepingExportAcl.canUseExportBookkeepingBatch({ officeId } ));
      return exportBookkeepingBatch(officeId, batchId)
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
 * Mutation `useRevertBookkeepingBatch`
 * @summary Revert bookkeeping export batch
 * @permission Requires `canUseRevertBookkeepingBatch` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useRevertBookkeepingBatch = (options?: AppMutationOptions<typeof revertBookkeepingBatch, { officeId: string, batchId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId }) => { 
      checkAcl(BookkeepingExportAcl.canUseRevertBookkeepingBatch({ officeId } ));
      return revertBookkeepingBatch(officeId, batchId)
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
 * Query `useGetVatLineItems`
 * @summary Get VAT line items for bookkeeping export batch
 * @permission Requires `canUseGetVatLineItems` ability 
 * @param { string } officeId Path parameter
 * @param { string } batchId Path parameter
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): account, contraAccount, issuingDate, invoiceNumber, receiver. Example: `account`
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BookkeepingExportModels.GetVatLineItemsResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetVatLineItems = <TData>({ officeId, batchId, order }: { officeId: string, batchId: string, order?: string }, options?: AppQueryOptions<typeof getVatLineItems, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getVatLineItems(officeId, batchId, order),
    queryFn: () => { 
    checkAcl(BookkeepingExportAcl.canUseGetVatLineItems({ officeId } ));
    return getVatLineItems(officeId, batchId, order) },
    ...options,
  });
};

}
