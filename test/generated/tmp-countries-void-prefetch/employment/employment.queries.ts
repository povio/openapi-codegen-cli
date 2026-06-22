import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { EmploymentAcl } from "./employment.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmploymentModels } from "./employment.models";
import { EmploymentApi } from "./employment.api";

export namespace EmploymentQueries {
export const moduleName = QueryModule.Employment;

export const keys = {
    all: [moduleName] as const,
    list: (limit?: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/employments", limit, order, populate, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string) => [...keys.all, "/employees/employments", "infinite", limit, order, populate, filter, cursor] as const,
    listRoles: (officeId: string, employmentId: string) => [...keys.all, "/offices/:officeId/employments/:employmentId/roles", officeId, employmentId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create new employment
 * @permission Requires `canUseCreate` ability 
 * @param { EmploymentModels.EmploymentCreateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof EmploymentApi.create, { data: EmploymentModels.EmploymentCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employment>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmploymentAcl.canUseCreate());
      return EmploymentApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listQueryOptions = ({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(limit, order, populate, filter, page, cursor),
  queryFn: () => EmploymentApi.list(limit, order, populate, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List Employments
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): officeId, createdAt. Example: `officeId`
 * @param { EmploymentModels.EmploymentListPopulateParam } populate Query parameter
 * @param { EmploymentModels.EmploymentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmploymentModels.EmploymentListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmploymentApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ limit, order, populate, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(EmploymentAcl.canUseList());
      return listQueryOptions({ limit, order, populate, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ limit, order, populate, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, populate, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => EmploymentApi.list(limit, order, populate, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List Employments
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): officeId, createdAt. Example: `officeId`
 * @param { EmploymentModels.EmploymentListPopulateParam } populate Query parameter
 * @param { EmploymentModels.EmploymentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmploymentModels.EmploymentListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmploymentApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ limit, order, populate, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(EmploymentAcl.canUseList());
      return listInfiniteQueryOptions({ limit, order, populate, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ limit, order, populate, filter, cursor }), ...options });
};

export const listRolesQueryOptions = ({ officeId, employmentId }: { officeId: string, employmentId: string }) => ({
  queryKey: keys.listRoles(officeId, employmentId),
  queryFn: () => EmploymentApi.listRoles(officeId, employmentId),
});

/** 
 * Query `useListRoles`
 * @summary List Employments Roles
 * @permission Requires `canUseListRoles` ability 
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmploymentModels.EmploymentListRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRoles = <TData>({ officeId, employmentId }: { officeId: string, employmentId: string }, options?: AppQueryOptions<typeof EmploymentApi.listRoles, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listRolesQueryOptions({ officeId, employmentId }),
    queryFn: async () => {
    checkAcl(EmploymentAcl.canUseListRoles({ officeId } ));
      return listRolesQueryOptions({ officeId, employmentId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListRoles = (queryClient: QueryClient, { officeId, employmentId }: { officeId: string, employmentId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listRolesQueryOptions({ officeId, employmentId }), ...options });
};

/** 
 * Mutation `useUpdateRoles`
 * @summary Update Employment Roles
 * @permission Requires `canUseUpdateRoles` ability 
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { EmploymentModels.EmploymentRoleMembershipsUpdateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentUpdateRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoles = (options?: AppMutationOptions<typeof EmploymentApi.updateRoles, { officeId: string, employmentId: string, data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employment>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdateRoles({ officeId } ));
      return EmploymentApi.updateRoles(officeId, employmentId, data)
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
 * Mutation `useUpdate`
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { EmploymentModels.UpdateEmploymentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmploymentApi.update, { officeId: string, employmentId: string, data: EmploymentModels.UpdateEmploymentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employment>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdate({ officeId } ));
      return EmploymentApi.update(officeId, employmentId, data)
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
 * Mutation `useArchive`
 * @summary Archive Employment
 * @permission Requires `canUseArchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof EmploymentApi.archive, { officeId: string, employmentId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employment>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseArchive({ officeId } ));
      return EmploymentApi.archive(officeId, employmentId)
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
 * Mutation `useUnarchive`
 * @summary Un-archive Employment
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof EmploymentApi.unarchive, { officeId: string, employmentId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employment>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseUnarchive({ officeId } ));
      return EmploymentApi.unarchive(officeId, employmentId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
