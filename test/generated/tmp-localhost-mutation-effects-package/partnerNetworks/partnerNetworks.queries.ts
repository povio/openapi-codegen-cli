import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PartnerNetworksAcl } from "./partnerNetworks.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PartnerNetworksModels } from "./partnerNetworks.models";

export namespace PartnerNetworksQueries {
const paginateLabels = (limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PartnerNetworksModels.PartnerNetworksPaginateLabelsResponseSchema },
    `/partner-networks/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginate = (limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PartnerNetworksModels.PartnerNetworksPaginateResponseSchema },
    `/partner-networks`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: PartnerNetworksModels.CreatePartnerNetworkRequestDTO) => {
  return AppRestClient.post(
    { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
    `/partner-networks`,
    ZodExtended.parse(PartnerNetworksModels.CreatePartnerNetworkRequestDTOSchema, data),
    
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
    `/partner-networks/${id}`,
    
  );
};

const update = (id: string, data: PartnerNetworksModels.UpdatePartnerNetworkRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
    `/partner-networks/${id}`,
    ZodExtended.parse(PartnerNetworksModels.UpdatePartnerNetworkRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.patch(
    { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
    `/partner-networks/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.patch(
    { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
    `/partner-networks/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.PartnerNetworks;

export const keys = {
    all: [moduleName] as const,
    paginateLabels: (limit?: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/partner-networks/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, cursor?: string) => [...keys.all, "/partner-networks/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    paginate: (limit?: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/partner-networks", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, cursor?: string) => [...keys.all, "/partner-networks", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/partner-networks/:id", id] as const,
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate partner networks with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworksPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate partner networks with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PartnerNetworksModels.PartnerNetworksPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PartnerNetworksAcl.canUsePaginateLabels());
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
 * Query `usePaginate`
 * @summary Paginate Partner Networks
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Partner Networks
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PartnerNetworksModels.PartnerNetworksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PartnerNetworksAcl.canUsePaginate());
    return paginate(limit, order, filter, pageParam, cursor) },
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
 * @summary Create a new Partner Network
 * @permission Requires `canUseCreate` ability 
 * @param { PartnerNetworksModels.CreatePartnerNetworkRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: PartnerNetworksModels.CreatePartnerNetworkRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PartnerNetworks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(PartnerNetworksAcl.canUseCreate());
      return create(data)
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
 * @summary Get Partner Network by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Partner Network
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { PartnerNetworksModels.UpdatePartnerNetworkRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: PartnerNetworksModels.UpdatePartnerNetworkRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PartnerNetworks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(PartnerNetworksAcl.canUseUpdate());
      return update(id, data)
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
 * Mutation `useArchive`
 * @summary Archive Partner Network
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PartnerNetworks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PartnerNetworksAcl.canUseArchive());
      return archive(id)
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
 * @summary Unarchive Partner Network
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PartnerNetworks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PartnerNetworksAcl.canUseUnarchive());
      return unarchive(id)
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

}
