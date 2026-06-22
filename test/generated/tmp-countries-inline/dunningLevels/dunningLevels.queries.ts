import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningLevelsAcl } from "./dunningLevels.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningLevelsModels } from "./dunningLevels.models";

export namespace DunningLevelsQueries {
const paginateLabels = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: DunningLevelsModels.DunningLevelsPaginateLabelsResponseSchema },
    `/offices/${officeId}/dunning-levels/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(DunningLevelsModels.DunningLevelLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const list = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: DunningLevelsModels.DunningLevelsListResponseSchema },
    `/offices/${officeId}/dunning-levels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(DunningLevelsModels.DunningLevelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: DunningLevelsModels.CreateDunningLevelRequestDTO) => {
  return AppRestClient.post(
    { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
    `/offices/${officeId}/dunning-levels`,
    ZodExtended.parse(DunningLevelsModels.CreateDunningLevelRequestDTOSchema, data),
    
  );
};

const findById = (id: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
    `/offices/${officeId}/dunning-levels/${id}`,
    
  );
};

const update = (id: string, officeId: string, data: DunningLevelsModels.UpdateDunningLevelRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
    `/offices/${officeId}/dunning-levels/${id}`,
    ZodExtended.parse(DunningLevelsModels.UpdateDunningLevelRequestDTOSchema, data),
    
  );
};

const archive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
    `/offices/${officeId}/dunning-levels/${id}/archive`,
    
  );
};

const unarchive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
    `/offices/${officeId}/dunning-levels/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.DunningLevels;

export const keys = {
    all: [moduleName] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/dunning-levels/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/dunning-levels/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/dunning-levels", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/dunning-levels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) => [...keys.all, "/offices/:officeId/dunning-levels/:id", id, officeId] as const,
};

export const paginateLabelsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
  queryFn: () => paginateLabels(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate dunning level labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
 * @param { DunningLevelsModels.DunningLevelLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningLevelsModels.DunningLevelsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateLabelsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => paginateLabels(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate dunning level labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
 * @param { DunningLevelsModels.DunningLevelLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DunningLevelsModels.DunningLevelsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

export const listQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(officeId, limit, order, filter, page, cursor),
  queryFn: () => list(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List dunning levels
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
 * @param { DunningLevelsModels.DunningLevelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningLevelsModels.DunningLevelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningLevelsAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => list(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List dunning levels
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
 * @param { DunningLevelsModels.DunningLevelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DunningLevelsModels.DunningLevelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningLevelsAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create dunning level
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { DunningLevelsModels.CreateDunningLevelRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: DunningLevelsModels.CreateDunningLevelRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningLevels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(DunningLevelsAcl.canUseCreate({ officeId } ));
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

export const findByIdQueryOptions = ({ id, officeId }: { id: string, officeId: string }) => ({
  queryKey: keys.findById(id, officeId),
  queryFn: () => findById(id, officeId),
});

/** 
 * Query `useFindById`
 * @summary Get dunning level by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningLevelsModels.DunningLevelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id, officeId }: { id: string, officeId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ id, officeId }),
    queryFn: async () => {
    checkAcl(DunningLevelsAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ id, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { id, officeId }: { id: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findByIdQueryOptions({ id, officeId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update dunning level
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { DunningLevelsModels.UpdateDunningLevelRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, officeId: string, data: DunningLevelsModels.UpdateDunningLevelRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningLevels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(DunningLevelsAcl.canUseUpdate({ officeId } ));
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
 * @summary Archive a dunning level
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningLevels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(DunningLevelsAcl.canUseArchive({ officeId } ));
      return archive(id, officeId)
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
 * Mutation `useUnarchive`
 * @summary Unarchive a dunning level
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningLevels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(DunningLevelsAcl.canUseUnarchive({ officeId } ));
      return unarchive(id, officeId)
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

}
