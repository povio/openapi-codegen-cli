import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningPartnerOutstandingInvoicesAcl } from "./dunningPartnerOutstandingInvoices.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningPartnerOutstandingInvoicesModels } from "./dunningPartnerOutstandingInvoices.models";
import { DunningPartnerOutstandingInvoicesApi } from "./dunningPartnerOutstandingInvoices.api";

export namespace DunningPartnerOutstandingInvoicesQueries {
export const moduleName = QueryModule.DunningPartnerOutstandingInvoices;

export const keys = {
    all: [moduleName] as const,
    listPartnerOutstandingInvoiceSummaries: (officeId: string, limit?: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/partner-outstanding-invoices", officeId, limit, order, filter, page, cursor] as const,
    listPartnerOutstandingInvoiceSummariesInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/partner-outstanding-invoices", "infinite", officeId, limit, order, filter, cursor] as const,
    listPartnerOutstandingInvoices: (partnerId: string, officeId: string, limit?: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/partners/:partnerId/outstanding-invoices", partnerId, officeId, limit, order, filter, page, cursor] as const,
    listPartnerOutstandingInvoicesInfinite: (partnerId: string, officeId: string, limit?: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/partners/:partnerId/outstanding-invoices", "infinite", partnerId, officeId, limit, order, filter, cursor] as const,
};

const listPartnerOutstandingInvoiceSummariesQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.listPartnerOutstandingInvoiceSummaries(officeId, limit, order, filter, page, cursor),
  queryFn: () => DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useListPartnerOutstandingInvoiceSummaries`
 * @summary List office outstanding invoice summaries per partner
 * @permission Requires `canUseListPartnerOutstandingInvoiceSummaries` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): outstandingAmount, daysOverdue, lastDunningDate, invoiceCount, partnerCountry, partnerName, dunningSystemName. Example: `outstandingAmount`
 * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListPartnerOutstandingInvoiceSummaries = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listPartnerOutstandingInvoiceSummariesQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoiceSummaries({ officeId } ));
      return listPartnerOutstandingInvoiceSummariesQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchListPartnerOutstandingInvoiceSummaries = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listPartnerOutstandingInvoiceSummariesQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const listPartnerOutstandingInvoiceSummariesInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, cursor?: string }) => ({
  queryKey: keys.listPartnerOutstandingInvoiceSummariesInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListPartnerOutstandingInvoiceSummariesInfinite
 * @summary List office outstanding invoice summaries per partner
 * @permission Requires `canUseListPartnerOutstandingInvoiceSummaries` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): outstandingAmount, daysOverdue, lastDunningDate, invoiceCount, partnerCountry, partnerName, dunningSystemName. Example: `outstandingAmount`
 * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListPartnerOutstandingInvoiceSummariesInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listPartnerOutstandingInvoiceSummariesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoiceSummaries({ officeId } ));
      return listPartnerOutstandingInvoiceSummariesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListPartnerOutstandingInvoiceSummariesInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listPartnerOutstandingInvoiceSummariesInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

const listPartnerOutstandingInvoicesQueryOptions = ({ partnerId, officeId, limit, order, filter, page, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.listPartnerOutstandingInvoices(partnerId, officeId, limit, order, filter, page, cursor),
  queryFn: () => DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices(partnerId, officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useListPartnerOutstandingInvoices`
 * @summary List outstanding invoices for a specific partner
 * @permission Requires `canUseListPartnerOutstandingInvoices` ability 
 * @param { string } partnerId Path parameter
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): dueDate, invoiceDate, owedAmount. Example: `dueDate`
 * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListPartnerOutstandingInvoices = <TData>({ partnerId, officeId, limit, order, filter, page, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listPartnerOutstandingInvoicesQueryOptions({ partnerId, officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoices({ officeId } ));
      return listPartnerOutstandingInvoicesQueryOptions({ partnerId, officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchListPartnerOutstandingInvoices = (queryClient: QueryClient, { partnerId, officeId, limit, order, filter, page, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listPartnerOutstandingInvoicesQueryOptions({ partnerId, officeId, limit, order, filter, page, cursor }), ...options });
};

const listPartnerOutstandingInvoicesInfiniteQueryOptions = ({ partnerId, officeId, limit, order, filter, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, cursor?: string }) => ({
  queryKey: keys.listPartnerOutstandingInvoicesInfinite(partnerId, officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices(partnerId, officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListPartnerOutstandingInvoicesInfinite
 * @summary List outstanding invoices for a specific partner
 * @permission Requires `canUseListPartnerOutstandingInvoices` ability 
 * @param { string } partnerId Path parameter
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): dueDate, invoiceDate, owedAmount. Example: `dueDate`
 * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListPartnerOutstandingInvoicesInfinite = <TData>({ partnerId, officeId, limit, order, filter, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listPartnerOutstandingInvoicesInfiniteQueryOptions({ partnerId, officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoices({ officeId } ));
      return listPartnerOutstandingInvoicesInfiniteQueryOptions({ partnerId, officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListPartnerOutstandingInvoicesInfinite = (queryClient: QueryClient, { partnerId, officeId, limit, order, filter, cursor }: { partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listPartnerOutstandingInvoicesInfiniteQueryOptions({ partnerId, officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useListRecommendedDunningLevels`
 * @summary List recommended dunning levels for a partner
 * @permission Requires `canUseListRecommendedDunningLevels` ability 
 * @param { string } partnerId Path parameter
 * @param { string } officeId Path parameter
 * @param { DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningPartnerOutstandingInvoicesModels.ListRecommendedDunningLevelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRecommendedDunningLevels = (options?: AppMutationOptions<typeof DunningPartnerOutstandingInvoicesApi.listRecommendedDunningLevels, { partnerId: string, officeId: string, data: DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningPartnerOutstandingInvoices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ partnerId, officeId, data }) => { 
      checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListRecommendedDunningLevels({ officeId } ));
      return DunningPartnerOutstandingInvoicesApi.listRecommendedDunningLevels(partnerId, officeId, data)
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
