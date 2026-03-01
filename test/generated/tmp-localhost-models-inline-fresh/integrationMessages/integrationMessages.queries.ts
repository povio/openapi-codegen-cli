import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { IntegrationMessagesAcl } from "./integrationMessages.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { IntegrationMessagesModels } from "./integrationMessages.models";

export namespace IntegrationMessagesQueries {
const list = (officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: IntegrationMessagesModels.IntegrationMessagesListResponseSchema },
    `/offices/${officeId}/integration-messages`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(IntegrationMessagesModels.IntegrationMessagesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(IntegrationMessagesModels.IntegrationMessageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


export const moduleName = QueryModule.IntegrationMessages;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-messages", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-messages", "infinite", officeId, limit, order, filter, cursor] as const,
};

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
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(IntegrationMessagesAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(IntegrationMessagesAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
