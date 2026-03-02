import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useInfiniteQuery, UseInfiniteQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
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
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

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
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DunningLevelsAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DunningLevelsAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, pageParam, cursor) },
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
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id, officeId),
    queryFn: () => { 
    checkAcl(DunningLevelsAcl.canUseFindById({ officeId } ));
    return findById(id, officeId) },
    ...options,
  });
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
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
