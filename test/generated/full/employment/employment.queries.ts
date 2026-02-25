import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmploymentAcl } from "./employment.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
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
 * @param { EmploymentModels.EmploymentCreateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof EmploymentApi.create, { data: EmploymentModels.EmploymentCreateRequest }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmploymentAcl.canUseCreate());
      return EmploymentApi.create(data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useList`
 * @summary List Employments
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): officeId, createdAt. Example: `officeId`
 * @param { EmploymentModels.EmploymentListPopulateParam } object.populate Query parameter
 * @param { EmploymentModels.EmploymentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmploymentModels.EmploymentListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmploymentApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, populate, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmploymentAcl.canUseList());
    return EmploymentApi.list(limit, order, populate, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List Employments
 * @permission Requires `canUseList` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): officeId, createdAt. Example: `officeId`
 * @param { EmploymentModels.EmploymentListPopulateParam } object.populate Query parameter
 * @param { EmploymentModels.EmploymentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmploymentModels.EmploymentListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmploymentApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, populate, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmploymentAcl.canUseList());
    return EmploymentApi.list(limit, order, populate, filter, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useListRoles`
 * @summary List Employments Roles
 * @permission Requires `canUseListRoles` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.employmentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmploymentModels.EmploymentListRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRoles = <TData>({ officeId, employmentId }: { officeId: string, employmentId: string }, options?: AppQueryOptions<typeof EmploymentApi.listRoles, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoles(officeId, employmentId),
    queryFn: () => { 
    checkAcl(EmploymentAcl.canUseListRoles({ officeId } ));
    return EmploymentApi.listRoles(officeId, employmentId, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateRoles`
 * @summary Update Employment Roles
 * @permission Requires `canUseUpdateRoles` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employmentId Path parameter
 * @param { EmploymentModels.EmploymentRoleMembershipsUpdateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmploymentModels.EmploymentUpdateRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoles = (options?: AppMutationOptions<typeof EmploymentApi.updateRoles, { officeId: string, employmentId: string, data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdateRoles({ officeId } ));
      return EmploymentApi.updateRoles(officeId, employmentId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdate`
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employmentId Path parameter
 * @param { EmploymentModels.UpdateEmploymentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmploymentApi.update, { officeId: string, employmentId: string, data: EmploymentModels.UpdateEmploymentRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdate({ officeId } ));
      return EmploymentApi.update(officeId, employmentId, data, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof EmploymentApi.archive, { officeId: string, employmentId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseArchive({ officeId } ));
      return EmploymentApi.archive(officeId, employmentId, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof EmploymentApi.unarchive, { officeId: string, employmentId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseUnarchive({ officeId } ));
      return EmploymentApi.unarchive(officeId, employmentId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
