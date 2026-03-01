import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { EmployeeAcl } from "./employee.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeModels } from "./employee.models";

export namespace EmployeeQueries {
const paginate = (limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeePaginateResponseSchema },
    `/employees`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(EmployeeModels.EmployeePaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        populate: ZodExtended.parse(EmployeeModels.EmployeePaginatePopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
        filter: ZodExtended.parse(EmployeeModels.EmployeeFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: EmployeeModels.EmployeeCreateRequest) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees`,
    ZodExtended.parse(EmployeeModels.EmployeeCreateRequestSchema, data),
    
  );
};

const singeStepCreate = (data: EmployeeModels.EmployeeOneStepCreateRequest) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees/one-step`,
    ZodExtended.parse(EmployeeModels.EmployeeOneStepCreateRequestSchema, data),
    
  );
};

const findAll = (search?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeeFindAllResponseSchema },
    `/employees/labels`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
      },
    }
  );
};

const paginateLabels = (limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeePaginateLabelsResponseSchema },
    `/employees/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(EmployeeModels.EmployeePaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(EmployeeModels.EmployeeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const resendOnboarding = (employeeId: string) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.StatusResponseDtoSchema },
    `/employees/${employeeId}/resend-onboarding`,
    
  );
};

const resendOnboardingWithOffice = (officeId: string, employeeId: string) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.StatusResponseDtoSchema },
    `/offices/${officeId}/employees/${employeeId}/resend-onboarding`,
    
  );
};

const get = (employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees/${employeeId}`,
    {
      params: {
        populate: ZodExtended.parse(EmployeeModels.EmployeeGetPopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
      },
    }
  );
};

