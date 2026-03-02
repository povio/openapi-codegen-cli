import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { EmployeeAcl } from "./employee.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeModels } from "./employee.models";
import { EmployeeApi } from "./employee.api";

export namespace EmployeeQueries {
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

export const paginateQueryOptions = ({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, populate, filter, page, cursor),
  queryFn: () => EmployeeApi.paginate(limit, order, populate, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Employees
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeePaginatePopulateParam } populate Query parameter
 * @param { EmployeeModels.EmployeeFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, populate, filter, page, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmployeeApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, populate, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUsePaginate());
      return paginateQueryOptions({ limit, order, populate, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateInfiniteQueryOptions = ({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, populate, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => EmployeeApi.paginate(limit, order, populate, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Employees
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeePaginatePopulateParam } populate Query parameter
 * @param { EmployeeModels.EmployeeFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeModels.EmployeePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, populate, filter, cursor }: { limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmployeeApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, populate, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(EmployeeAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ limit, order, populate, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create Employee
 * @permission Requires `canUseCreate` ability 
 * @param { EmployeeModels.EmployeeCreateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof EmployeeApi.create, { data: EmployeeModels.EmployeeCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(EmployeeAcl.canUseCreate());
      return EmployeeApi.create(data)
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
 * Mutation `useSingeStepCreate`
 * @summary Create Employee in a single step
 * - requires Employee:Create for creating a global employee
 * - requires Employee:Create{officeId} for creating an office employee (first office is primary)
 * - requires Employment:Create{officeId} for creating office employments
 * - requires Employee:UpdateRoles for setting global roles
 * - requires Employee:UpdateRoles{officeId} for setting office roles
 * @param { EmployeeModels.EmployeeOneStepCreateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [201, 401]
 */
export const useSingeStepCreate = (options?: AppMutationOptions<typeof EmployeeApi.singeStepCreate, { data: EmployeeModels.EmployeeOneStepCreateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      EmployeeApi.singeStepCreate(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const findAllQueryOptions = ({ search }: { search?: string }) => ({
  queryKey: keys.findAll(search),
  queryFn: () => EmployeeApi.findAll(search),
});

/** 
 * Query `useFindAll`
 * @summary List all employees with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof EmployeeApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findAllQueryOptions({ search }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUseFindAll());
      return findAllQueryOptions({ search }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => EmployeeApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate employees with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeePaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof EmployeeApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => EmployeeApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate employees with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): firstName, lastName, email, name, createdAt. Example: `firstName`
 * @param { EmployeeModels.EmployeeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<EmployeeModels.EmployeePaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof EmployeeApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(EmployeeAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useResendOnboarding`
 * @summary Resend Employee Onboarding Email
 * @param { string } employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.StatusResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useResendOnboarding = (options?: AppMutationOptions<typeof EmployeeApi.resendOnboarding, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => 
      EmployeeApi.resendOnboarding(employeeId)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useResendOnboardingWithOffice`
 * @permission Requires `canUseResendOnboardingWithOffice` ability 
 * @param { string } officeId Path parameter
 * @param { string } employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.StatusResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useResendOnboardingWithOffice = (options?: AppMutationOptions<typeof EmployeeApi.resendOnboardingWithOffice, { officeId: string, employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employeeId }) => { 
      checkAcl(EmployeeAcl.canUseResendOnboardingWithOffice({ officeId } ));
      return EmployeeApi.resendOnboardingWithOffice(officeId, employeeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getQueryOptions = ({ employeeId, populate }: { employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam }) => ({
  queryKey: keys.get(employeeId, populate),
  queryFn: () => EmployeeApi.get(employeeId, populate),
});

/** 
 * Query `useGet`
 * @summary Get Employee
 * - allow global admins and office admins of primary office
 * @permission Requires `canUseGet` ability 
 * @param { string } employeeId Path parameter
 * @param { EmployeeModels.EmployeeGetPopulateParam } populate Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ employeeId, populate }: { employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam }, options?: AppQueryOptions<typeof EmployeeApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getQueryOptions({ employeeId, populate }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUseGet());
      return getQueryOptions({ employeeId, populate }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Employee
 * - allow global admins and office admins of primary office
 * @permission Requires `canUseUpdate` ability 
 * @param { string } employeeId Path parameter
 * @param { EmployeeModels.EmployeeUpdateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof EmployeeApi.update, { employeeId: string, data: EmployeeModels.EmployeeUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdate());
      return EmployeeApi.update(employeeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { employeeId } = variables;
      const updateKeys = [keys.get(employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getWithOfficeQueryOptions = ({ officeId, employeeId, populate }: { officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam }) => ({
  queryKey: keys.getWithOffice(officeId, employeeId, populate),
  queryFn: () => EmployeeApi.getWithOffice(officeId, employeeId, populate),
});

/** 
 * Query `useGetWithOffice`
 * @permission Requires `canUseGetWithOffice` ability 
 * @param { string } officeId Path parameter
 * @param { string } employeeId Path parameter
 * @param { EmployeeModels.GetWithOfficePopulateParam } populate Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetWithOffice = <TData>({ officeId, employeeId, populate }: { officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam }, options?: AppQueryOptions<typeof EmployeeApi.getWithOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getWithOfficeQueryOptions({ officeId, employeeId, populate }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUseGetWithOffice({ officeId } ));
      return getWithOfficeQueryOptions({ officeId, employeeId, populate }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateWithOffice`
 * @permission Requires `canUseUpdateWithOffice` ability 
 * @param { string } officeId Path parameter
 * @param { string } employeeId Path parameter
 * @param { EmployeeModels.EmployeeUpdateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateWithOffice = (options?: AppMutationOptions<typeof EmployeeApi.updateWithOffice, { officeId: string, employeeId: string, data: EmployeeModels.EmployeeUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdateWithOffice({ officeId } ));
      return EmployeeApi.updateWithOffice(officeId, employeeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, employeeId } = variables;
      const updateKeys = [keys.get(employeeId), keys.getWithOffice(officeId, employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listRolesQueryOptions = ({ employeeId }: { employeeId: string }) => ({
  queryKey: keys.listRoles(employeeId),
  queryFn: () => EmployeeApi.listRoles(employeeId),
});

/** 
 * Query `useListRoles`
 * @summary List Employee (global) Roles
 * @permission Requires `canUseListRoles` ability 
 * @param { string } employeeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeModels.EmployeeListRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRoles = <TData>({ employeeId }: { employeeId: string }, options?: AppQueryOptions<typeof EmployeeApi.listRoles, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listRolesQueryOptions({ employeeId }),
    queryFn: async () => {
    checkAcl(EmployeeAcl.canUseListRoles());
      return listRolesQueryOptions({ employeeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateRoles`
 * @summary Update Employee (global) Roles
 * @permission Requires `canUseUpdateRoles` ability 
 * @param { string } employeeId Path parameter
 * @param { EmployeeModels.EmployeeRoleMembershipsUpdateRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeUpdateRolesResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoles = (options?: AppMutationOptions<typeof EmployeeApi.updateRoles, { employeeId: string, data: EmployeeModels.EmployeeRoleMembershipsUpdateRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId, data }) => { 
      checkAcl(EmployeeAcl.canUseUpdateRoles());
      return EmployeeApi.updateRoles(employeeId, data)
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
 * @summary Archive Employee
 * @permission Requires `canUseArchive` ability 
 * @param { string } employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof EmployeeApi.archive, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => { 
      checkAcl(EmployeeAcl.canUseArchive());
      return EmployeeApi.archive(employeeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } employeeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeModels.EmployeeResponse> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof EmployeeApi.unarchive, { employeeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Employee>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ employeeId }) => { 
      checkAcl(EmployeeAcl.canUseUnarchive());
      return EmployeeApi.unarchive(employeeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { employeeId } = variables;
      const updateKeys = [keys.get(employeeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
