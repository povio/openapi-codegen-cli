import axios from "axios";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { InvoicesAcl } from "./invoices.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InvoicesModels } from "./invoices.models";
import { CommonModels } from "@/data/common/common.models";
import { InvoicesApi } from "./invoices.api";

export namespace InvoicesQueries {
export const moduleName = QueryModule.Invoices;

export const keys = {
    all: [moduleName] as const,
    getInvoicesEml: (officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam) => [...keys.all, "/offices/:officeId/invoices/eml", officeId, invoiceIds] as const,
    find: (officeId: string, positionId: string, limit?: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/invoices", officeId, positionId, limit, order, filter, page, cursor] as const,
    findInfinite: (officeId: string, positionId: string, limit?: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/invoices", "infinite", officeId, positionId, limit, order, filter, cursor] as const,
    findByOffice: (officeId: string, limit?: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices", officeId, limit, order, filter, page, cursor] as const,
    findByOfficeInfinite: (officeId: string, limit?: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/invoices", "infinite", officeId, limit, order, filter, cursor] as const,
    getUnCharges: (officeId: string, positionId: string, limit?: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/uninvoiced-charges", officeId, positionId, limit, order, filter, page, cursor] as const,
    getUnChargesInfinite: (officeId: string, positionId: string, limit?: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/uninvoiced-charges", "infinite", officeId, positionId, limit, order, filter, cursor] as const,
    listAvailablePartnersFor: (officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/available-partners", officeId, invoiceId, search, useCase] as const,
    getOfficeUnCharges: (officeId: string, limit?: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/uninvoiced-charges", officeId, limit, order, filter, page, cursor] as const,
    getOfficeUnChargesInfinite: (officeId: string, limit?: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/uninvoiced-charges", "infinite", officeId, limit, order, filter, cursor] as const,
    getDetail: (officeId: string, invoiceId: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId", officeId, invoiceId] as const,
    getPreview: (officeId: string, invoiceId: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/preview", officeId, invoiceId] as const,
    getInvoiceEml: (officeId: string, invoiceId: string) => [...keys.all, "/offices/:officeId/invoices/:invoiceId/eml", officeId, invoiceId] as const,
};

const getInvoicesEmlQueryOptions = ({ officeId, invoiceIds }: { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }) => ({
  queryKey: keys.getInvoicesEml(officeId, invoiceIds),
  queryFn: () => InvoicesApi.getInvoicesEml(officeId, invoiceIds),
});

/** 
 * Query `useGetInvoicesEml` - recommended when file should be cached
 * @summary Get invoices as EML file with PDF attachments
 * @permission Requires `canUseGetInvoicesEml` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.GetInvoicesEmlInvoiceIdsParam } invoiceIds Query parameter. Invoice IDs
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoicesEml = <TData>({ officeId, invoiceIds }: { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }, options?: AppQueryOptions<typeof InvoicesApi.getInvoicesEml, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getInvoicesEmlQueryOptions({ officeId, invoiceIds }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetInvoicesEml({ officeId } ));
      return getInvoicesEmlQueryOptions({ officeId, invoiceIds }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetInvoicesEml = (queryClient: QueryClient, { officeId, invoiceIds }: { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getInvoicesEmlQueryOptions({ officeId, invoiceIds }), ...options });
};

/** 
 * Mutation `useGetInvoicesEmlMutation` - recommended when file should not be cached
 * @summary Get invoices as EML file with PDF attachments
 * @permission Requires `canUseGetInvoicesEml` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.GetInvoicesEmlInvoiceIdsParam } invoiceIds Query parameter. Invoice IDs
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoicesEmlMutation = (options?: AppMutationOptions<typeof InvoicesApi.getInvoicesEml, { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceIds }) => { 
      checkAcl(InvoicesAcl.canUseGetInvoicesEml({ officeId } ));
      return InvoicesApi.getInvoicesEml(officeId, invoiceIds)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const findQueryOptions = ({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.find(officeId, positionId, limit, order, filter, page, cursor),
  queryFn: () => InvoicesApi.find(officeId, positionId, limit, order, filter, page, cursor),
});

/** 
 * Query `useFind`
 * @summary List invoices for a position
 * @permission Requires `canUseFind` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): status, createdAt, serviceDate. Example: `status`
 * @param { InvoicesModels.InvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoicesFindResponse> } 
 * @statusCodes [200, 401]
 */
export const useFind = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicesApi.find, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseFind({ officeId } ));
      return findQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchFind = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }), ...options });
};

const findInfiniteQueryOptions = ({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, cursor?: string }) => ({
  queryKey: keys.findInfinite(officeId, positionId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => InvoicesApi.find(officeId, positionId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useFindInfinite
 * @summary List invoices for a position
 * @permission Requires `canUseFind` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): status, createdAt, serviceDate. Example: `status`
 * @param { InvoicesModels.InvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.InvoicesFindResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicesApi.find, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...findInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(InvoicesAcl.canUseFind({ officeId } ));
      return findInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchFindInfinite = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...findInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useChangeIncomingCustomer`
 * @summary Change incoming invoice customer and update vendors on registered charges
 * @permission Requires `canUseChangeIncomingCustomer` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.ChangeInvoiceCustomerRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401]
 */
export const useChangeIncomingCustomer = (options?: AppMutationOptions<typeof InvoicesApi.changeIncomingCustomer, { officeId: string, invoiceId: string, data: InvoicesModels.ChangeInvoiceCustomerRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseChangeIncomingCustomer({ officeId } ));
      return InvoicesApi.changeIncomingCustomer(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const findByOfficeQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.findByOffice(officeId, limit, order, filter, page, cursor),
  queryFn: () => InvoicesApi.findByOffice(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useFindByOffice`
 * @summary List invoices for an office
 * @permission Requires `canUseFindByOffice` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { InvoicesModels.OfficeInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.FindByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindByOffice = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicesApi.findByOffice, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseFindByOffice({ officeId } ));
      return findByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindByOffice = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const findByOfficeInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, cursor?: string }) => ({
  queryKey: keys.findByOfficeInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => InvoicesApi.findByOffice(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useFindByOfficeInfinite
 * @summary List invoices for an office
 * @permission Requires `canUseFindByOffice` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { InvoicesModels.OfficeInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.FindByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindByOfficeInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicesApi.findByOffice, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...findByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(InvoicesAcl.canUseFindByOffice({ officeId } ));
      return findByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchFindByOfficeInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...findByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreateDraft`
 * @summary Create a draft invoice from charge items
 * @permission Requires `canUseCreateDraft` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.CreateDraftInvoiceRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useCreateDraft = (options?: AppMutationOptions<typeof InvoicesApi.createDraft, { officeId: string, data: InvoicesModels.CreateDraftInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseCreateDraft({ officeId } ));
      return InvoicesApi.createDraft(officeId, data)
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
 * Mutation `useExportInvoices` - recommended when file should not be cached
 * @summary Export invoices to Excel
 * @permission Requires `canUseExportInvoices` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.InvoiceExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportInvoices = (options?: AppMutationOptions<typeof InvoicesApi.exportInvoices, { officeId: string, data: InvoicesModels.InvoiceExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportInvoices({ officeId } ));
      return InvoicesApi.exportInvoices(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useExportCharges` - recommended when file should not be cached
 * @summary Export invoice charges as Excel file
 * @permission Requires `canUseExportCharges` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.InvoiceExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportCharges = (options?: AppMutationOptions<typeof InvoicesApi.exportCharges, { officeId: string, data: InvoicesModels.InvoiceExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportCharges({ officeId } ));
      return InvoicesApi.exportCharges(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getUnChargesQueryOptions = ({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string }) => ({
  queryKey: keys.getUnCharges(officeId, positionId, limit, order, filter, page, cursor),
  queryFn: () => InvoicesApi.getUnCharges(officeId, positionId, limit, order, filter, page, cursor),
});

/** 
 * Query `useGetUnCharges`
 * @summary Get uninvoiced charges for a position
 * @permission Requires `canUseGetUnCharges` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargePaginationDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.GetUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetUnCharges = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicesApi.getUnCharges, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getUnChargesQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetUnCharges({ officeId } ));
      return getUnChargesQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetUnCharges = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getUnChargesQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }), ...options });
};

const getUnChargesInfiniteQueryOptions = ({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, cursor?: string }) => ({
  queryKey: keys.getUnChargesInfinite(officeId, positionId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => InvoicesApi.getUnCharges(officeId, positionId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useGetUnChargesInfinite
 * @summary Get uninvoiced charges for a position
 * @permission Requires `canUseGetUnCharges` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargePaginationDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.GetUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetUnChargesInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicesApi.getUnCharges, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getUnChargesInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(InvoicesAcl.canUseGetUnCharges({ officeId } ));
      return getUnChargesInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchGetUnChargesInfinite = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...getUnChargesInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }), ...options });
};

const listAvailablePartnersForQueryOptions = ({ officeId, invoiceId, search, useCase }: { officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase }) => ({
  queryKey: keys.listAvailablePartnersFor(officeId, invoiceId, search, useCase),
  queryFn: () => InvoicesApi.listAvailablePartnersFor(officeId, invoiceId, search, useCase),
});

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for an invoice (union of position involved parties)
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { string } search Query parameter
 * @param { InvoicesModels.PositionAvailablePartnersUseCase } useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoicesListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, invoiceId, search, useCase }: { officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof InvoicesApi.listAvailablePartnersFor, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listAvailablePartnersForQueryOptions({ officeId, invoiceId, search, useCase }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseListAvailablePartnersFor({ officeId } ));
      return listAvailablePartnersForQueryOptions({ officeId, invoiceId, search, useCase }).queryFn();
    },
    ...options,
  });
};

export const prefetchListAvailablePartnersFor = (queryClient: QueryClient, { officeId, invoiceId, search, useCase }: { officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listAvailablePartnersForQueryOptions({ officeId, invoiceId, search, useCase }), ...options });
};

const getOfficeUnChargesQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.getOfficeUnCharges(officeId, limit, order, filter, page, cursor),
  queryFn: () => InvoicesApi.getOfficeUnCharges(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useGetOfficeUnCharges`
 * @summary Get uninvoiced charges for all positions in an office
 * @permission Requires `canUseGetOfficeUnCharges` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargesFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.GetOfficeUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetOfficeUnCharges = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof InvoicesApi.getOfficeUnCharges, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getOfficeUnChargesQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetOfficeUnCharges({ officeId } ));
      return getOfficeUnChargesQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetOfficeUnCharges = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getOfficeUnChargesQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const getOfficeUnChargesInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, cursor?: string }) => ({
  queryKey: keys.getOfficeUnChargesInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => InvoicesApi.getOfficeUnCharges(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useGetOfficeUnChargesInfinite
 * @summary Get uninvoiced charges for all positions in an office
 * @permission Requires `canUseGetOfficeUnCharges` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargesFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.GetOfficeUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetOfficeUnChargesInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof InvoicesApi.getOfficeUnCharges, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getOfficeUnChargesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(InvoicesAcl.canUseGetOfficeUnCharges({ officeId } ));
      return getOfficeUnChargesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchGetOfficeUnChargesInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...getOfficeUnChargesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useExportUnCharges` - recommended when file should not be cached
 * @summary Export uninvoiced charges as Excel file
 * @permission Requires `canUseExportUnCharges` ability 
 * @param { string } officeId Path parameter
 * @param { InvoicesModels.UninvoicedChargesExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportUnCharges = (options?: AppMutationOptions<typeof InvoicesApi.exportUnCharges, { officeId: string, data: InvoicesModels.UninvoicedChargesExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportUnCharges({ officeId } ));
      return InvoicesApi.exportUnCharges(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCreateDirect`
 * @summary Dummy endpoint to expose direct invoice permission to FE
 * @permission Requires `canUseCreateDirect` ability 
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401, default]
 */
export const useCreateDirect = (options?: AppMutationOptions<typeof InvoicesApi.createDirect, { officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId }) => { 
      checkAcl(InvoicesAcl.canUseCreateDirect({ officeId } ));
      return InvoicesApi.createDirect(officeId)
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
 * Mutation `useAddChargeToDirect`
 * @summary Add a charge to a direct invoice
 * @permission Requires `canUseAddChargeToDirect` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.CreateDirectInvoiceChargeRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useAddChargeToDirect = (options?: AppMutationOptions<typeof InvoicesApi.addChargeToDirect, { officeId: string, invoiceId: string, data: InvoicesModels.CreateDirectInvoiceChargeRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseAddChargeToDirect({ officeId } ));
      return InvoicesApi.addChargeToDirect(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateCharges`
 * @summary Update charges on a draft invoice
 * @permission Requires `canUseUpdateCharges` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.UpdateInvoiceChargesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateCharges = (options?: AppMutationOptions<typeof InvoicesApi.updateCharges, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceChargesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateCharges({ officeId } ));
      return InvoicesApi.updateCharges(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRemoveChargeFromDirect`
 * @summary Remove a charge from a direct invoice
 * @permission Requires `canUseRemoveChargeFromDirect` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { string } chargeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useRemoveChargeFromDirect = (options?: AppMutationOptions<typeof InvoicesApi.removeChargeFromDirect, { officeId: string, invoiceId: string, chargeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, chargeId }) => { 
      checkAcl(InvoicesAcl.canUseRemoveChargeFromDirect({ officeId } ));
      return InvoicesApi.removeChargeFromDirect(officeId, invoiceId, chargeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getDetailQueryOptions = ({ officeId, invoiceId }: { officeId: string, invoiceId: string }) => ({
  queryKey: keys.getDetail(officeId, invoiceId),
  queryFn: () => InvoicesApi.getDetail(officeId, invoiceId),
});

/** 
 * Query `useGetDetail`
 * @summary Get invoice details
 * @permission Requires `canUseGetDetail` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useGetDetail = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof InvoicesApi.getDetail, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getDetailQueryOptions({ officeId, invoiceId }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetDetail({ officeId } ));
      return getDetailQueryOptions({ officeId, invoiceId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetDetail = (queryClient: QueryClient, { officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getDetailQueryOptions({ officeId, invoiceId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update invoice details
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.UpdateInvoiceRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdate = (options?: AppMutationOptions<typeof InvoicesApi.update, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdate({ officeId } ));
      return InvoicesApi.update(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteInvoice`
 * @summary Delete invoice
 * @permission Requires `canUseDeleteInvoice` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteInvoice = (options?: AppMutationOptions<typeof InvoicesApi.deleteInvoice, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseDeleteInvoice({ officeId } ));
      return InvoicesApi.deleteInvoice(officeId, invoiceId)
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
 * Mutation `useFix`
 * @summary Fix invoice with accounting permission
 * @permission Requires `canUseFix` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.FixInvoiceRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useFix = (options?: AppMutationOptions<typeof InvoicesApi.fix, { officeId: string, invoiceId: string, data: InvoicesModels.FixInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseFix({ officeId } ));
      return InvoicesApi.fix(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerate` - recommended when file should not be cached
 * @summary Generate an invoice PDF
 * @permission Requires `canUseGenerate` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<void>> } 
 * @statusCodes [201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof InvoicesApi.generate, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGenerate({ officeId } ));
      return InvoicesApi.generate(officeId, invoiceId)
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
 * Mutation `useUpdateIssuedVatRules`
 * @summary Update VAT rules on issued invoice charges
 * @permission Requires `canUseUpdateIssuedVatRules` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateIssuedVatRules = (options?: AppMutationOptions<typeof InvoicesApi.updateIssuedVatRules, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateIssuedVatRules({ officeId } ));
      return InvoicesApi.updateIssuedVatRules(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateIssuedCharges`
 * @summary Update charges on issued invoice
 * @permission Requires `canUseUpdateIssuedCharges` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.UpdateIssuedInvoiceChargesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateIssuedCharges = (options?: AppMutationOptions<typeof InvoicesApi.updateIssuedCharges, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceChargesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateIssuedCharges({ officeId } ));
      return InvoicesApi.updateIssuedCharges(officeId, invoiceId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useIssue` - recommended when file should not be cached
 * @summary Issue outgoing invoice
 * @permission Requires `canUseIssue` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useIssue = (options?: AppMutationOptions<typeof InvoicesApi.issue, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseIssue({ officeId } ));
      return InvoicesApi.issue(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId), keys.getPreview(officeId, invoiceId), keys.getInvoiceEml(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useReportHungarian`
 * @summary Report invoice to Hungarian tax authority
 * @permission Requires `canUseReportHungarian` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useReportHungarian = (options?: AppMutationOptions<typeof InvoicesApi.reportHungarian, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseReportHungarian({ officeId } ));
      return InvoicesApi.reportHungarian(officeId, invoiceId)
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
 * Mutation `useGenerateIncoming` - recommended when file should not be cached
 * @summary Re-Generate an invoice PDF
 * @permission Requires `canUseGenerateIncoming` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGenerateIncoming = (options?: AppMutationOptions<typeof InvoicesApi.generateIncoming, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGenerateIncoming({ officeId } ));
      return InvoicesApi.generateIncoming(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId), keys.getPreview(officeId, invoiceId), keys.getInvoiceEml(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRegister`
 * @summary Register incoming invoice
 * @permission Requires `canUseRegister` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useRegister = (options?: AppMutationOptions<typeof InvoicesApi.register, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseRegister({ officeId } ));
      return InvoicesApi.register(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getPreviewQueryOptions = ({ officeId, invoiceId }: { officeId: string, invoiceId: string }) => ({
  queryKey: keys.getPreview(officeId, invoiceId),
  queryFn: () => InvoicesApi.getPreview(officeId, invoiceId),
});

/** 
 * Query `useGetPreview` - recommended when file should be cached
 * @summary Get invoice PDF preview
 * @permission Requires `canUseGetPreview` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetPreview = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof InvoicesApi.getPreview, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getPreviewQueryOptions({ officeId, invoiceId }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetPreview({ officeId } ));
      return getPreviewQueryOptions({ officeId, invoiceId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetPreview = (queryClient: QueryClient, { officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getPreviewQueryOptions({ officeId, invoiceId }), ...options });
};

/** 
 * Mutation `useGetPreviewMutation` - recommended when file should not be cached
 * @summary Get invoice PDF preview
 * @permission Requires `canUseGetPreview` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetPreviewMutation = (options?: AppMutationOptions<typeof InvoicesApi.getPreview, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGetPreview({ officeId } ));
      return InvoicesApi.getPreview(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId), keys.getPreview(officeId, invoiceId), keys.getInvoiceEml(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getInvoiceEmlQueryOptions = ({ officeId, invoiceId }: { officeId: string, invoiceId: string }) => ({
  queryKey: keys.getInvoiceEml(officeId, invoiceId),
  queryFn: () => InvoicesApi.getInvoiceEml(officeId, invoiceId),
});

/** 
 * Query `useGetInvoiceEml` - recommended when file should be cached
 * @summary Get invoice as EML file with PDF attachment
 * @permission Requires `canUseGetInvoiceEml` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoiceEml = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof InvoicesApi.getInvoiceEml, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getInvoiceEmlQueryOptions({ officeId, invoiceId }),
    queryFn: async () => {
    checkAcl(InvoicesAcl.canUseGetInvoiceEml({ officeId } ));
      return getInvoiceEmlQueryOptions({ officeId, invoiceId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetInvoiceEml = (queryClient: QueryClient, { officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getInvoiceEmlQueryOptions({ officeId, invoiceId }), ...options });
};

/** 
 * Mutation `useGetInvoiceEmlMutation` - recommended when file should not be cached
 * @summary Get invoice as EML file with PDF attachment
 * @permission Requires `canUseGetInvoiceEml` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoiceEmlMutation = (options?: AppMutationOptions<typeof InvoicesApi.getInvoiceEml, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGetInvoiceEml({ officeId } ));
      return InvoicesApi.getInvoiceEml(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId), keys.getPreview(officeId, invoiceId), keys.getInvoiceEml(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `usePrepareDocumentUpload`
 * @summary Prepare for invoice document upload
 * @permission Requires `canUsePrepareDocumentUpload` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { InvoicesModels.PrepareUploadRequestDto } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceUploadInstructionsDto> } 
 * @statusCodes [200, 401, default]
 */
export const usePrepareDocumentUpload = (options?: AppMutationOptions<typeof InvoicesApi.prepareDocumentUpload, { officeId: string, invoiceId: string, data: InvoicesModels.PrepareUploadRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, invoiceId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(InvoicesAcl.canUsePrepareDocumentUpload({ officeId } ));
      const uploadInstructions = await InvoicesApi.prepareDocumentUpload(officeId, invoiceId, data);
      
      if (file && uploadInstructions.url) {
        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";
        let dataToSend: File | FormData = file;
        if (method === "post") {
          dataToSend = new FormData();
          if (uploadInstructions.fields) {
            for (const [key, value] of uploadInstructions.fields) {
              dataToSend.append(key, value);
            }
          }
          dataToSend.append("file", file);
        }
        await axios[method](uploadInstructions.url, dataToSend, {
          headers: {
            "Content-Type": file.type,
          },
          signal: abortController?.signal,
          onUploadProgress: onUploadProgress
          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })
          : undefined,
        });
      }
      
      return uploadInstructions;
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
 * Mutation `useCancel`
 * @summary Cancel invoice (create draft credit note)
 * @permission Requires `canUseCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useCancel = (options?: AppMutationOptions<typeof InvoicesApi.cancel, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseCancel({ officeId } ));
      return InvoicesApi.cancel(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useIssueCreditNote`
 * @summary Issue credit invoice
 * @permission Requires `canUseIssueCreditNote` ability 
 * @param { string } officeId Path parameter
 * @param { string } invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useIssueCreditNote = (options?: AppMutationOptions<typeof InvoicesApi.issueCreditNote, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Invoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseIssueCreditNote({ officeId } ));
      return InvoicesApi.issueCreditNote(officeId, invoiceId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
