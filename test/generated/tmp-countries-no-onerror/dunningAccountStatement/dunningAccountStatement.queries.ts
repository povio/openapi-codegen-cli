import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningAccountStatementAcl } from "./dunningAccountStatement.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { DunningAccountStatementModels } from "./dunningAccountStatement.models";
import { DunningAccountStatementApi } from "./dunningAccountStatement.api";

export namespace DunningAccountStatementQueries {
export const moduleName = QueryModule.DunningAccountStatement;

export const keys = {
    all: [moduleName] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake/account-statement", ] as const,
    generateAccountStatement: (officeId: string, limit?: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", officeId, limit, order, filter, page, cursor] as const,
    generateAccountStatementInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/invoices/account-statement", "infinite", officeId, limit, order, filter, cursor] as const,
};

export const dataGenFakeQueryOptions = () => ({
  queryKey: keys.dataGenFake(),
  queryFn: () => DunningAccountStatementApi.dataGenFake(),
});

/** 
 * Query `useDataGenFake`
 * @summary Expose account statement PDF payload DTO for model generation
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningAccountStatementModels.AccountStatementPdfPayloadDTO> } 
 * @statusCodes [200, 401]
 */
export const useDataGenFake = <TData>(options?: AppQueryOptions<typeof DunningAccountStatementApi.dataGenFake, TData>) => {
  
  return useQuery({
    ...dataGenFakeQueryOptions(),
    ...options,
  });
};

export const prefetchDataGenFake = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...dataGenFakeQueryOptions(), ...options });
};

export const generateAccountStatementQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.generateAccountStatement(officeId, limit, order, filter, page, cursor),
  queryFn: () => DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, page, cursor),
});

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
export const useGenerateAccountStatement = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DunningAccountStatementApi.generateAccountStatement, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...generateAccountStatementQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
      return generateAccountStatementQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchGenerateAccountStatement = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...generateAccountStatementQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
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
export const useGenerateAccountStatementMutation = (options?: AppMutationOptions<typeof DunningAccountStatementApi.generateAccountStatement, { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningAccountStatement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, limit, order, filter, page, cursor }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
      return DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, page, cursor)
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

export const generateAccountStatementInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string }) => ({
  queryKey: keys.generateAccountStatementInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DunningAccountStatementApi.generateAccountStatement(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const useGenerateAccountStatementInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DunningAccountStatementApi.generateAccountStatement, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...generateAccountStatementInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningAccountStatementAcl.canUseGenerateAccountStatement({ officeId } ));
      return generateAccountStatementInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchGenerateAccountStatementInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...generateAccountStatementInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
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
export const useGetAccountStatementEml = (options?: AppMutationOptions<typeof DunningAccountStatementApi.getAccountStatementEml, { officeId: string, data: DunningAccountStatementModels.OfficeInvoiceListQueryDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningAccountStatement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(DunningAccountStatementAcl.canUseGetAccountStatementEml({ officeId } ));
      return DunningAccountStatementApi.getAccountStatementEml(officeId, data)
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
