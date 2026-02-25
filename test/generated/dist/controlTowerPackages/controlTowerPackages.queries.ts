import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerPackagesModels } from "./controlTowerPackages.models";
import { ControlTowerPackagesApi } from "./controlTowerPackages.api";

export namespace ControlTowerPackagesQueries {
  export const moduleName = QueryModule.ControlTowerPackages;

  export const keys = {
    all: [moduleName] as const,
    findAll: (
      limit?: number,
      order?: string,
      filter?: ControlTowerPackagesModels.PackageFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/packages", limit, order, filter, page, cursor] as const,
    findAllInfinite: (
      limit?: number,
      order?: string,
      filter?: ControlTowerPackagesModels.PackageFilterDto,
      cursor?: string,
    ) => [...keys.all, "/packages", "infinite", limit, order, filter, cursor] as const,
  };

  /**
   * Query `useFindAll`
   * @description Lists packages
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
   * @param { ControlTowerPackagesModels.PackageFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ControlTowerPackagesModels.ControlTowerPackagesFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: ControlTowerPackagesModels.PackageFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof ControlTowerPackagesApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.findAll(limit, order, filter, page, cursor),
      queryFn: () => ControlTowerPackagesApi.findAll(limit, order, filter, page, cursor, config),
      ...options,
    });
  };

  /**
   * Infinite query `useFindAllInfinite
   * @description Lists packages
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
   * @param { ControlTowerPackagesModels.PackageFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<ControlTowerPackagesModels.ControlTowerPackagesFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAllInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: ControlTowerPackagesModels.PackageFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof ControlTowerPackagesApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useInfiniteQuery({
      queryKey: keys.findAllInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => ControlTowerPackagesApi.findAll(limit, order, filter, pageParam, cursor, config),
      initialPageParam: 1,
      getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
        const pageParam = page ?? 1;
        return pageParam * limitParam < totalItems ? pageParam + 1 : null;
      },
      ...options,
    });
  };
}
