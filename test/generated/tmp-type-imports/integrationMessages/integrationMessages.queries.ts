import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { IntegrationMessagesAcl } from "./integrationMessages.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { IntegrationMessagesModels } from "./integrationMessages.models";
import { IntegrationMessagesApi } from "./integrationMessages.api";

export namespace IntegrationMessagesQueries {
export const moduleName = QueryModule.IntegrationMessages;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-messages", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-messages", "infinite", officeId, limit, order, filter, cursor] as const,
};

const listQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(officeId, limit, order, filter, page, cursor),
  queryFn: () => IntegrationMessagesApi.list(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary Paginate integration messages
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, direction, format, integrationChannel, positionNumber. Example: `createdAt`
 * @param { IntegrationMessagesModels.IntegrationMessageFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationMessagesModels.IntegrationMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof IntegrationMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(IntegrationMessagesAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const listInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => IntegrationMessagesApi.list(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary Paginate integration messages
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, direction, format, integrationChannel, positionNumber. Example: `createdAt`
 * @param { IntegrationMessagesModels.IntegrationMessageFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<IntegrationMessagesModels.IntegrationMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof IntegrationMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(IntegrationMessagesAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

}
