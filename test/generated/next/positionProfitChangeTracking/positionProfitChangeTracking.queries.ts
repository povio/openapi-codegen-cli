import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionProfitChangeTrackingAcl } from "./positionProfitChangeTracking.acl";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { PositionProfitChangeTrackingModels } from "./positionProfitChangeTracking.models";
import { PositionProfitChangeTrackingApi } from "./positionProfitChangeTracking.api";

export namespace PositionProfitChangeTrackingQueries {
export const moduleName = QueryModule.PositionProfitChangeTracking;

export const keys = {
    all: [moduleName] as const,
    findProfitChangeGroups: (officeId: string, positionId: string, limit?: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/account/profit-change-groups", officeId, positionId, limit, order, filter, page, cursor] as const,
    findProfitChangeGroupsInfinite: (officeId: string, positionId: string, limit?: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/account/profit-change-groups", "infinite", officeId, positionId, limit, order, filter, cursor] as const,
    findProfitChangeGroupDetail: (groupId: string, officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/account/profit-change-groups/:groupId", groupId, officeId, positionId] as const,
};

/** 
 * Query `useFindProfitChangeGroups`
 * @summary List position profit change groups
 * @permission Requires `canUseFindProfitChangeGroups` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): timestamp, profitAmount, changeCount. Example: `timestamp`
 * @param { PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroups = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
    return PositionProfitChangeTrackingApi.findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindProfitChangeGroupsInfinite
 * @summary List position profit change groups
 * @permission Requires `canUseFindProfitChangeGroups` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): timestamp, profitAmount, changeCount. Example: `timestamp`
 * @param { PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupsInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findProfitChangeGroupsInfinite(officeId, positionId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
    return PositionProfitChangeTrackingApi.findProfitChangeGroups(officeId, positionId, limit, order, filter, pageParam, cursor) },
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
 * @summary Get position profit change group details
 * @permission Requires `canUseFindProfitChangeGroupDetail` ability 
 * @param { string } object.groupId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDto> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupDetail = <TData>({ groupId, officeId, positionId }: { groupId: string, officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroupDetail, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroupDetail(groupId, officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail({ officeId, positionId } ));
    return PositionProfitChangeTrackingApi.findProfitChangeGroupDetail(groupId, officeId, positionId) },
    ...options,
  });
};

}
