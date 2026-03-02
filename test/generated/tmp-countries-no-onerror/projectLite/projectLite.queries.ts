import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { ProjectLiteAcl } from "./projectLite.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ProjectLiteModels } from "./projectLite.models";
import { ProjectLiteApi } from "./projectLite.api";

export namespace ProjectLiteQueries {
export const moduleName = QueryModule.ProjectLite;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/project-lite", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/project-lite", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateProjectLabels: (officeId: string, limit?: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/project-lite/labels/paginate", officeId, limit, order, filter, page, cursor] as const,
    paginateProjectLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/project-lite/labels/paginate", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) => [...keys.all, "/offices/:officeId/project-lite/:id", id, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create project
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { ProjectLiteModels.CreateProjectLiteRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof ProjectLiteApi.create, { officeId: string, data: ProjectLiteModels.CreateProjectLiteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ProjectLite>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(ProjectLiteAcl.canUseCreate({ officeId } ));
      return ProjectLiteApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const paginateQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
  queryFn: () => ProjectLiteApi.paginate(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Get paginated projects
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.ProjectLitePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ProjectLiteApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(ProjectLiteAcl.canUsePaginate({ officeId } ));
      return paginateQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => ProjectLiteApi.paginate(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Get paginated projects
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ProjectLiteModels.ProjectLitePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ProjectLiteApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(ProjectLiteAcl.canUsePaginate({ officeId } ));
      return paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

export const paginateProjectLabelsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateProjectLabels(officeId, limit, order, filter, page, cursor),
  queryFn: () => ProjectLiteApi.paginateProjectLabels(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateProjectLabels`
 * @summary Paginate project labels
 * @permission Requires `canUsePaginateProjectLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.PaginateProjectLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateProjectLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ProjectLiteApi.paginateProjectLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateProjectLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(ProjectLiteAcl.canUsePaginateProjectLabels({ officeId } ));
      return paginateProjectLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateProjectLabels = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateProjectLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateProjectLabelsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateProjectLabelsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => ProjectLiteApi.paginateProjectLabels(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateProjectLabelsInfinite
 * @summary Paginate project labels
 * @permission Requires `canUsePaginateProjectLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ProjectLiteModels.PaginateProjectLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateProjectLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ProjectLiteApi.paginateProjectLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateProjectLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(ProjectLiteAcl.canUsePaginateProjectLabels({ officeId } ));
      return paginateProjectLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateProjectLabelsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateProjectLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

export const findByIdQueryOptions = ({ id, officeId }: { id: string, officeId: string }) => ({
  queryKey: keys.findById(id, officeId),
  queryFn: () => ProjectLiteApi.findById(id, officeId),
});

/** 
 * Query `useFindById`
 * @summary Get project by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id, officeId }: { id: string, officeId: string }, options?: AppQueryOptions<typeof ProjectLiteApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id, officeId }),
    queryFn: async () => {
    checkAcl(ProjectLiteAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ id, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { id, officeId }: { id: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByIdQueryOptions({ id, officeId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update project
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { ProjectLiteModels.UpdateProjectLiteRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof ProjectLiteApi.update, { id: string, officeId: string, data: ProjectLiteModels.UpdateProjectLiteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ProjectLite>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(ProjectLiteAcl.canUseUpdate({ officeId } ));
      return ProjectLiteApi.update(id, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id, officeId } = variables;
      const updateKeys = [keys.findById(id, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive project
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof ProjectLiteApi.archive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ProjectLite>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ProjectLiteAcl.canUseArchive({ officeId } ));
      return ProjectLiteApi.archive(id, officeId)
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
 * @summary Unarchive project
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof ProjectLiteApi.unarchive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ProjectLite>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ProjectLiteAcl.canUseUnarchive({ officeId } ));
      return ProjectLiteApi.unarchive(id, officeId)
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
