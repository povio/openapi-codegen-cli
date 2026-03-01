import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmployeePermissionsAcl } from "./employeePermissions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { EmployeePermissionsModels } from "./employeePermissions.models";

export namespace EmployeePermissionsQueries {
const paginatePermissions = (limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponseSchema },
    `/employees/permissions`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(EmployeePermissionsModels.EmployeePermissionFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findAll = (search?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeePermissionsModels.EmployeePermissionsFindAllResponseSchema },
    `/employees/permissions/labels`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
      },
    }
  );
};


export const moduleName = QueryModule.EmployeePermissions;

export const keys = {
    all: [moduleName] as const,
    paginatePermissions: (limit?: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/permissions", limit, order, filter, page, cursor] as const,
    paginatePermissionsInfinite: (limit?: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string) => [...keys.all, "/employees/permissions", "infinite", limit, order, filter, cursor] as const,
    findAll: (search?: string) => [...keys.all, "/employees/permissions/labels", search] as const,
};

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
export const usePaginatePermissions = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginatePermissions(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
    return paginatePermissions(limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginatePermissionsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginatePermissionsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmployeePermissionsAcl.canUsePaginatePermissions());
    return paginatePermissions(limit, order, filter, pageParam, cursor) },
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
 * @param { string } search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeePermissionsModels.EmployeePermissionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(search),
    queryFn: () => { 
    checkAcl(EmployeePermissionsAcl.canUseFindAll());
    return findAll(search) },
    ...options,
  });
};

}
