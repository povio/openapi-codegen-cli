import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { ProjectLiteAcl } from "./projectLite.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ProjectLiteModels } from "./projectLite.models";

export namespace ProjectLiteQueries {
const create = (officeId: string, data: ProjectLiteModels.CreateProjectLiteRequestDTO) => {
  return AppRestClient.post(
    { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
    `/offices/${officeId}/project-lite`,
    ZodExtended.parse(ProjectLiteModels.CreateProjectLiteRequestDTOSchema, data),
    
  );
};

const paginate = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ProjectLiteModels.ProjectLitePaginateResponseSchema },
    `/offices/${officeId}/project-lite`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.ProjectLitePaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginateProjectLabels = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ProjectLiteModels.PaginateProjectLabelsResponseSchema },
    `/offices/${officeId}/project-lite/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.PaginateProjectLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (id: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
    `/offices/${officeId}/project-lite/${id}`,
    
  );
};

const update = (id: string, officeId: string, data: ProjectLiteModels.UpdateProjectLiteRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
    `/offices/${officeId}/project-lite/${id}`,
    ZodExtended.parse(ProjectLiteModels.UpdateProjectLiteRequestDTOSchema, data),
    
  );
};

const archive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/project-lite/${id}/archive`,
    
  );
};

const unarchive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/project-lite/${id}/unarchive`,
    
  );
};


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
 * @param { string } mutation.officeId Path parameter
 * @param { ProjectLiteModels.CreateProjectLiteRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: ProjectLiteModels.CreateProjectLiteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(ProjectLiteAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
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
 * @summary Get paginated projects
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.ProjectLitePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ProjectLiteAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Get paginated projects
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ProjectLiteModels.ProjectLitePaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ProjectLiteAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, pageParam, cursor) },
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
 * Query `usePaginateProjectLabels`
 * @summary Paginate project labels
 * @permission Requires `canUsePaginateProjectLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.PaginateProjectLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateProjectLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateProjectLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateProjectLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ProjectLiteAcl.canUsePaginateProjectLabels({ officeId } ));
    return paginateProjectLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateProjectLabelsInfinite
 * @summary Paginate project labels
 * @permission Requires `canUsePaginateProjectLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ProjectLiteModels.ProjectLiteFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ProjectLiteModels.PaginateProjectLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateProjectLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateProjectLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateProjectLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ProjectLiteAcl.canUsePaginateProjectLabels({ officeId } ));
    return paginateProjectLabels(officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Get project by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.id Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id, officeId }: { id: string, officeId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id, officeId),
    queryFn: () => { 
    checkAcl(ProjectLiteAcl.canUseFindById({ officeId } ));
    return findById(id, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update project
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { ProjectLiteModels.UpdateProjectLiteRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ProjectLiteModels.ProjectLiteResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, officeId: string, data: ProjectLiteModels.UpdateProjectLiteRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(ProjectLiteAcl.canUseUpdate({ officeId } ));
      return update(id, officeId, data)
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
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ProjectLiteAcl.canUseArchive({ officeId } ));
      return archive(id, officeId)
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
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ProjectLiteAcl.canUseUnarchive({ officeId } ));
      return unarchive(id, officeId)
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
