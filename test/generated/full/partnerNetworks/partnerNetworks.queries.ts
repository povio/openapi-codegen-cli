import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PartnerNetworksAcl } from "./partnerNetworks.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PartnerNetworksModels } from "./partnerNetworks.models";
import { PartnerNetworksApi } from "./partnerNetworks.api";

export namespace PartnerNetworksQueries {
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
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworksPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PartnerNetworksApi.paginateLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUsePaginateLabels());
    return PartnerNetworksApi.paginateLabels(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate partner networks with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PartnerNetworksModels.PartnerNetworksPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PartnerNetworksApi.paginateLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PartnerNetworksAcl.canUsePaginateLabels());
    return PartnerNetworksApi.paginateLabels(limit, order, filter, pageParam, cursor, config) },
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
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PartnerNetworksApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUsePaginate());
    return PartnerNetworksApi.paginate(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Partner Networks
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PartnerNetworksModels.PartnerNetworkPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PartnerNetworksModels.PartnerNetworksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PartnerNetworksApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PartnerNetworksAcl.canUsePaginate());
    return PartnerNetworksApi.paginate(limit, order, filter, pageParam, cursor, config) },
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
 * @param { PartnerNetworksModels.CreatePartnerNetworkRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof PartnerNetworksApi.create, { data: PartnerNetworksModels.CreatePartnerNetworkRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(PartnerNetworksAcl.canUseCreate());
      return PartnerNetworksApi.create(data, config)
    },
    ...options,
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
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof PartnerNetworksApi.findById, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(PartnerNetworksAcl.canUseFindById());
    return PartnerNetworksApi.findById(id, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Partner Network
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { PartnerNetworksModels.UpdatePartnerNetworkRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof PartnerNetworksApi.update, { id: string, data: PartnerNetworksModels.UpdatePartnerNetworkRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(PartnerNetworksAcl.canUseUpdate());
      return PartnerNetworksApi.update(id, data, config)
    },
    ...options,
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
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof PartnerNetworksApi.archive, { id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PartnerNetworksAcl.canUseArchive());
      return PartnerNetworksApi.archive(id, config)
    },
    ...options,
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
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PartnerNetworksModels.PartnerNetworkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof PartnerNetworksApi.unarchive, { id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PartnerNetworksAcl.canUseUnarchive());
      return PartnerNetworksApi.unarchive(id, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { id } = variables;
      const updateKeys = [keys.findById(id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
