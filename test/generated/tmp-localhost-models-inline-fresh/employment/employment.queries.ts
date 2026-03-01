import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmploymentAcl } from "./employment.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmploymentModels } from "./employment.models";

export namespace EmploymentQueries {
const create = (data: EmploymentModels.EmploymentCreateRequest) => {
  return AppRestClient.post(
    { resSchema: EmploymentModels.EmploymentResponseSchema },
    `/employees/employments`,
    ZodExtended.parse(EmploymentModels.EmploymentCreateRequestSchema, data),
    
  );
};

const list = (limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: EmploymentModels.EmploymentListResponseSchema },
    `/employees/employments`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(EmploymentModels.EmploymentListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        populate: ZodExtended.parse(EmploymentModels.EmploymentListPopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
        filter: ZodExtended.parse(EmploymentModels.EmploymentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const listRoles = (officeId: string, employmentId: string) => {
  return AppRestClient.get(
    { resSchema: EmploymentModels.EmploymentListRolesResponseSchema },
    `/offices/${officeId}/employments/${employmentId}/roles`,
    
  );
};

const updateRoles = (officeId: string, employmentId: string, data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest) => {
  return AppRestClient.put(
    { resSchema: EmploymentModels.EmploymentUpdateRolesResponseSchema },
    `/offices/${officeId}/employments/${employmentId}/roles`,
    ZodExtended.parse(EmploymentModels.EmploymentRoleMembershipsUpdateRequestSchema, data),
    
  );
};

const update = (officeId: string, employmentId: string, data: EmploymentModels.UpdateEmploymentRequestDto) => {
  return AppRestClient.patch(
    { resSchema: EmploymentModels.EmploymentResponseSchema },
    `/offices/${officeId}/employments/${employmentId}`,
    ZodExtended.parse(EmploymentModels.UpdateEmploymentRequestDtoSchema, data),
    
  );
};

const archive = (officeId: string, employmentId: string) => {
  return AppRestClient.post(
    { resSchema: EmploymentModels.EmploymentResponseSchema },
    `/offices/${officeId}/employments/${employmentId}/archive`,
    
  );
};

const unarchive = (officeId: string, employmentId: string) => {
  return AppRestClient.post(
    { resSchema: EmploymentModels.EmploymentResponseSchema },
    `/offices/${officeId}/employments/${employmentId}/unarchive`,
    
  );
};


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
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: EmploymentModels.EmploymentCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmploymentAcl.canUseCreate());
      return create(data)
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
export const useList = <TData>({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, populate, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmploymentAcl.canUseList());
    return list(limit, order, populate, filter, page, cursor) },
    ...options,
  });
};

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
export const useListInfinite = <TData>({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, populate, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmploymentAcl.canUseList());
    return list(limit, order, populate, filter, pageParam, cursor) },
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
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmploymentModels.EmploymentListRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRoles = <TData>({ officeId, employmentId }: { officeId: string, employmentId: string }, options?: AppQueryOptions<typeof listRoles, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoles(officeId, employmentId),
    queryFn: () => { 
    checkAcl(EmploymentAcl.canUseListRoles({ officeId } ));
    return listRoles(officeId, employmentId) },
    ...options,
  });
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
export const useUpdateRoles = (options?: AppMutationOptions<typeof updateRoles, { officeId: string, employmentId: string, data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdateRoles({ officeId } ));
      return updateRoles(officeId, employmentId, data)
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
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { EmploymentModels.UpdateEmploymentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, employmentId: string, data: EmploymentModels.UpdateEmploymentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId, data }) => { 
      checkAcl(EmploymentAcl.canUseUpdate({ officeId } ));
      return update(officeId, employmentId, data)
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
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { officeId: string, employmentId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseArchive({ officeId } ));
      return archive(officeId, employmentId)
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
 * @param { string } officeId Path parameter
 * @param { string } employmentId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.EmploymentResponse> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { officeId: string, employmentId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employmentId }) => { 
      checkAcl(EmploymentAcl.canUseUnarchive({ officeId } ));
      return unarchive(officeId, employmentId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
