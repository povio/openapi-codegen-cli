import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { ChecklistItemsAcl } from "./checklistItems.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ChecklistItemsModels } from "./checklistItems.models";

export namespace ChecklistItemsQueries {
const create = (officeId: string, data: ChecklistItemsModels.CreateChecklistItemRequestDTO) => {
  return AppRestClient.post(
    { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
    `/offices/${officeId}/checklist-items`,
    ZodExtended.parse(ChecklistItemsModels.CreateChecklistItemRequestDTOSchema, data),
    
  );
};

const paginate = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ChecklistItemsModels.ChecklistItemsPaginateResponseSchema },
    `/offices/${officeId}/checklist-items`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginateLabels = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ChecklistItemsModels.ChecklistItemsPaginateLabelsResponseSchema },
    `/offices/${officeId}/checklist-items/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (id: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
    `/offices/${officeId}/checklist-items/${id}`,
    
  );
};

const update = (id: string, officeId: string, data: ChecklistItemsModels.UpdateChecklistItemRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
    `/offices/${officeId}/checklist-items/${id}`,
    ZodExtended.parse(ChecklistItemsModels.UpdateChecklistItemRequestDTOSchema, data),
    
  );
};

const archive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/checklist-items/${id}/archive`,
    
  );
};

const unarchive = (id: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/checklist-items/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.ChecklistItems;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/checklist-items", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/checklist-items", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/checklist-items/labels/paginate", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/checklist-items/labels/paginate", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) => [...keys.all, "/offices/:officeId/checklist-items/:id", id, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create checklist item
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { ChecklistItemsModels.CreateChecklistItemRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChecklistItemsModels.ChecklistItemResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: ChecklistItemsModels.CreateChecklistItemRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ChecklistItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(ChecklistItemsAcl.canUseCreate({ officeId } ));
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
 * @summary Get paginated checklist items
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ChecklistItemsModels.ChecklistItemFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChecklistItemsModels.ChecklistItemsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ChecklistItemsAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Get paginated checklist items
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ChecklistItemsModels.ChecklistItemFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ChecklistItemsModels.ChecklistItemsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ChecklistItemsAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate checklist item labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ChecklistItemsModels.ChecklistItemLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChecklistItemsModels.ChecklistItemsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ChecklistItemsAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate checklist item labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { ChecklistItemsModels.ChecklistItemLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ChecklistItemsModels.ChecklistItemsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ChecklistItemsAcl.canUsePaginateLabels({ officeId } ));
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
 * Query `useFindById`
 * @summary Get checklist item by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChecklistItemsModels.ChecklistItemResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id, officeId }: { id: string, officeId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id, officeId),
    queryFn: () => { 
    checkAcl(ChecklistItemsAcl.canUseFindById({ officeId } ));
    return findById(id, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update checklist item
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { ChecklistItemsModels.UpdateChecklistItemRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChecklistItemsModels.ChecklistItemResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, officeId: string, data: ChecklistItemsModels.UpdateChecklistItemRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ChecklistItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId, data }) => { 
      checkAcl(ChecklistItemsAcl.canUseUpdate({ officeId } ));
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
 * @summary Archive checklist item
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ChecklistItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ChecklistItemsAcl.canUseArchive({ officeId } ));
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
 * @summary Unarchive checklist item
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ChecklistItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, officeId }) => { 
      checkAcl(ChecklistItemsAcl.canUseUnarchive({ officeId } ));
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
