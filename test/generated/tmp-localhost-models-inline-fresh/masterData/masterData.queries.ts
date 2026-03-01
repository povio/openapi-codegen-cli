import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { MasterDataAcl } from "./masterData.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { MasterDataModels } from "./masterData.models";

export namespace MasterDataQueries {
const findAll = (officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string) => {
  return AppRestClient.get(
    { resSchema: MasterDataModels.MasterDataItemsResponseDTOSchema },
    `/offices/${officeId}/master-data/autocomplete`,
    {
      params: {
        types: ZodExtended.parse(MasterDataModels.MasterDataFindAllTypesParamSchema, types, { type: "query", name: "types" }),
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
      },
    }
  );
};

const paginate = (officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: MasterDataModels.MasterDataPaginateResponseSchema },
    `/offices/${officeId}/master-data/labels/paginated`,
    {
      params: {
        types: ZodExtended.parse(MasterDataModels.MasterDataPaginateTypesParamSchema, types, { type: "query", name: "types" }),
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


export const moduleName = QueryModule.MasterData;

export const keys = {
    all: [moduleName] as const,
    findAll: (officeId: string, types?: MasterDataModels.MasterDataFindAllTypesParam, search?: string) => [...keys.all, "/offices/:officeId/master-data/autocomplete", officeId, types, search] as const,
    paginate: (officeId: string, types?: MasterDataModels.MasterDataPaginateTypesParam, limit?: number, search?: string, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/master-data/labels/paginated", officeId, types, limit, search, page, cursor] as const,
    paginateInfinite: (officeId: string, types?: MasterDataModels.MasterDataPaginateTypesParam, limit?: number, search?: string, cursor?: string) => [...keys.all, "/offices/:officeId/master-data/labels/paginated", "infinite", officeId, types, limit, search, cursor] as const,
};

/** 
 * Query `useFindAll`
 * @summary List master data based on provided type
 * @permission Requires `canUseFindAll` ability 
 * @param { string } object.officeId Path parameter
 * @param { MasterDataModels.MasterDataFindAllTypesParam } object.types Query parameter
 * @param { string } object.search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataModels.MasterDataItemsResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ officeId, types, search }: { officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(officeId, types, search),
    queryFn: () => { 
    checkAcl(MasterDataAcl.canUseFindAll());
    return findAll(officeId, types, search) },
    ...options,
  });
};

/** 
 * Query `usePaginate`
 * @summary Paginate master data based on provided type
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { MasterDataModels.MasterDataPaginateTypesParam } object.types Query parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.search Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataModels.MasterDataPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, types, limit, search, page, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, types, limit, search, page, cursor),
    queryFn: () => { 
    checkAcl(MasterDataAcl.canUsePaginate());
    return paginate(officeId, types, limit, search, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate master data based on provided type
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { MasterDataModels.MasterDataPaginateTypesParam } object.types Query parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.search Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<MasterDataModels.MasterDataPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, types, limit, search, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, types, limit, search, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(MasterDataAcl.canUsePaginate());
    return paginate(officeId, types, limit, search, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
