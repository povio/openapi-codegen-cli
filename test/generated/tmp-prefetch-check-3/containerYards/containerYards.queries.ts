import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { ContainerYardsAcl } from "./containerYards.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ContainerYardsModels } from "./containerYards.models";
import { ContainerYardsApi } from "./containerYards.api";

export namespace ContainerYardsQueries {
export const moduleName = QueryModule.ContainerYards;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, page?: number, cursor?: string) => [...keys.all, "/container-yards", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, cursor?: string) => [...keys.all, "/container-yards", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/container-yards/paginate/labels", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, cursor?: string) => [...keys.all, "/container-yards/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    getLabelById: (id: string) => [...keys.all, "/container-yards/:id/labels", id] as const,
    findById: (id: string) => [...keys.all, "/container-yards/:id", id] as const,
};

export const paginateQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, filter, page, cursor),
  queryFn: () => ContainerYardsApi.paginate(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Container Yards
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ContainerYardsModels.ContainerYardFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ContainerYardsModels.ContainerYardsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ContainerYardsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(ContainerYardsAcl.canUsePaginate());
      return paginateQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => ContainerYardsApi.paginate(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Container Yards
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ContainerYardsModels.ContainerYardFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ContainerYardsModels.ContainerYardsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ContainerYardsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(ContainerYardsAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create container yard
 * @permission Requires `canUseCreate` ability 
 * @param { ContainerYardsModels.CreateContainerYardRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ContainerYardsModels.ContainerYardResponseDTO> } 
 * @statusCodes [200, 201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof ContainerYardsApi.create, { data: ContainerYardsModels.CreateContainerYardRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ContainerYards>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(ContainerYardsAcl.canUseCreate());
      return ContainerYardsApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => ContainerYardsApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate container yard labels (id and name)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ContainerYardsModels.ContainerYardLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ContainerYardsModels.ContainerYardsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ContainerYardsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(ContainerYardsAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => ContainerYardsApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate container yard labels (id and name)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ContainerYardsModels.ContainerYardLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ContainerYardsModels.ContainerYardsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ContainerYardsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(ContainerYardsAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const getLabelByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.getLabelById(id),
  queryFn: () => ContainerYardsApi.getLabelById(id),
});

/** 
 * Query `useGetLabelById`
 * @summary Get container yard by ID with label format (id and formatted name)
 * @permission Requires `canUseGetLabelById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ContainerYardsModels.LabelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetLabelById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ContainerYardsApi.getLabelById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getLabelByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(ContainerYardsAcl.canUseGetLabelById());
      return getLabelByIdQueryOptions({ id }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive container yard
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ContainerYardsModels.ContainerYardResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof ContainerYardsApi.archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ContainerYards>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(ContainerYardsAcl.canUseArchive());
      return ContainerYardsApi.archive(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive container yard
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ContainerYardsModels.ContainerYardResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof ContainerYardsApi.unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ContainerYards>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(ContainerYardsAcl.canUseUnarchive());
      return ContainerYardsApi.unarchive(id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update container yard
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { ContainerYardsModels.UpdateContainerYardRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ContainerYardsModels.ContainerYardResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof ContainerYardsApi.update, { id: string, data: ContainerYardsModels.UpdateContainerYardRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ContainerYards>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(ContainerYardsAcl.canUseUpdate());
      return ContainerYardsApi.update(id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const findByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.findById(id),
  queryFn: () => ContainerYardsApi.findById(id),
});

/** 
 * Query `useFindById`
 * @summary Get container yard
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ContainerYardsModels.ContainerYardResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ContainerYardsApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(ContainerYardsAcl.canUseFindById());
      return findByIdQueryOptions({ id }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
