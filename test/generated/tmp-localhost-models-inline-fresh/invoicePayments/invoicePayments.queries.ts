import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InvoicePaymentsAcl } from "./invoicePayments.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InvoicePaymentsModels } from "./invoicePayments.models";

export namespace InvoicePaymentsQueries {
const listOfficePayments = (officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicePaymentsModels.ListOfficePaymentsResponseSchema },
    `/offices/${officeId}/payments`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(InvoicePaymentsModels.ListOfficePaymentsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const bulkCreatePayments = (officeId: string, data: InvoicePaymentsModels.BulkCreatePaymentsRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicePaymentsModels.BulkCreatePaymentsResponseDtoSchema },
    `/offices/${officeId}/payments`,
    ZodExtended.parse(InvoicePaymentsModels.BulkCreatePaymentsRequestDtoSchema, data),
    
  );
};

const calculatePayments = (officeId: string, data: InvoicePaymentsModels.CalculatePaymentsRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicePaymentsModels.CalculatePaymentsResponseDtoSchema },
    `/offices/${officeId}/payments/calculate`,
    ZodExtended.parse(InvoicePaymentsModels.CalculatePaymentsRequestDtoSchema, data),
    
  );
};

const exportOfficePayments = (officeId: string, data: InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/payments/exports`,
    ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const list = (officeId: string, invoiceId: string, limit: number, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicePaymentsModels.InvoicePaymentsListResponseSchema },
    `/offices/${officeId}/invoices/${invoiceId}/payments`,
    {
      params: {
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, invoiceId: string, data: InvoicePaymentsModels.CreateInvoicePaymentRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/payments`,
    ZodExtended.parse(InvoicePaymentsModels.CreateInvoicePaymentRequestDtoSchema, data),
    
  );
};

const getPaymentById = (officeId: string, invoiceId: string, paymentId: string) => {
  return AppRestClient.get(
    { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
    
  );
};

const update = (officeId: string, invoiceId: string, paymentId: string, data: InvoicePaymentsModels.UpdateInvoicePaymentRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
    ZodExtended.parse(InvoicePaymentsModels.UpdateInvoicePaymentRequestDtoSchema, data),
    
  );
};

const deleteInvoicePayment = (officeId: string, invoiceId: string, paymentId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
    
  );
};


export const moduleName = QueryModule.InvoicePayments;

