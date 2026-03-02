import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerPackagesModels } from "./controlTowerPackages.models";

export namespace ControlTowerPackagesQueries {
const findAll = (limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerPackagesModels.ControlTowerPackagesFindAllResponseSchema },
    `/packages`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerPackagesModels.ControlTowerPackagesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ControlTowerPackagesModels.PackageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


export const moduleName = QueryModule.ControlTowerPackages;

export const keys = {
    all: [moduleName] as const,
    findAll: (limit?: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string) => [...keys.all, "/packages", limit, order, filter, page, cursor] as const,
    findAllInfinite: (limit?: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, cursor?: string) => [...keys.all, "/packages", "infinite", limit, order, filter, cursor] as const,
};

export const findAllQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.findAll(limit, order, filter, page, cursor),
  queryFn: () => findAll(limit, order, filter, page, cursor),
});

/** 
 * Query `useFindAll`
 * @description Lists packages
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerPackagesModels.PackageFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerPackagesModels.ControlTowerPackagesFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...findAllQueryOptions({ limit, order, filter, page, cursor }),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findAllQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const findAllInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, cursor?: string }) => ({
  queryKey: keys.findAllInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => findAll(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useFindAllInfinite
 * @description Lists packages
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerPackagesModels.PackageFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ControlTowerPackagesModels.ControlTowerPackagesFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    ...findAllInfiniteQueryOptions({ limit, order, filter, cursor }),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAllInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...findAllInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

}
