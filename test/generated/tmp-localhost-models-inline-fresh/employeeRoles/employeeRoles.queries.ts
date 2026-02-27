import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmployeeRolesAcl } from "./employeeRoles.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeRolesModels } from "./employeeRoles.models";

export namespace EmployeeRolesQueries {
const list = (limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeRolesModels.EmployeeRolesListResponseSchema },
    `/employees/roles`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(EmployeeRolesModels.EmployeeRolesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(EmployeeRolesModels.EmployeeRolePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: EmployeeRolesModels.EmployeeRoleCreateRequest) => {
  return AppRestClient.post(
    { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
    `/employees/roles`,
    ZodExtended.parse(EmployeeRolesModels.EmployeeRoleCreateRequestSchema, data),
    
  );
};

const labels = (search?: string, context?: EmployeeRolesModels.EmployeeRoleContext) => {
  return AppRestClient.get(
    { resSchema: EmployeeRolesModels.LabelsResponseSchema },
    `/employees/roles/labels`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        context: ZodExtended.parse(EmployeeRolesModels.EmployeeRoleContextSchema.optional(), context, { type: "query", name: "context" }),
      },
    }
  );
};

const find = (roleId: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
    `/employees/roles/${roleId}`,
    
  );
};

const update = (roleId: string, data: EmployeeRolesModels.EmployeeRoleUpdateRequest) => {
  return AppRestClient.put(
    { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
    `/employees/roles/${roleId}`,
    ZodExtended.parse(EmployeeRolesModels.EmployeeRoleUpdateRequestSchema, data),
    
  );
};

const deleteEmployeesRolesByRoleId = (roleId: string) => {
  return AppRestClient.delete(
    { resSchema: EmployeeRolesModels.StatusResponseDtoSchema },
    `/employees/roles/${roleId}`,
    
  );
};

const paginatePermissions = (roleId: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeRolesModels.EmployeeRolesPaginatePermissionsResponseSchema },
    `/employees/roles/${roleId}/permissions`,
    
  );
};

const togglePermission = (roleId: string, permission: string, data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/employees/roles/${roleId}/permissions/${permission}/toggle`,
    ZodExtended.parse(EmployeeRolesModels.EmployeeRoleTogglePermissionRequestSchema, data),
    
  );
};

const copy = (roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto) => {
  return AppRestClient.post(
    { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
    `/employees/roles/${roleId}/copy`,
    ZodExtended.parse(EmployeeRolesModels.CopyEmployeeRoleDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.EmployeeRoles;

export const keys = {
    all: [moduleName] as const,
    list: (limit?: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/roles", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string) => [...keys.all, "/employees/roles", "infinite", limit, order, filter, cursor] as const,
    labels: (search?: string, context?: CommonModels.EmployeeRoleContext) => [...keys.all, "/employees/roles/labels", search, context] as const,
    find: (roleId: string) => [...keys.all, "/employees/roles/:roleId", roleId] as const,
    paginatePermissions: (roleId: string) => [...keys.all, "/employees/roles/:roleId/permissions", roleId] as const,
};

/** 
 * Query `useList`
 * @summary Paginate Employee Role Definitions
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, numberOfUsers. Example: `name`
 * @param { EmployeeRolesModels.EmployeeRolePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.EmployeeRolesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseList());
    return list(limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary Paginate Employee Role Definitions
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, numberOfUsers. Example: `name`
 * @param { EmployeeRolesModels.EmployeeRolePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeRolesModels.EmployeeRolesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmployeeRolesAcl.canUseList());
    return list(limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create Employee Role Definition
 * @permission Requires `canUseCreate` ability 
 * @param { EmployeeRolesModels.EmployeeRoleCreateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmployeeRoleResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: EmployeeRolesModels.EmployeeRoleCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCreate());
      return create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useLabels`
 * @summary List all employee roles with only their labels
 * @permission Requires `canUseLabels` ability 
 * @param { string } object.search Query parameter
 * @param { CommonModels.EmployeeRoleContext } object.context Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.LabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useLabels = <TData>({ search, context }: { search?: string, context?: CommonModels.EmployeeRoleContext }, options?: AppQueryOptions<typeof labels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.labels(search, context),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseLabels());
    return labels(search, context) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useFind`
 * @summary Get Employee Role Definition
 * @permission Requires `canUseFind` ability 
 * @param { string } object.roleId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.EmployeeRoleResponse> } 
 * @statusCodes [200, 401]
 */
export const useFind = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof find, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.find(roleId),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseFind());
    return find(roleId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Employee Role Definition
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.roleId Path parameter
 * @param { EmployeeRolesModels.EmployeeRoleUpdateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmployeeRoleResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { roleId: string, data: EmployeeRolesModels.EmployeeRoleUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseUpdate());
      return update(roleId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { roleId } = variables;
      const updateKeys = [keys.find(roleId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteEmployeesRolesByRoleId`
 * @summary Delete Employee Role Definition
 * @permission Requires `canUseDeleteEmployeesRolesByRoleId` ability 
 * @param { string } mutation.roleId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.StatusResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useDeleteEmployeesRolesByRoleId = (options?: AppMutationOptions<typeof deleteEmployeesRolesByRoleId, { roleId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId }) => { 
      checkAcl(EmployeeRolesAcl.canUseDeleteEmployeesRolesByRoleId());
      return deleteEmployeesRolesByRoleId(roleId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePaginatePermissions`
 * @summary Get All Employee Role Definition Permissions
 * - convenience endpoint to expand the permissions of a role
 * - only returns the enabled permissions
 * @permission Requires `canUsePaginatePermissions` ability 
 * @param { string } object.roleId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.EmployeeRolesPaginatePermissionsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginatePermissions = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginatePermissions(roleId),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUsePaginatePermissions());
    return paginatePermissions(roleId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useTogglePermission`
 * @summary Toggle Employee Role Definition Permission
 * @permission Requires `canUseTogglePermission` ability 
 * @param { string } mutation.roleId Path parameter
 * @param { string } mutation.permission Path parameter
 * @param { EmployeeRolesModels.EmployeeRoleTogglePermissionRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useTogglePermission = (options?: AppMutationOptions<typeof togglePermission, { roleId: string, permission: string, data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, permission, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseTogglePermission());
      return togglePermission(roleId, permission, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCopy`
 * @summary Copy Employee Role Definition
 * @permission Requires `canUseCopy` ability 
 * @param { string } mutation.roleId Path parameter
 * @param { EmployeeRolesModels.CopyEmployeeRoleDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmployeeRoleResponse> } 
 * @statusCodes [201, 401]
 */
export const useCopy = (options?: AppMutationOptions<typeof copy, { roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCopy());
      return copy(roleId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { roleId } = variables;
      const updateKeys = [keys.find(roleId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
