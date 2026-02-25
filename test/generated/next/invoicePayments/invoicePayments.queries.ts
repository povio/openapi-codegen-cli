import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InvoicePaymentsAcl } from "./invoicePayments.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InvoicePaymentsModels } from "./invoicePayments.models";
import { InvoicePaymentsApi } from "./invoicePayments.api";

export namespace InvoicePaymentsQueries {
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
export const useListOfficePayments = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicePaymentsApi.listOfficePayments, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listOfficePayments(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseListOfficePayments({ officeId } ));
    return InvoicePaymentsApi.listOfficePayments(officeId, limit, order, filter, page, cursor) },
    ...options,
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
export const useListOfficePaymentsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicePaymentsApi.listOfficePayments, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listOfficePaymentsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicePaymentsAcl.canUseListOfficePayments({ officeId } ));
    return InvoicePaymentsApi.listOfficePayments(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
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
export const useBulkCreatePayments = (options?: AppMutationOptions<typeof InvoicePaymentsApi.bulkCreatePayments, { officeId: string, data: InvoicePaymentsModels.BulkCreatePaymentsRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseBulkCreatePayments({ officeId } ));
      return InvoicePaymentsApi.bulkCreatePayments(officeId, data)
    },
    ...options,
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
export const useCalculatePayments = (options?: AppMutationOptions<typeof InvoicePaymentsApi.calculatePayments, { officeId: string, data: InvoicePaymentsModels.CalculatePaymentsRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseCalculatePayments({ officeId } ));
      return InvoicePaymentsApi.calculatePayments(officeId, data)
    },
    ...options,
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
export const useExportOfficePayments = (options?: AppMutationOptions<typeof InvoicePaymentsApi.exportOfficePayments, { officeId: string, data: InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseExportOfficePayments({ officeId } ));
      return InvoicePaymentsApi.exportOfficePayments(officeId, data)
    },
    ...options,
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
export const useList = <TData>({ officeId, invoiceId, limit, page, cursor }: { officeId: string, invoiceId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicePaymentsApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, invoiceId, limit, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseList({ officeId } ));
    return InvoicePaymentsApi.list(officeId, invoiceId, limit, page, cursor) },
    ...options,
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
export const useListInfinite = <TData>({ officeId, invoiceId, limit, cursor }: { officeId: string, invoiceId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicePaymentsApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, invoiceId, limit, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicePaymentsAcl.canUseList({ officeId } ));
    return InvoicePaymentsApi.list(officeId, invoiceId, limit, pageParam, cursor) },
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
 * @summary Create a payment for an invoice
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicePaymentsModels.CreateInvoicePaymentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicePaymentsModels.PaymentResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof InvoicePaymentsApi.create, { officeId: string, invoiceId: string, data: InvoicePaymentsModels.CreateInvoicePaymentRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseCreate({ officeId } ));
      return InvoicePaymentsApi.create(officeId, invoiceId, data)
    },
    ...options,
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
export const useGetPaymentById = <TData>({ officeId, invoiceId, paymentId }: { officeId: string, invoiceId: string, paymentId: string }, options?: AppQueryOptions<typeof InvoicePaymentsApi.getPaymentById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getPaymentById(officeId, invoiceId, paymentId),
    queryFn: () => { 
    checkAcl(InvoicePaymentsAcl.canUseGetPaymentById({ officeId } ));
    return InvoicePaymentsApi.getPaymentById(officeId, invoiceId, paymentId) },
    ...options,
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
export const useUpdate = (options?: AppMutationOptions<typeof InvoicePaymentsApi.update, { officeId: string, invoiceId: string, paymentId: string, data: InvoicePaymentsModels.UpdateInvoicePaymentRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, paymentId, data }) => { 
      checkAcl(InvoicePaymentsAcl.canUseUpdate({ officeId } ));
      return InvoicePaymentsApi.update(officeId, invoiceId, paymentId, data)
    },
    ...options,
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
export const useDeleteInvoicePayment = (options?: AppMutationOptions<typeof InvoicePaymentsApi.deleteInvoicePayment, { officeId: string, invoiceId: string, paymentId: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, paymentId }) => { 
      checkAcl(InvoicePaymentsAcl.canUseDeleteInvoicePayment({ officeId } ));
      return InvoicePaymentsApi.deleteInvoicePayment(officeId, invoiceId, paymentId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
