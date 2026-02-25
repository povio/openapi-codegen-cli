import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { HsCodesAcl } from "./hsCodes.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { HsCodesModels } from "./hsCodes.models";
import { HsCodesApi } from "./hsCodes.api";

export namespace HsCodesQueries {
export const moduleName = QueryModule.HsCodes;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: HsCodesModels.HsCodePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/hs-codes", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: HsCodesModels.HsCodePaginationFilterDto, cursor?: string) => [...keys.all, "/hs-codes", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: HsCodesModels.HsCodeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/hs-codes/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: HsCodesModels.HsCodeLabelFilterDto, cursor?: string) => [...keys.all, "/hs-codes/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/hs-codes/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate HS Codes
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchCode`
 * @param { HsCodesModels.HsCodePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<HsCodesModels.HsCodesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: HsCodesModels.HsCodePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof HsCodesApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(HsCodesAcl.canUsePaginate());
    return HsCodesApi.paginate(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate HS Codes
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchCode`
 * @param { HsCodesModels.HsCodePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<HsCodesModels.HsCodesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: HsCodesModels.HsCodePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof HsCodesApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(HsCodesAcl.canUsePaginate());
    return HsCodesApi.paginate(limit, order, filter, pageParam, cursor, config) },
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
 * @summary Create a new HS Code
 * @permission Requires `canUseCreate` ability 
 * @param { HsCodesModels.CreateHsCodeRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<HsCodesModels.HsCodeResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof HsCodesApi.create, { data: HsCodesModels.CreateHsCodeRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(HsCodesAcl.canUseCreate());
      return HsCodesApi.create(data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate HS codes with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchCode`
 * @param { HsCodesModels.HsCodeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<HsCodesModels.HsCodesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: HsCodesModels.HsCodeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof HsCodesApi.paginateLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(HsCodesAcl.canUsePaginateLabels());
    return HsCodesApi.paginateLabels(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate HS codes with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchCode`
 * @param { HsCodesModels.HsCodeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<HsCodesModels.HsCodesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: HsCodesModels.HsCodeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof HsCodesApi.paginateLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(HsCodesAcl.canUsePaginateLabels());
    return HsCodesApi.paginateLabels(limit, order, filter, pageParam, cursor, config) },
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
 * @summary Get HS Code Details by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<HsCodesModels.HsCodeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof HsCodesApi.findById, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(HsCodesAcl.canUseFindById());
    return HsCodesApi.findById(id, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update an existing HS Code
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { HsCodesModels.UpdateHsCodeRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<HsCodesModels.HsCodeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof HsCodesApi.update, { id: string, data: HsCodesModels.UpdateHsCodeRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(HsCodesAcl.canUseUpdate());
      return HsCodesApi.update(id, data, config)
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
 * @summary Archive an HS Code
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<HsCodesModels.HsCodeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof HsCodesApi.archive, { id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(HsCodesAcl.canUseArchive());
      return HsCodesApi.archive(id, config)
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
 * @summary Unarchive an HS Code
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<HsCodesModels.HsCodeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof HsCodesApi.unarchive, { id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(HsCodesAcl.canUseUnarchive());
      return HsCodesApi.unarchive(id, config)
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
