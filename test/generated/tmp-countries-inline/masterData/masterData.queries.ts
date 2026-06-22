import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
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

export const findAllQueryOptions = ({ officeId, types, search }: { officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string }) => ({
  queryKey: keys.findAll(officeId, types, search),
  queryFn: () => findAll(officeId, types, search),
});

/** 
 * Query `useFindAll`
 * @summary List master data based on provided type
 * @permission Requires `canUseFindAll` ability 
 * @param { string } officeId Path parameter
 * @param { MasterDataModels.MasterDataFindAllTypesParam } types Query parameter
 * @param { string } search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataModels.MasterDataItemsResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ officeId, types, search }: { officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findAllQueryOptions({ officeId, types, search }),
    queryFn: async () => {
    checkAcl(MasterDataAcl.canUseFindAll());
      return findAllQueryOptions({ officeId, types, search }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { officeId, types, search }: { officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findAllQueryOptions({ officeId, types, search }), ...options });
};

export const paginateQueryOptions = ({ officeId, types, limit, search, page, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, types, limit, search, page, cursor),
  queryFn: () => paginate(officeId, types, limit, search, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate master data based on provided type
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { MasterDataModels.MasterDataPaginateTypesParam } types Query parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } search Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataModels.MasterDataPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, types, limit, search, page, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, types, limit, search, page, cursor }),
    queryFn: async () => {
    checkAcl(MasterDataAcl.canUsePaginate());
      return paginateQueryOptions({ officeId, types, limit, search, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { officeId, types, limit, search, page, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginateQueryOptions({ officeId, types, limit, search, page, cursor }), ...options });
};

export const paginateInfiniteQueryOptions = ({ officeId, types, limit, search, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, types, limit, search, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => paginate(officeId, types, limit, search, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate master data based on provided type
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { MasterDataModels.MasterDataPaginateTypesParam } types Query parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } search Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<MasterDataModels.MasterDataPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, types, limit, search, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, types, limit, search, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(MasterDataAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ officeId, types, limit, search, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { officeId, types, limit, search, cursor }: { officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ officeId, types, limit, search, cursor }), ...options });
};

}
