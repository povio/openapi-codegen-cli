import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionProfitChangeTrackingAcl } from "./positionProfitChangeTracking.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
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

export const findProfitChangeGroupsQueryOptions = ({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor),
  queryFn: () => PositionProfitChangeTrackingApi.findProfitChangeGroups(officeId, positionId, limit, order, filter, page, cursor),
});

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
export const useFindProfitChangeGroups = <TData>({ officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findProfitChangeGroupsQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
      return findProfitChangeGroupsQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroups = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, page, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findProfitChangeGroupsQueryOptions({ officeId, positionId, limit, order, filter, page, cursor }), ...options });
};

export const findProfitChangeGroupsInfiniteQueryOptions = ({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string }) => ({
  queryKey: keys.findProfitChangeGroupsInfinite(officeId, positionId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => PositionProfitChangeTrackingApi.findProfitChangeGroups(officeId, positionId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const useFindProfitChangeGroupsInfinite = <TData>({ officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroups, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...findProfitChangeGroupsInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups({ officeId, positionId } ));
      return findProfitChangeGroupsInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroupsInfinite = (queryClient: QueryClient, { officeId, positionId, limit, order, filter, cursor }: { officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...findProfitChangeGroupsInfiniteQueryOptions({ officeId, positionId, limit, order, filter, cursor }), ...options });
};

export const findProfitChangeGroupDetailQueryOptions = ({ groupId, officeId, positionId }: { groupId: string, officeId: string, positionId: string }) => ({
  queryKey: keys.findProfitChangeGroupDetail(groupId, officeId, positionId),
  queryFn: () => PositionProfitChangeTrackingApi.findProfitChangeGroupDetail(groupId, officeId, positionId),
});

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
export const useFindProfitChangeGroupDetail = <TData>({ groupId, officeId, positionId }: { groupId: string, officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionProfitChangeTrackingApi.findProfitChangeGroupDetail, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findProfitChangeGroupDetailQueryOptions({ groupId, officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail({ officeId, positionId } ));
      return findProfitChangeGroupDetailQueryOptions({ groupId, officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindProfitChangeGroupDetail = (queryClient: QueryClient, { groupId, officeId, positionId }: { groupId: string, officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findProfitChangeGroupDetailQueryOptions({ groupId, officeId, positionId }), ...options });
};

}
