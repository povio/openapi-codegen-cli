import axios, {  } from "axios";
import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InvoicesAcl } from "./invoices.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InvoicesModels } from "./invoices.models";

export namespace InvoicesQueries {
const getInvoicesEml = (officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/eml`,
    {
      params: {
        invoiceIds: ZodExtended.parse(InvoicesModels.GetInvoicesEmlInvoiceIdsParamSchema.optional(), invoiceIds, { type: "query", name: "invoiceIds" }),
      },
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const find = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.InvoicesFindResponseSchema },
    `/offices/${officeId}/positions/${positionId}/invoices`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.InvoicesFindOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(InvoicesModels.InvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const changeIncomingCustomer = (officeId: string, invoiceId: string, data: InvoicesModels.ChangeInvoiceCustomerRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/customer`,
    ZodExtended.parse(InvoicesModels.ChangeInvoiceCustomerRequestDtoSchema, data),
    
  );
};

const findByOffice = (officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.FindByOfficeResponseSchema },
    `/offices/${officeId}/invoices`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.FindByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(InvoicesModels.OfficeInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const createDraft = (officeId: string, data: InvoicesModels.CreateDraftInvoiceRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices`,
    ZodExtended.parse(InvoicesModels.CreateDraftInvoiceRequestDtoSchema, data),
    
  );
};

const exportInvoices = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/exports`,
    ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const exportCharges = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/charges/exports`,
    ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const getUnCharges = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.GetUnChargesResponseSchema },
    `/offices/${officeId}/positions/${positionId}/uninvoiced-charges`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(InvoicesModels.UninvoicedChargePaginationDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const listAvailablePartnersFor = (officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.InvoicesListAvailablePartnersForResponseSchema },
    `/offices/${officeId}/invoices/${invoiceId}/available-partners`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        useCase: ZodExtended.parse(InvoicesModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
      },
    }
  );
};

const getOfficeUnCharges = (officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.GetOfficeUnChargesResponseSchema },
    `/offices/${officeId}/uninvoiced-charges`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetOfficeUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(InvoicesModels.UninvoicedChargesFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const exportUnCharges = (officeId: string, data: InvoicesModels.UninvoicedChargesExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/uninvoiced-charges/exports`,
    ZodExtended.parse(InvoicesModels.UninvoicedChargesExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const createDirect = (officeId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/direct-invoices`,
    
  );
};

const addChargeToDirect = (officeId: string, invoiceId: string, data: InvoicesModels.CreateDirectInvoiceChargeRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/charges`,
    ZodExtended.parse(InvoicesModels.CreateDirectInvoiceChargeRequestDtoSchema, data),
    
  );
};

const updateCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceChargesRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/charges`,
    ZodExtended.parse(InvoicesModels.UpdateInvoiceChargesRequestDtoSchema, data),
    
  );
};

const removeChargeFromDirect = (officeId: string, invoiceId: string, chargeId: string) => {
  return AppRestClient.delete(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/charges/${chargeId}`,
    
  );
};

const getDetail = (officeId: string, invoiceId: string) => {
  return AppRestClient.get(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}`,
    
  );
};

const update = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}`,
    ZodExtended.parse(InvoicesModels.UpdateInvoiceRequestDtoSchema, data),
    
  );
};

const deleteInvoice = (officeId: string, invoiceId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/invoices/${invoiceId}`,
    
  );
};

const fix = (officeId: string, invoiceId: string, data: InvoicesModels.FixInvoiceRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/fix`,
    ZodExtended.parse(InvoicesModels.FixInvoiceRequestDtoSchema, data),
    
  );
};

const generate = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/invoices/${invoiceId}/document`,
    
  );
};

const updateIssuedVatRules = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/fix/charges/vat-rules`,
    ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDtoSchema, data),
    
  );
};

const updateIssuedCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceChargesRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/fix/charges`,
    ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceChargesRequestDtoSchema, data),
    
  );
};

const issue = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/${invoiceId}/issue`,
    undefined,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const reportHungarian = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/invoices/${invoiceId}/hungarian-report`,
    
  );
};

const generateIncoming = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/${invoiceId}/generate-incoming`,
    undefined,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const register = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/register`,
    
  );
};

const getPreview = (officeId: string, invoiceId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/${invoiceId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const getInvoiceEml = (officeId: string, invoiceId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/${invoiceId}/eml`,
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const prepareDocumentUpload = (officeId: string, invoiceId: string, data: InvoicesModels.PrepareUploadRequestDto) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceUploadInstructionsDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/upload-document`,
    ZodExtended.parse(InvoicesModels.PrepareUploadRequestDtoSchema, data),
    
  );
};

const cancel = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/cancel`,
    
  );
};

