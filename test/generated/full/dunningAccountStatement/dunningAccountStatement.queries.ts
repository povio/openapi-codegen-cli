import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { DunningAccountStatementAcl } from "./dunningAccountStatement.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { DunningAccountStatementModels } from "./dunningAccountStatement.models";
import { DunningAccountStatementApi } from "./dunningAccountStatement.api";

export namespace DunningAccountStatementQueries {
export const moduleName = QueryModule.DunningAccountStatement;

export const keys = {
    all: [moduleName] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake/account-statement", ] as const,
    generateAccountStatement: (officeId: string, limit?: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", officeId, limit, order, filter, page, cursor] as const,
    generateAccountStatementInfinite: (officeId: string, limit?: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", "infinite", officeId, limit, order, filter, cursor] as const,
};

/** 
 * Query `useDataGenFake`
 * @summary Expose account statement PDF payload DTO for model generation
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningAccountStatementModels.AccountStatementPdfPayloadDTO> } 
 * @statusCodes [200, 401]
 */
export const useDataGenFake = <TData>(options?: AppQueryOptions<typeof DunningAccountStatementApi.dataGenFake, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.dataGenFake(),
    queryFn: () => 
    DunningAccountStatementApi.dataGenFake(config),
    ...options,
  });
};

/** 
 * Query `useGenerateAccountStatement` - recommended when file should be cached
 * @summary Generate account statement PDF from filtered office invoices
 * @permission Requires `canUseGenerateAccountStatement` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { CommonModels.OfficeInvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatement = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DunningAccountStatementApi.generateAccountStatement, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.generateAccountStatement(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
    return DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Mutation `useGenerateAccountStatementMutation` - recommended when file should not be cached
 * @summary Generate account statement PDF from filtered office invoices
 * @permission Requires `canUseGenerateAccountStatement` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { number } mutation.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } mutation.order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { CommonModels.OfficeInvoiceFilterDto } mutation.filter Query parameter
 * @param { number } mutation.page Query parameter. 1-indexed page number to begin from
 * @param { string } mutation.cursor Query parameter. ID of item to start after
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatementMutation = (options?: AppMutationOptions<typeof DunningAccountStatementApi.generateAccountStatement, { officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, limit, order, filter, page, cursor }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
      return DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, page, cursor, config)
    },
    ...options,
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
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber`
 * @param { CommonModels.OfficeInvoiceFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<z.instanceof(Blob)> } 
 * @statusCodes [200, 401]
 */
export const useGenerateAccountStatementInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DunningAccountStatementApi.generateAccountStatement, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.generateAccountStatementInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
    return DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, pageParam, cursor, config) },
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
 * @param { string } mutation.officeId Path parameter
 * @param { DunningAccountStatementModels.OfficeInvoiceListQueryDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGetAccountStatementEml = (options?: AppMutationOptions<typeof DunningAccountStatementApi.getAccountStatementEml, { officeId: string, data: DunningAccountStatementModels.OfficeInvoiceListQueryDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGetAccountStatementEml({ officeId } ));
      return DunningAccountStatementApi.getAccountStatementEml(officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