const update = (employeeId: string, data: EmployeeModels.EmployeeUpdateRequest) => {
  return AppRestClient.put(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees/${employeeId}`,
    ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
    
  );
};

const getWithOffice = (officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/offices/${officeId}/employees/${employeeId}`,
    {
      params: {
        populate: ZodExtended.parse(EmployeeModels.GetWithOfficePopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
      },
    }
  );
};

const updateWithOffice = (officeId: string, employeeId: string, data: EmployeeModels.EmployeeUpdateRequest) => {
  return AppRestClient.put(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/offices/${officeId}/employees/${employeeId}`,
    ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
    
  );
};

const listRoles = (employeeId: string) => {
  return AppRestClient.get(
    { resSchema: EmployeeModels.EmployeeListRolesResponseSchema },
    `/employees/${employeeId}/roles`,
    
  );
};

const updateRoles = (employeeId: string, data: EmployeeModels.EmployeeRoleMembershipsUpdateRequest) => {
  return AppRestClient.put(
    { resSchema: EmployeeModels.EmployeeUpdateRolesResponseSchema },
    `/employees/${employeeId}/roles`,
    ZodExtended.parse(EmployeeModels.EmployeeRoleMembershipsUpdateRequestSchema, data),
    
  );
};

const archive = (employeeId: string) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees/${employeeId}/archive`,
    
  );
};

const unarchive = (employeeId: string) => {
  return AppRestClient.post(
    { resSchema: EmployeeModels.EmployeeResponseSchema },
    `/employees/${employeeId}/unarchive`,
    
  );
};


export const moduleName = QueryModule.Employee;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees", limit, order, populate, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, cursor?: string) => [...keys.all, "/employees", "infinite", limit, order, populate, filter, cursor] as const,
    findAll: (search?: string) => [...keys.all, "/employees/labels", search] as const,
    paginateLabels: (limit?: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/employees/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, cursor?: string) => [...keys.all, "/employees/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    get: (employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam) => [...keys.all, "/employees/:employeeId", employeeId, populate] as const,
    getWithOffice: (officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam) => [...keys.all, "/offices/:officeId/employees/:employeeId", officeId, employeeId, populate] as const,
    listRoles: (employeeId: string) => [...keys.all, "/employees/:employeeId/roles", employeeId] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Employees
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeePaginatePopulateParam } object.populate Query parameter
 * @param { EmployeeModels.EmployeeFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, populate, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUsePaginate());
    return paginate(limit, order, populate, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Employees
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeePaginatePopulateParam } object.populate Query parameter
 * @param { EmployeeModels.EmployeeFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeModels.EmployeePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, populate, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmployeeAcl.canUsePaginate());
    return paginate(limit, order, populate, filter, pageParam, cursor) },
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
 * @summary Create Employee
 * @permission Requires `canUseCreate` ability 
 * @param { EmployeeModels.EmployeeCreateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: EmployeeModels.EmployeeCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmployeeAcl.canUseCreate());
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
 * Mutation `useSingeStepCreate`
 * @summary Create Employee in a single step
 * - requires Employee:Create for creating a global employee
 * - requires Employee:Create{officeId} for creating an office employee (first office is primary)
 * - requires Employment:Create{officeId} for creating office employments
 * - requires Employee:UpdateRoles for setting global roles
 * - requires Employee:UpdateRoles{officeId} for setting office roles
 * @param { EmployeeModels.EmployeeOneStepCreateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [201, 401]
 */
export const useSingeStepCreate = (options?: AppMutationOptions<typeof singeStepCreate, { data: EmployeeModels.EmployeeOneStepCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      singeStepCreate(data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useFindAll`
 * @summary List all employees with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } object.search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(search),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUseFindAll());
    return findAll(search) },
    ...options,
  });
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate employees with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeePaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate employees with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeModels.EmployeePaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(EmployeeAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useResendOnboarding`
 * @summary Resend Employee Onboarding Email
 * @param { string } mutation.employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.StatusResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useResendOnboarding = (options?: AppMutationOptions<typeof resendOnboarding, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => 
      resendOnboarding(employeeId)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useResendOnboardingWithOffice`
 * @permission Requires `canUseResendOnboardingWithOffice` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.StatusResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useResendOnboardingWithOffice = (options?: AppMutationOptions<typeof resendOnboardingWithOffice, { officeId: string, employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employeeId }) => { 
      checkAcl(EmployeeAcl.canUseResendOnboardingWithOffice({ officeId } ));
      return resendOnboardingWithOffice(officeId, employeeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGet`
 * @summary Get Employee
 * - allow global admins and office admins of primary office
 * @permission Requires `canUseGet` ability 
 * @param { string } object.employeeId Path parameter
 * @param { EmployeeModels.EmployeeGetPopulateParam } object.populate Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ employeeId, populate }: { employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(employeeId, populate),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUseGet());
    return get(employeeId, populate) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Employee
 * - allow global admins and office admins of primary office
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.employeeId Path parameter
 * @param { EmployeeModels.EmployeeUpdateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { employeeId: string, data: EmployeeModels.EmployeeUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdate());
      return update(employeeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { employeeId } = variables;
      const updateKeys = [keys.get(employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetWithOffice`
 * @permission Requires `canUseGetWithOffice` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.employeeId Path parameter
 * @param { EmployeeModels.GetWithOfficePopulateParam } object.populate Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetWithOffice = <TData>({ officeId, employeeId, populate }: { officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam }, options?: AppQueryOptions<typeof getWithOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getWithOffice(officeId, employeeId, populate),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUseGetWithOffice({ officeId } ));
    return getWithOffice(officeId, employeeId, populate) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateWithOffice`
 * @permission Requires `canUseUpdateWithOffice` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.employeeId Path parameter
 * @param { EmployeeModels.EmployeeUpdateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateWithOffice = (options?: AppMutationOptions<typeof updateWithOffice, { officeId: string, employeeId: string, data: EmployeeModels.EmployeeUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdateWithOffice({ officeId } ));
      return updateWithOffice(officeId, employeeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, employeeId } = variables;
      const updateKeys = [keys.get(employeeId), keys.getWithOffice(officeId, employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useListRoles`
 * @summary List Employee (global) Roles
 * @permission Requires `canUseListRoles` ability 
 * @param { string } object.employeeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeListRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRoles = <TData>({ employeeId }: { employeeId: string }, options?: AppQueryOptions<typeof listRoles, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoles(employeeId),
    queryFn: () => { 
    checkAcl(EmployeeAcl.canUseListRoles());
    return listRoles(employeeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateRoles`
 * @summary Update Employee (global) Roles
 * @permission Requires `canUseUpdateRoles` ability 
 * @param { string } mutation.employeeId Path parameter
 * @param { EmployeeModels.EmployeeRoleMembershipsUpdateRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeUpdateRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoles = (options?: AppMutationOptions<typeof updateRoles, { employeeId: string, data: EmployeeModels.EmployeeRoleMembershipsUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdateRoles());
      return updateRoles(employeeId, data)
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
 * @summary Archive Employee
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => { 
      checkAcl(EmployeeAcl.canUseArchive());
      return archive(employeeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { employeeId } = variables;
      const updateKeys = [keys.get(employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Un-archive Employee
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => { 
      checkAcl(EmployeeAcl.canUseUnarchive());
      return unarchive(employeeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { employeeId } = variables;
      const updateKeys = [keys.get(employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