export const keys = {
    all: [moduleName] as const,
    listOfficePayments: (officeId: string, limit?: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/payments", officeId, limit, order, filter, page, cursor] as const,
    listOfficePaymentsInfinite: (officeId: string, limit?: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/payments", "infinite", officeId, limit, order, filter, cursor] as const,
    list: (officeId: string, invoiceId: string, limit?: number, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/payments", officeId, invoiceId, limit, page, cursor] as const,
    listInfinite: (officeId: string, invoiceId: string, limit?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/payments", "infinite", officeId, invoiceId, limit, cursor] as const,
    getPaymentById: (officeId: string, invoiceId: string, paymentId: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/payments/:paymentId", officeId, invoiceId, paymentId] as const,
};

/** 
 * Query `useListOfficePayments`
 * @summary List all payments for an office
 * @permission Requires `canUseListOfficePayments` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, amount, paymentMethod, comment, createdAt, updatedAt, currencyNotation, createdByName, invoiceNumber, invoiceDirection, invoiceGrossAmount, invoiceStatus, invoicePaidOn, invoiceIssuingDate. Example: `paymentDate`
 * @param { InvoicePaymentsModels.OfficeInvoicePaymentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicePaymentsModels.ListOfficePaymentsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListOfficePayments = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listOfficePayments, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listOfficePayments(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseListOfficePayments({ officeId } ));
    return listOfficePayments(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListOfficePaymentsInfinite
 * @summary List all payments for an office
 * @permission Requires `canUseListOfficePayments` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, amount, paymentMethod, comment, createdAt, updatedAt, currencyNotation, createdByName, invoiceNumber, invoiceDirection, invoiceGrossAmount, invoiceStatus, invoicePaidOn, invoiceIssuingDate. Example: `paymentDate`
 * @param { InvoicePaymentsModels.OfficeInvoicePaymentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicePaymentsModels.ListOfficePaymentsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListOfficePaymentsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listOfficePayments, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listOfficePaymentsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicePaymentsAcl.canUseListOfficePayments({ officeId } ));
    return listOfficePayments(officeId, limit, order, filter, pageParam, cursor) },
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
 * Mutation `useBulkCreatePayments`
 * @summary Bulk create payments for multiple invoices
 * @permission Requires `canUseBulkCreatePayments` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicePaymentsModels.BulkCreatePaymentsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicePaymentsModels.BulkCreatePaymentsResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useBulkCreatePayments = (options?: AppMutationOptions<typeof bulkCreatePayments, { officeId: string, data: InvoicePaymentsModels.BulkCreatePaymentsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseBulkCreatePayments({ officeId } ));
      return bulkCreatePayments(officeId, data)
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
 * Mutation `useCalculatePayments`
 * @summary Calculate grouped payments for provided invoices
 * @permission Requires `canUseCalculatePayments` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicePaymentsModels.CalculatePaymentsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicePaymentsModels.CalculatePaymentsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useCalculatePayments = (options?: AppMutationOptions<typeof calculatePayments, { officeId: string, data: InvoicePaymentsModels.CalculatePaymentsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseCalculatePayments({ officeId } ));
      return calculatePayments(officeId, data)
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
 * Mutation `useExportOfficePayments` - recommended when file should not be cached
 * @summary Export office invoice payments to Excel
 * @permission Requires `canUseExportOfficePayments` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportOfficePayments = (options?: AppMutationOptions<typeof exportOfficePayments, { officeId: string, data: InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseExportOfficePayments({ officeId } ));
      return exportOfficePayments(officeId, data)
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
 * @summary List payments for an invoice
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicePaymentsModels.InvoicePaymentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, invoiceId, limit, page, cursor }: { officeId: string, invoiceId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, invoiceId, limit, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseList({ officeId } ));
    return list(officeId, invoiceId, limit, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List payments for an invoice
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicePaymentsModels.InvoicePaymentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, invoiceId, limit, cursor }: { officeId: string, invoiceId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, invoiceId, limit, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicePaymentsAcl.canUseList({ officeId } ));
    return list(officeId, invoiceId, limit, pageParam, cursor) },
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
 * Mutation `useCreate`
 * @summary Create a payment for an invoice
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicePaymentsModels.CreateInvoicePaymentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicePaymentsModels.PaymentResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, invoiceId: string, data: InvoicePaymentsModels.CreateInvoicePaymentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseCreate({ officeId } ));
      return create(officeId, invoiceId, data)
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
 * Query `useGetPaymentById`
 * @summary Get a payment by ID
 * @permission Requires `canUseGetPaymentById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { string } object.paymentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicePaymentsModels.PaymentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetPaymentById = <TData>({ officeId, invoiceId, paymentId }: { officeId: string, invoiceId: string, paymentId: string }, options?: AppQueryOptions<typeof getPaymentById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getPaymentById(officeId, invoiceId, paymentId),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseGetPaymentById({ officeId } ));
    return getPaymentById(officeId, invoiceId, paymentId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update a payment
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { string } mutation.paymentId Path parameter
 * @param { InvoicePaymentsModels.UpdateInvoicePaymentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicePaymentsModels.PaymentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, invoiceId: string, paymentId: string, data: InvoicePaymentsModels.UpdateInvoicePaymentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, paymentId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseUpdate({ officeId } ));
      return update(officeId, invoiceId, paymentId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId, paymentId } = variables;
      const updateKeys = [keys.getPaymentById(officeId, invoiceId, paymentId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteInvoicePayment`
 * @summary Delete a payment
 * @permission Requires `canUseDeleteInvoicePayment` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { string } mutation.paymentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteInvoicePayment = (options?: AppMutationOptions<typeof deleteInvoicePayment, { officeId: string, invoiceId: string, paymentId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, paymentId }) => { 
      checkAcl(InvoicePaymentsAcl.canUseDeleteInvoicePayment({ officeId } ));
      return deleteInvoicePayment(officeId, invoiceId, paymentId)
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
