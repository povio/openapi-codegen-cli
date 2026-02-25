import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmployeeRolesAcl } from "./employeeRoles.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeRolesModels } from "./employeeRoles.models";
import { CommonModels } from "@/data/common/common.models";
import { EmployeeRolesApi } from "./employeeRoles.api";

export namespace EmployeeRolesQueries {
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
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseList());
    return EmployeeRolesApi.list(limit, order, filter, page, cursor, config) },
    ...options,
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
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmployeeRolesApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmployeeRolesAcl.canUseList());
    return EmployeeRolesApi.list(limit, order, filter, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
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
export const useCreate = (options?: AppMutationOptions<typeof EmployeeRolesApi.create, { data: EmployeeRolesModels.EmployeeRoleCreateRequest }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCreate());
      return EmployeeRolesApi.create(data, config)
    },
    ...options,
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
export const useLabels = <TData>({ search, context }: { search?: string, context?: CommonModels.EmployeeRoleContext }, options?: AppQueryOptions<typeof EmployeeRolesApi.labels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.labels(search, context),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseLabels());
    return EmployeeRolesApi.labels(search, context, config) },
    ...options,
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
export const useFind = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.find, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.find(roleId),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUseFind());
    return EmployeeRolesApi.find(roleId, config) },
    ...options,
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
export const useUpdate = (options?: AppMutationOptions<typeof EmployeeRolesApi.update, { roleId: string, data: EmployeeRolesModels.EmployeeRoleUpdateRequest }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseUpdate());
      return EmployeeRolesApi.update(roleId, data, config)
    },
    ...options,
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
export const useDeleteEmployeesRolesByRoleId = (options?: AppMutationOptions<typeof EmployeeRolesApi.deleteEmployeesRolesByRoleId, { roleId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId }) => { 
      checkAcl(EmployeeRolesAcl.canUseDeleteEmployeesRolesByRoleId());
      return EmployeeRolesApi.deleteEmployeesRolesByRoleId(roleId, config)
    },
    ...options,
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
export const usePaginatePermissions = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.paginatePermissions, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginatePermissions(roleId),
    queryFn: () => { 
    checkAcl(EmployeeRolesAcl.canUsePaginatePermissions());
    return EmployeeRolesApi.paginatePermissions(roleId, config) },
    ...options,
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
export const useTogglePermission = (options?: AppMutationOptions<typeof EmployeeRolesApi.togglePermission, { roleId: string, permission: string, data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, permission, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseTogglePermission());
      return EmployeeRolesApi.togglePermission(roleId, permission, data, config)
    },
    ...options,
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
export const useCopy = (options?: AppMutationOptions<typeof EmployeeRolesApi.copy, { roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCopy());
      return EmployeeRolesApi.copy(roleId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { roleId } = variables;
      const updateKeys = [keys.find(roleId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
