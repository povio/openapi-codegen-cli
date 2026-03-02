import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { EmployeeRolesAcl } from "./employeeRoles.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeRolesModels } from "./employeeRoles.models";
import { CommonModels } from "@/data/common/common.models";
import { EmployeeRolesApi } from "./employeeRoles.api";

export namespace EmployeeRolesQueries {
export const moduleName = QueryModule.EmployeeRoles;

export const keys = {
    all: [moduleName] as const,
    list: (limit?: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/roles", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string) => [...keys.all, "/employees/roles", "infinite", limit, order, filter, cursor] as const,
    labels: (search?: string, context?: EmployeeRolesModels.EmployeeRoleContext) => [...keys.all, "/employees/roles/labels", search, context] as const,
    find: (roleId: string) => [...keys.all, "/employees/roles/:roleId", roleId] as const,
    paginatePermissions: (roleId: string) => [...keys.all, "/employees/roles/:roleId/permissions", roleId] as const,
};

export const listQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(limit, order, filter, page, cursor),
  queryFn: () => EmployeeRolesApi.list(limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary Paginate Employee Role Definitions
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, numberOfUsers. Example: `name`
 * @param { EmployeeRolesModels.EmployeeRolePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.EmployeeRolesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(EmployeeRolesAcl.canUseList());
      return listQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => EmployeeRolesApi.list(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary Paginate Employee Role Definitions
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, numberOfUsers. Example: `name`
 * @param { EmployeeRolesModels.EmployeeRolePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeRolesModels.EmployeeRolesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmployeeRolesApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(EmployeeRolesAcl.canUseList());
      return listInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create Employee Role Definition
 * @permission Requires `canUseCreate` ability 
 * @param { EmployeeRolesModels.EmployeeRoleCreateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeRolesModels.EmployeeRoleResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof EmployeeRolesApi.create, { data: EmployeeRolesModels.EmployeeRoleCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeRoles>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCreate());
      return EmployeeRolesApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const labelsQueryOptions = ({ search, context }: { search?: string, context?: EmployeeRolesModels.EmployeeRoleContext }) => ({
  queryKey: keys.labels(search, context),
  queryFn: () => EmployeeRolesApi.labels(search, context),
});

/** 
 * Query `useLabels`
 * @summary List all employee roles with only their labels
 * @permission Requires `canUseLabels` ability 
 * @param { string } search Query parameter
 * @param { EmployeeRolesModels.EmployeeRoleContext } context Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.LabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useLabels = <TData>({ search, context }: { search?: string, context?: EmployeeRolesModels.EmployeeRoleContext }, options?: AppQueryOptions<typeof EmployeeRolesApi.labels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...labelsQueryOptions({ search, context }),
    queryFn: async () => {
    checkAcl(EmployeeRolesAcl.canUseLabels());
      return labelsQueryOptions({ search, context }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchLabels = (queryClient: QueryClient, { search, context }: { search?: string, context?: EmployeeRolesModels.EmployeeRoleContext }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...labelsQueryOptions({ search, context }), ...options });
};

export const findQueryOptions = ({ roleId }: { roleId: string }) => ({
  queryKey: keys.find(roleId),
  queryFn: () => EmployeeRolesApi.find(roleId),
});

/** 
 * Query `useFind`
 * @summary Get Employee Role Definition
 * @permission Requires `canUseFind` ability 
 * @param { string } roleId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.EmployeeRoleResponse> } 
 * @statusCodes [200, 401]
 */
export const useFind = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.find, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findQueryOptions({ roleId }),
    queryFn: async () => {
    checkAcl(EmployeeRolesAcl.canUseFind());
      return findQueryOptions({ roleId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFind = (queryClient: QueryClient, { roleId }: { roleId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findQueryOptions({ roleId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Employee Role Definition
 * @permission Requires `canUseUpdate` ability 
 * @param { string } roleId Path parameter
 * @param { EmployeeRolesModels.EmployeeRoleUpdateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeRolesModels.EmployeeRoleResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmployeeRolesApi.update, { roleId: string, data: EmployeeRolesModels.EmployeeRoleUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeRoles>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseUpdate());
      return EmployeeRolesApi.update(roleId, data)
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
 * @param { string } roleId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeRolesModels.StatusResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useDeleteEmployeesRolesByRoleId = (options?: AppMutationOptions<typeof EmployeeRolesApi.deleteEmployeesRolesByRoleId, { roleId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeRoles>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId }) => { 
      checkAcl(EmployeeRolesAcl.canUseDeleteEmployeesRolesByRoleId());
      return EmployeeRolesApi.deleteEmployeesRolesByRoleId(roleId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const paginatePermissionsQueryOptions = ({ roleId }: { roleId: string }) => ({
  queryKey: keys.paginatePermissions(roleId),
  queryFn: () => EmployeeRolesApi.paginatePermissions(roleId),
});

/** 
 * Query `usePaginatePermissions`
 * @summary Get All Employee Role Definition Permissions
 * - convenience endpoint to expand the permissions of a role
 * - only returns the enabled permissions
 * @permission Requires `canUsePaginatePermissions` ability 
 * @param { string } roleId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeRolesModels.EmployeeRolesPaginatePermissionsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginatePermissions = <TData>({ roleId }: { roleId: string }, options?: AppQueryOptions<typeof EmployeeRolesApi.paginatePermissions, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginatePermissionsQueryOptions({ roleId }),
    queryFn: async () => {
    checkAcl(EmployeeRolesAcl.canUsePaginatePermissions());
      return paginatePermissionsQueryOptions({ roleId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginatePermissions = (queryClient: QueryClient, { roleId }: { roleId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginatePermissionsQueryOptions({ roleId }), ...options });
};

/** 
 * Mutation `useTogglePermission`
 * @summary Toggle Employee Role Definition Permission
 * @permission Requires `canUseTogglePermission` ability 
 * @param { string } roleId Path parameter
 * @param { string } permission Path parameter
 * @param { EmployeeRolesModels.EmployeeRoleTogglePermissionRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useTogglePermission = (options?: AppMutationOptions<typeof EmployeeRolesApi.togglePermission, { roleId: string, permission: string, data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeRoles>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, permission, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseTogglePermission());
      return EmployeeRolesApi.togglePermission(roleId, permission, data)
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
 * @param { string } roleId Path parameter
 * @param { EmployeeRolesModels.CopyEmployeeRoleDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeRolesModels.EmployeeRoleResponse> } 
 * @statusCodes [201, 401]
 */
export const useCopy = (options?: AppMutationOptions<typeof EmployeeRolesApi.copy, { roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeRoles>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ roleId, data }) => { 
      checkAcl(EmployeeRolesAcl.canUseCopy());
      return EmployeeRolesApi.copy(roleId, data)
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
