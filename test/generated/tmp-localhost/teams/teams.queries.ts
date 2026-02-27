import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { TeamsAcl } from "./teams.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { TeamsModels } from "./teams.models";
import { TeamsApi } from "./teams.api";

export namespace TeamsQueries {
export const moduleName = QueryModule.Teams;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: TeamsModels.TeamFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/teams", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: TeamsModels.TeamFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/teams", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: TeamsModels.TeamLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/teams/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: TeamsModels.TeamLabelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/teams/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) => [...keys.all, "/offices/:officeId/teams/:id", id, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create team
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { TeamsModels.CreateTeamRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<TeamsModels.TeamResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof TeamsApi.create, { officeId: string, data: TeamsModels.CreateTeamRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(TeamsAcl.canUseCreate({ officeId } ));
      return TeamsApi.create(officeId, data)
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
 * Query `usePaginate`
 * @summary Get paginated teams
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { TeamsModels.TeamFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<TeamsModels.TeamsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof TeamsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(TeamsAcl.canUsePaginate({ officeId } ));
    return TeamsApi.paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Get paginated teams
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { TeamsModels.TeamFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<TeamsModels.TeamsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof TeamsApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(TeamsAcl.canUsePaginate({ officeId } ));
    return TeamsApi.paginate(officeId, limit, order, filter, pageParam, cursor) },
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
 * Query `usePaginateLabels`
 * @summary Paginate team labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { TeamsModels.TeamLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<TeamsModels.TeamsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof TeamsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(TeamsAcl.canUsePaginateLabels({ officeId } ));
    return TeamsApi.paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate team labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { TeamsModels.TeamLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<TeamsModels.TeamsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof TeamsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(TeamsAcl.canUsePaginateLabels({ officeId } ));
    return TeamsApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
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
 * Query `useFindById`
 * @summary Get team by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.id Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<TeamsModels.TeamResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id, officeId }: { id: string, officeId: string }, options?: AppQueryOptions<typeof TeamsApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id, officeId),
    queryFn: () => { 
    checkAcl(TeamsAcl.canUseFindById({ officeId } ));
    return TeamsApi.findById(id, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update team name
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { TeamsModels.UpdateTeamRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<TeamsModels.TeamResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof TeamsApi.update, { id: string, officeId: string, data: TeamsModels.UpdateTeamRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(TeamsAcl.canUseUpdate({ officeId } ));
      return TeamsApi.update(id, officeId, data)
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
 * Mutation `useBulkAddMembers`
 * @summary Bulk add team members
 * @permission Requires `canUseBulkAddMembers` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { TeamsModels.BulkAddTeamMembersRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<TeamsModels.TeamResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useBulkAddMembers = (options?: AppMutationOptions<typeof TeamsApi.bulkAddMembers, { id: string, officeId: string, data: TeamsModels.BulkAddTeamMembersRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(TeamsAcl.canUseBulkAddMembers({ officeId } ));
      return TeamsApi.bulkAddMembers(id, officeId, data)
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
 * Mutation `useBulkRemoveMembers`
 * @summary Bulk remove team members
 * @permission Requires `canUseBulkRemoveMembers` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { TeamsModels.BulkRemoveTeamMembersRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<TeamsModels.TeamResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useBulkRemoveMembers = (options?: AppMutationOptions<typeof TeamsApi.bulkRemoveMembers, { id: string, officeId: string, data: TeamsModels.BulkRemoveTeamMembersRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(TeamsAcl.canUseBulkRemoveMembers({ officeId } ));
      return TeamsApi.bulkRemoveMembers(id, officeId, data)
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
 * @summary Archive team
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof TeamsApi.archive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(TeamsAcl.canUseArchive({ officeId } ));
      return TeamsApi.archive(id, officeId)
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
 * @summary Unarchive team
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof TeamsApi.unarchive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(TeamsAcl.canUseUnarchive({ officeId } ));
      return TeamsApi.unarchive(id, officeId)
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
