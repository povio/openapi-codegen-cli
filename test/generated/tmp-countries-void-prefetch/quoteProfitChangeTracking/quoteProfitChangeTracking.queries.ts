import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteProfitChangeTrackingAcl } from "./quoteProfitChangeTracking.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { QuoteProfitChangeTrackingApi } from "./quoteProfitChangeTracking.api";

export namespace QuoteProfitChangeTrackingQueries {
export const moduleName = QueryModule.QuoteProfitChangeTracking;

export const keys = {
    all: [moduleName] as const,
    findProfitChangeGroups: (officeId: string, quoteId: string, limit?: number, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups", officeId, quoteId, limit, page, cursor] as const,
    findProfitChangeGroupsInfinite: (officeId: string, quoteId: string, limit?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups", "infinite", officeId, quoteId, limit, cursor] as const,
    findProfitChangeGroupDetail: (groupId: string, officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups/:groupId", groupId, officeId, quoteId] as const,
};

export const findProfitChangeGroupsQueryOptions = ({ officeId, quoteId, limit, page, cursor }: { officeId: string, quoteId: string, limit: number, page?: number, cursor?: string }) => ({
  queryKey: keys.findProfitChangeGroups(officeId, quoteId, limit, page, cursor),
  queryFn: () => QuoteProfitChangeTrackingApi.findProfitChangeGroups(officeId, quoteId, limit, page, cursor),
});

/** 
 * Query `useFindProfitChangeGroups`
 * @summary List quote profit change groups
 * @permission Requires `canUseFindProfitChangeGroups` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteProfitChangeTrackingModels.QuoteProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroups = <TData>({ officeId, quoteId, limit, page, cursor }: { officeId: string, quoteId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof QuoteProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findProfitChangeGroupsQueryOptions({ officeId, quoteId, limit, page, cursor }),
    queryFn: async () => {
    checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, quoteId } ));
      return findProfitChangeGroupsQueryOptions({ officeId, quoteId, limit, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroups = (queryClient: QueryClient, { officeId, quoteId, limit, page, cursor }: { officeId: string, quoteId: string, limit: number, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findProfitChangeGroupsQueryOptions({ officeId, quoteId, limit, page, cursor }), ...options });
};

export const findProfitChangeGroupsInfiniteQueryOptions = ({ officeId, quoteId, limit, cursor }: { officeId: string, quoteId: string, limit: number, cursor?: string }) => ({
  queryKey: keys.findProfitChangeGroupsInfinite(officeId, quoteId, limit, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => QuoteProfitChangeTrackingApi.findProfitChangeGroups(officeId, quoteId, limit, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useFindProfitChangeGroupsInfinite
 * @summary List quote profit change groups
 * @permission Requires `canUseFindProfitChangeGroups` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuoteProfitChangeTrackingModels.QuoteProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupsInfinite = <TData>({ officeId, quoteId, limit, cursor }: { officeId: string, quoteId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof QuoteProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...findProfitChangeGroupsInfiniteQueryOptions({ officeId, quoteId, limit, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, quoteId } ));
      return findProfitChangeGroupsInfiniteQueryOptions({ officeId, quoteId, limit, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroupsInfinite = (queryClient: QueryClient, { officeId, quoteId, limit, cursor }: { officeId: string, quoteId: string, limit: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...findProfitChangeGroupsInfiniteQueryOptions({ officeId, quoteId, limit, cursor }), ...options });
};

export const findProfitChangeGroupDetailQueryOptions = ({ groupId, officeId, quoteId }: { groupId: string, officeId: string, quoteId: string }) => ({
  queryKey: keys.findProfitChangeGroupDetail(groupId, officeId, quoteId),
  queryFn: () => QuoteProfitChangeTrackingApi.findProfitChangeGroupDetail(groupId, officeId, quoteId),
});

/** 
 * Query `useFindProfitChangeGroupDetail`
 * @summary Get quote profit change group details
 * @permission Requires `canUseFindProfitChangeGroupDetail` ability 
 * @param { string } groupId Path parameter
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDetailDto> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupDetail = <TData>({ groupId, officeId, quoteId }: { groupId: string, officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteProfitChangeTrackingApi.findProfitChangeGroupDetail, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findProfitChangeGroupDetailQueryOptions({ groupId, officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail({ officeId, quoteId } ));
      return findProfitChangeGroupDetailQueryOptions({ groupId, officeId, quoteId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroupDetail = (queryClient: QueryClient, { groupId, officeId, quoteId }: { groupId: string, officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findProfitChangeGroupDetailQueryOptions({ groupId, officeId, quoteId }), ...options });
};

}
