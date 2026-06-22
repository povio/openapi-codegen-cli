import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { EmployeePermissionsAcl } from "./employeePermissions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { EmployeePermissionsModels } from "./employeePermissions.models";
import { EmployeePermissionsApi } from "./employeePermissions.api";

export namespace EmployeePermissionsQueries {
export const moduleName = QueryModule.EmployeePermissions;

export const keys = {
    all: [moduleName] as const,
    paginatePermissions: (limit?: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/permissions", limit, order, filter, page, cursor] as const,
    paginatePermissionsInfinite: (limit?: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string) => [...keys.all, "/employees/permissions", "infinite", limit, order, filter, cursor] as const,
    findAll: (search?: string) => [...keys.all, "/employees/permissions/labels", search] as const,
};

export const paginatePermissionsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginatePermissions(limit, order, filter, page, cursor),
  queryFn: () => EmployeePermissionsApi.paginatePermissions(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginatePermissions`
 * @permission Requires `canUsePaginatePermissions` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): id. Example: `id`
 * @param { EmployeePermissionsModels.EmployeePermissionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginatePermissions = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmployeePermissionsApi.paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginatePermissionsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
      return paginatePermissionsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginatePermissions = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginatePermissionsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const paginatePermissionsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string }) => ({
  queryKey: keys.paginatePermissionsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => EmployeePermissionsApi.paginatePermissions(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginatePermissionsInfinite
 * @permission Requires `canUsePaginatePermissions` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): id. Example: `id`
 * @param { EmployeePermissionsModels.EmployeePermissionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginatePermissionsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmployeePermissionsApi.paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginatePermissionsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
      return paginatePermissionsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginatePermissionsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginatePermissionsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

export const findAllQueryOptions = ({ search }: { search?: string }) => ({
  queryKey: keys.findAll(search),
  queryFn: () => EmployeePermissionsApi.findAll(search),
});

/** 
 * Query `useFindAll`
 * @summary List all permissions with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeePermissionsModels.EmployeePermissionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof EmployeePermissionsApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findAllQueryOptions({ search }),
    queryFn: async () => {
    checkAcl(EmployeePermissionsAcl.canUseFindAll());
      return findAllQueryOptions({ search }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { search }: { search?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findAllQueryOptions({ search }), ...options });
};

}
