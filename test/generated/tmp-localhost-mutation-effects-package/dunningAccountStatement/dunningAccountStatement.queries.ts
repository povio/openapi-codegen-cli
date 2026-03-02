import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningAccountStatementAcl } from "./dunningAccountStatement.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningAccountStatementModels } from "./dunningAccountStatement.models";

export namespace DunningAccountStatementQueries {
const dataGenFake = () => {
  return AppRestClient.get(
    { resSchema: DunningAccountStatementModels.AccountStatementPdfPayloadDTOSchema },
    `/data-gen-fake/account-statement`,
    
  );
};

const generateAccountStatement = (officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/account-statement`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(DunningAccountStatementModels.GenerateAccountStatementOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(DunningAccountStatementModels.OfficeInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const getAccountStatementEml = (officeId: string, data: DunningAccountStatementModels.OfficeInvoiceListQueryDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/invoices/account-statement/eml`,
    ZodExtended.parse(DunningAccountStatementModels.OfficeInvoiceListQueryDtoSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.DunningAccountStatement;

export const keys = {
    all: [moduleName] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake/account-statement", ] as const,
    generateAccountStatement: (officeId: string, limit?: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", officeId, limit, order, filter, page, cursor] as const,
    generateAccountStatementInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", "infinite", officeId, limit, order, filter, cursor] as const,
};

/** 
 * Query `useDataGenFake`
 * @summary Expose account statement PDF payload DTO for model generation
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningAccountStatementModels.AccountStatementPdfPayloadDTO> } 
 * @statusCodes [200, 401]
 */
export const useDataGenFake = <TData>(options?: AppQueryOptions<typeof dataGenFake, TData>) => {
  
  return useQuery({
    queryKey: keys.dataGenFake(),
    queryFn: dataGenFake,
    ...options,
  });
};

/** 
 * Query `useGenerateAccountStatement` - recommended when file should be cached
 * @summary Generate account statement PDF from filtered office invoices
 * @permission Requires `canUseGenerateAccountStatement` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { DunningAccountStatementModels.OfficeInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatement = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof generateAccountStatement, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.generateAccountStatement(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
    return generateAccountStatement(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Mutation `useGenerateAccountStatementMutation` - recommended when file should not be cached
 * @summary Generate account statement PDF from filtered office invoices
 * @permission Requires `canUseGenerateAccountStatement` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { DunningAccountStatementModels.OfficeInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatementMutation = (options?: AppMutationOptions<typeof generateAccountStatement, { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningAccountStatement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, limit, order, filter, page, cursor }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
      return generateAccountStatement(officeId, limit, order, filter, page, cursor)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, limit } = variables;
      const updateKeys = [keys.generateAccountStatement(officeId, limit)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Infinite query `useGenerateAccountStatementInfinite
 * @summary Generate account statement PDF from filtered office invoices
 * @permission Requires `canUseGenerateAccountStatement` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { DunningAccountStatementModels.OfficeInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<z.instanceof(Blob)> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatementInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof generateAccountStatement, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.generateAccountStatementInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
    return generateAccountStatement(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useGetAccountStatementEml` - recommended when file should not be cached
 * @summary Get account statement as EML file with PDF attachment
 * @permission Requires `canUseGetAccountStatementEml` ability 
 * @param { string } officeId Path parameter
 * @param { DunningAccountStatementModels.OfficeInvoiceListQueryDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGetAccountStatementEml = (options?: AppMutationOptions<typeof getAccountStatementEml, { officeId: string, data: DunningAccountStatementModels.OfficeInvoiceListQueryDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningAccountStatement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGetAccountStatementEml({ officeId } ));
      return getAccountStatementEml(officeId, data)
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
