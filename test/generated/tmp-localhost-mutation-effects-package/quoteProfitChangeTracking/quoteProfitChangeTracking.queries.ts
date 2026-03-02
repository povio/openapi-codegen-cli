import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteProfitChangeTrackingAcl } from "./quoteProfitChangeTracking.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { QuoteProfitChangeTrackingModels } from "./quoteProfitChangeTracking.models";

export namespace QuoteProfitChangeTrackingQueries {
const findProfitChangeGroups = (officeId: string, quoteId: string, limit: number, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: QuoteProfitChangeTrackingModels.QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups`,
    {
      params: {
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findProfitChangeGroupDetail = (groupId: string, officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDetailDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups/${groupId}`,
    
  );
};


export const moduleName = QueryModule.QuoteProfitChangeTracking;

export const keys = {
    all: [moduleName] as const,
    findProfitChangeGroups: (officeId: string, quoteId: string, limit?: number, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups", officeId, quoteId, limit, page, cursor] as const,
    findProfitChangeGroupsInfinite: (officeId: string, quoteId: string, limit?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups", "infinite", officeId, quoteId, limit, cursor] as const,
    findProfitChangeGroupDetail: (groupId: string, officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account/profit-change-groups/:groupId", groupId, officeId, quoteId] as const,
};

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
export const useFindProfitChangeGroups = <TData>({ officeId, quoteId, limit, page, cursor }: { officeId: string, quoteId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findProfitChangeGroups, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroups(officeId, quoteId, limit, page, cursor),
    queryFn: () => { 
    checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, quoteId } ));
    return findProfitChangeGroups(officeId, quoteId, limit, page, cursor) },
    ...options,
  });
};

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
export const useFindProfitChangeGroupsInfinite = <TData>({ officeId, quoteId, limit, cursor }: { officeId: string, quoteId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findProfitChangeGroups, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findProfitChangeGroupsInfinite(officeId, quoteId, limit, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, quoteId } ));
    return findProfitChangeGroups(officeId, quoteId, limit, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

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
export const useFindProfitChangeGroupDetail = <TData>({ groupId, officeId, quoteId }: { groupId: string, officeId: string, quoteId: string }, options?: AppQueryOptions<typeof findProfitChangeGroupDetail, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroupDetail(groupId, officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail({ officeId, quoteId } ));
    return findProfitChangeGroupDetail(groupId, officeId, quoteId) },
    ...options,
  });
};

}
