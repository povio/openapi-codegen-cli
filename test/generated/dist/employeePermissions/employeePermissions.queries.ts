import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmployeePermissionsAcl } from "./employeePermissions.acl";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { EmployeePermissionsModels } from "./employeePermissions.models";
import { EmployeePermissionsApi } from "./employeePermissions.api";

export namespace EmployeePermissionsQueries {
  export const moduleName = QueryModule.EmployeePermissions;

  export const keys = {
    all: [moduleName] as const,
    paginatePermissions: (
      limit?: number,
      order?: string,
      filter?: EmployeePermissionsModels.EmployeePermissionFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/employees/permissions", limit, order, filter, page, cursor] as const,
    paginatePermissionsInfinite: (
      limit?: number,
      order?: string,
      filter?: EmployeePermissionsModels.EmployeePermissionFilterDto,
      cursor?: string,
    ) => [...keys.all, "/employees/permissions", "infinite", limit, order, filter, cursor] as const,
    findAll: (search?: string) => [...keys.all, "/employees/permissions/labels", search] as const,
  };

  /**
   * Query `usePaginatePermissions`
   * @permission Requires `canUsePaginatePermissions` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): id. Example: `id`
   * @param { EmployeePermissionsModels.EmployeePermissionFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginatePermissions = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: EmployeePermissionsModels.EmployeePermissionFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof EmployeePermissionsApi.paginatePermissions, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginatePermissions(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
        return EmployeePermissionsApi.paginatePermissions(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginatePermissionsInfinite
   * @permission Requires `canUsePaginatePermissions` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): id. Example: `id`
   * @param { EmployeePermissionsModels.EmployeePermissionFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginatePermissionsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: EmployeePermissionsModels.EmployeePermissionFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof EmployeePermissionsApi.paginatePermissions, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginatePermissionsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
        return EmployeePermissionsApi.paginatePermissions(limit, order, filter, pageParam, cursor, config);
      },
      initialPageParam: 1,
      getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
        const pageParam = page ?? 1;
        return pageParam * limitParam < totalItems ? pageParam + 1 : null;
      },
      ...options,
    });
  };

  /**
   * Query `useFindAll`
   * @summary List all permissions with only their labels
   * @permission Requires `canUseFindAll` ability
   * @param { string } object.search Query parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<EmployeePermissionsModels.EmployeePermissionsFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(
    { search }: { search?: string },
    options?: AppQueryOptions<typeof EmployeePermissionsApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findAll(search),
      queryFn: () => {
        checkAcl(EmployeePermissionsAcl.canUseFindAll());
        return EmployeePermissionsApi.findAll(search, config);
      },
      ...options,
    });
  };
}