const issueCreditNote = (officeId: string, invoiceId: string) => {
  return AppRestClient.post(
    { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
    `/offices/${officeId}/invoices/${invoiceId}/credit-note/issue`,
    
  );
};


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

/** 
 * Query `useGetInvoicesEml` - recommended when file should be cached
 * @summary Get invoices as EML file with PDF attachments
 * @permission Requires `canUseGetInvoicesEml` ability 
 * @param { string } object.officeId Path parameter
 * @param { InvoicesModels.GetInvoicesEmlInvoiceIdsParam } object.invoiceIds Query parameter. Invoice IDs
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoicesEml = <TData>({ officeId, invoiceIds }: { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }, options?: AppQueryOptions<typeof getInvoicesEml, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getInvoicesEml(officeId, invoiceIds),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetInvoicesEml({ officeId } ));
    return getInvoicesEml(officeId, invoiceIds) },
    ...options,
  });
};

/** 
 * Mutation `useGetInvoicesEmlMutation` - recommended when file should not be cached
 * @summary Get invoices as EML file with PDF attachments
 * @permission Requires `canUseGetInvoicesEml` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicesModels.GetInvoicesEmlInvoiceIdsParam } mutation.invoiceIds Query parameter. Invoice IDs
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoicesEmlMutation = (options?: AppMutationOptions<typeof getInvoicesEml, { officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceIds }) => { 
      checkAcl(InvoicesAcl.canUseGetInvoicesEml({ officeId } ));
      return getInvoicesEml(officeId, invoiceIds)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useFind`
 * @summary List invoices for a position
 * @permission Requires `canUseFind` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): status, createdAt, serviceDate. Example: `status`
 * @param { InvoicesModels.InvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoicesFindResponse> } 
 * @statusCodes [200, 401]
 */
export const useFind = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof find, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.find(officeId, positionId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseFind({ officeId } ));
    return find(officeId, positionId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindInfinite
 * @summary List invoices for a position
 * @permission Requires `canUseFind` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): status, createdAt, serviceDate. Example: `status`
 * @param { InvoicesModels.InvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.InvoicesFindResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof find, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findInfinite(officeId, positionId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicesAcl.canUseFind({ officeId } ));
    return find(officeId, positionId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useChangeIncomingCustomer`
 * @summary Change incoming invoice customer and update vendors on registered charges
 * @permission Requires `canUseChangeIncomingCustomer` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.ChangeInvoiceCustomerRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401]
 */
export const useChangeIncomingCustomer = (options?: AppMutationOptions<typeof changeIncomingCustomer, { officeId: string, invoiceId: string, data: InvoicesModels.ChangeInvoiceCustomerRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseChangeIncomingCustomer({ officeId } ));
      return changeIncomingCustomer(officeId, invoiceId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useFindByOffice`
 * @summary List invoices for an office
 * @permission Requires `canUseFindByOffice` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { CommonModels.OfficeInvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.FindByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindByOffice = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findByOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findByOffice(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseFindByOffice({ officeId } ));
    return findByOffice(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindByOfficeInfinite
 * @summary List invoices for an office
 * @permission Requires `canUseFindByOffice` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { CommonModels.OfficeInvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.FindByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindByOfficeInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findByOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findByOfficeInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicesAcl.canUseFindByOffice({ officeId } ));
    return findByOffice(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useCreateDraft`
 * @summary Create a draft invoice from charge items
 * @permission Requires `canUseCreateDraft` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicesModels.CreateDraftInvoiceRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useCreateDraft = (options?: AppMutationOptions<typeof createDraft, { officeId: string, data: InvoicesModels.CreateDraftInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseCreateDraft({ officeId } ));
      return createDraft(officeId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicesModels.InvoiceExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportInvoices = (options?: AppMutationOptions<typeof exportInvoices, { officeId: string, data: InvoicesModels.InvoiceExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportInvoices({ officeId } ));
      return exportInvoices(officeId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicesModels.InvoiceExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportCharges = (options?: AppMutationOptions<typeof exportCharges, { officeId: string, data: InvoicesModels.InvoiceExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportCharges({ officeId } ));
      return exportCharges(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetUnCharges`
 * @summary Get uninvoiced charges for a position
 * @permission Requires `canUseGetUnCharges` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargePaginationDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.GetUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetUnCharges = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof getUnCharges, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getUnCharges(officeId, positionId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetUnCharges({ officeId } ));
    return getUnCharges(officeId, positionId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useGetUnChargesInfinite
 * @summary Get uninvoiced charges for a position
 * @permission Requires `canUseGetUnCharges` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargePaginationDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.GetUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetUnChargesInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof getUnCharges, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.getUnChargesInfinite(officeId, positionId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicesAcl.canUseGetUnCharges({ officeId } ));
    return getUnCharges(officeId, positionId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for an invoice (union of position involved parties)
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { string } object.search Query parameter
 * @param { CommonModels.PositionAvailablePartnersUseCase } object.useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoicesListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, invoiceId, search, useCase }: { officeId: string, invoiceId: string, search?: string, useCase?: CommonModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof listAvailablePartnersFor, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listAvailablePartnersFor(officeId, invoiceId, search, useCase),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseListAvailablePartnersFor({ officeId } ));
    return listAvailablePartnersFor(officeId, invoiceId, search, useCase) },
    ...options,
  });
};

/** 
 * Query `useGetOfficeUnCharges`
 * @summary Get uninvoiced charges for all positions in an office
 * @permission Requires `canUseGetOfficeUnCharges` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargesFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.GetOfficeUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetOfficeUnCharges = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof getOfficeUnCharges, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getOfficeUnCharges(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetOfficeUnCharges({ officeId } ));
    return getOfficeUnCharges(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useGetOfficeUnChargesInfinite
 * @summary Get uninvoiced charges for all positions in an office
 * @permission Requires `canUseGetOfficeUnCharges` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): chargeItemId, orderPosition, serviceDate, receiverId, positionNumber, chargeTypeId, currency, vatRuleId. Example: `chargeItemId`
 * @param { InvoicesModels.UninvoicedChargesFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InvoicesModels.GetOfficeUnChargesResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetOfficeUnChargesInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof getOfficeUnCharges, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.getOfficeUnChargesInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(InvoicesAcl.canUseGetOfficeUnCharges({ officeId } ));
    return getOfficeUnCharges(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useExportUnCharges` - recommended when file should not be cached
 * @summary Export uninvoiced charges as Excel file
 * @permission Requires `canUseExportUnCharges` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InvoicesModels.UninvoicedChargesExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportUnCharges = (options?: AppMutationOptions<typeof exportUnCharges, { officeId: string, data: InvoicesModels.UninvoicedChargesExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InvoicesAcl.canUseExportUnCharges({ officeId } ));
      return exportUnCharges(officeId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401, default]
 */
export const useCreateDirect = (options?: AppMutationOptions<typeof createDirect, { officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId }) => { 
      checkAcl(InvoicesAcl.canUseCreateDirect({ officeId } ));
      return createDirect(officeId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.CreateDirectInvoiceChargeRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useAddChargeToDirect = (options?: AppMutationOptions<typeof addChargeToDirect, { officeId: string, invoiceId: string, data: InvoicesModels.CreateDirectInvoiceChargeRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseAddChargeToDirect({ officeId } ));
      return addChargeToDirect(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.UpdateInvoiceChargesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateCharges = (options?: AppMutationOptions<typeof updateCharges, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceChargesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateCharges({ officeId } ));
      return updateCharges(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { string } mutation.chargeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useRemoveChargeFromDirect = (options?: AppMutationOptions<typeof removeChargeFromDirect, { officeId: string, invoiceId: string, chargeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, chargeId }) => { 
      checkAcl(InvoicesAcl.canUseRemoveChargeFromDirect({ officeId } ));
      return removeChargeFromDirect(officeId, invoiceId, chargeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetDetail`
 * @summary Get invoice details
 * @permission Requires `canUseGetDetail` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useGetDetail = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof getDetail, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getDetail(officeId, invoiceId),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetDetail({ officeId } ));
    return getDetail(officeId, invoiceId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update invoice details
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.UpdateInvoiceRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdate({ officeId } ));
      return update(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteInvoice = (options?: AppMutationOptions<typeof deleteInvoice, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseDeleteInvoice({ officeId } ));
      return deleteInvoice(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.FixInvoiceRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useFix = (options?: AppMutationOptions<typeof fix, { officeId: string, invoiceId: string, data: InvoicesModels.FixInvoiceRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseFix({ officeId } ));
      return fix(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<void>> } 
 * @statusCodes [201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof generate, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGenerate({ officeId } ));
      return generate(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateIssuedVatRules = (options?: AppMutationOptions<typeof updateIssuedVatRules, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateIssuedVatRules({ officeId } ));
      return updateIssuedVatRules(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.UpdateIssuedInvoiceChargesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useUpdateIssuedCharges = (options?: AppMutationOptions<typeof updateIssuedCharges, { officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceChargesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId, data }) => { 
      checkAcl(InvoicesAcl.canUseUpdateIssuedCharges({ officeId } ));
      return updateIssuedCharges(officeId, invoiceId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useIssue = (options?: AppMutationOptions<typeof issue, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseIssue({ officeId } ));
      return issue(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useReportHungarian = (options?: AppMutationOptions<typeof reportHungarian, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseReportHungarian({ officeId } ));
      return reportHungarian(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGenerateIncoming = (options?: AppMutationOptions<typeof generateIncoming, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGenerateIncoming({ officeId } ));
      return generateIncoming(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useRegister = (options?: AppMutationOptions<typeof register, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseRegister({ officeId } ));
      return register(officeId, invoiceId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetPreview` - recommended when file should be cached
 * @summary Get invoice PDF preview
 * @permission Requires `canUseGetPreview` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetPreview = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof getPreview, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getPreview(officeId, invoiceId),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetPreview({ officeId } ));
    return getPreview(officeId, invoiceId) },
    ...options,
  });
};

/** 
 * Mutation `useGetPreviewMutation` - recommended when file should not be cached
 * @summary Get invoice PDF preview
 * @permission Requires `canUseGetPreview` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetPreviewMutation = (options?: AppMutationOptions<typeof getPreview, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGetPreview({ officeId } ));
      return getPreview(officeId, invoiceId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getInvoicesEml(officeId), keys.getPreview(officeId, invoiceId), keys.getInvoiceEml(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetInvoiceEml` - recommended when file should be cached
 * @summary Get invoice as EML file with PDF attachment
 * @permission Requires `canUseGetInvoiceEml` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.invoiceId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoiceEml = <TData>({ officeId, invoiceId }: { officeId: string, invoiceId: string }, options?: AppQueryOptions<typeof getInvoiceEml, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getInvoiceEml(officeId, invoiceId),
    queryFn: () => { 
    checkAcl(InvoicesAcl.canUseGetInvoiceEml({ officeId } ));
    return getInvoiceEml(officeId, invoiceId) },
    ...options,
  });
};

/** 
 * Mutation `useGetInvoiceEmlMutation` - recommended when file should not be cached
 * @summary Get invoice as EML file with PDF attachment
 * @permission Requires `canUseGetInvoiceEml` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetInvoiceEmlMutation = (options?: AppMutationOptions<typeof getInvoiceEml, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseGetInvoiceEml({ officeId } ));
      return getInvoiceEml(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { InvoicesModels.PrepareUploadRequestDto } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceUploadInstructionsDto> } 
 * @statusCodes [200, 401, default]
 */
export const usePrepareDocumentUpload = (options?: AppMutationOptions<typeof prepareDocumentUpload, { officeId: string, invoiceId: string, data: InvoicesModels.PrepareUploadRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, invoiceId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(InvoicesAcl.canUsePrepareDocumentUpload({ officeId } ));
      const uploadInstructions = await prepareDocumentUpload(officeId, invoiceId, data);
      
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [201, 401, default]
 */
export const useCancel = (options?: AppMutationOptions<typeof cancel, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseCancel({ officeId } ));
      return cancel(officeId, invoiceId)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.invoiceId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InvoicesModels.InvoiceDetailDto> } 
 * @statusCodes [200, 401, default]
 */
export const useIssueCreditNote = (options?: AppMutationOptions<typeof issueCreditNote, { officeId: string, invoiceId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, invoiceId }) => { 
      checkAcl(InvoicesAcl.canUseIssueCreditNote({ officeId } ));
      return issueCreditNote(officeId, invoiceId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, invoiceId } = variables;
      const updateKeys = [keys.getDetail(officeId, invoiceId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
