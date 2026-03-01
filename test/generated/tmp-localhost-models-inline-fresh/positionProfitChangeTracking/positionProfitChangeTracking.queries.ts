import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionProfitChangeTrackingAcl } from "./positionProfitChangeTracking.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { PositionProfitChangeTrackingModels } from "./positionProfitChangeTracking.models";

export namespace PositionProfitChangeTrackingQueries {
const findProfitChangeGroups = (officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema },
    `/offices/${officeId}/positions/${positionId}/account/profit-change-groups`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findProfitChangeGroupDetail = (groupId: string, officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDtoSchema },
    `/offices/${officeId}/positions/${positionId}/account/profit-change-groups/${groupId}`,
    
  );
};


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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): timestamp, profitAmount, changeCount. Example: `timestamp`
 * @param { PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroups = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
    return findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindProfitChangeGroupsInfinite
 * @summary List position profit change groups
 * @permission Requires `canUseFindProfitChangeGroups` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): timestamp, profitAmount, changeCount. Example: `timestamp`
 * @param { PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupsInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findProfitChangeGroupsInfinite(officeId, positionId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
    return findProfitChangeGroups(officeId, positionId, limit, order, filter, pageParam, cursor) },
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
 * @param { string } groupId Path parameter
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDto> } 
 * @statusCodes [200, 401]
 */
export const useFindProfitChangeGroupDetail = <TData>({ groupId, officeId, positionId }: { groupId: string, officeId: string, positionId: string }, options?: AppQueryOptions<typeof findProfitChangeGroupDetail, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findProfitChangeGroupDetail(groupId, officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail({ officeId, positionId } ));
    return findProfitChangeGroupDetail(groupId, officeId, positionId) },
    ...options,
  });
};

}
