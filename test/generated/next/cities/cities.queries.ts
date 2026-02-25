import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CitiesAcl } from "./cities.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CitiesModels } from "./cities.models";
import { CitiesApi } from "./cities.api";

export namespace CitiesQueries {
export const moduleName = QueryModule.Cities;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/cities", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, cursor?: string) => [...keys.all, "/cities", "infinite", limit, order, filter, cursor] as const,
    listCityLabels: (limit?: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/cities/paginate/labels", limit, order, filter, page, cursor] as const,
    listCityLabelsInfinite: (limit?: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, cursor?: string) => [...keys.all, "/cities/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    getCityLabelById: (id: string) => [...keys.all, "/cities/:id/labels", id] as const,
    findById: (id: string) => [...keys.all, "/cities/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Cities
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CitiesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CitiesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUsePaginate());
    return CitiesApi.paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Cities
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CitiesModels.CitiesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CitiesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CitiesAcl.canUsePaginate());
    return CitiesApi.paginate(limit, order, filter, pageParam, cursor) },
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
 * @summary Create city
 * @permission Requires `canUseCreate` ability 
 * @param { CitiesModels.CreateCityRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof CitiesApi.create, { data: CitiesModels.CreateCityRequestDTO }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CitiesAcl.canUseCreate());
      return CitiesApi.create(data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useListCityLabels`
 * @summary Paginate cities with only their labels (id and name) and country information
 * @permission Requires `canUseListCityLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.ListCityLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCityLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CitiesApi.listCityLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCityLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseListCityLabels());
    return CitiesApi.listCityLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListCityLabelsInfinite
 * @summary Paginate cities with only their labels (id and name) and country information
 * @permission Requires `canUseListCityLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CitiesModels.ListCityLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCityLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CitiesApi.listCityLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listCityLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CitiesAcl.canUseListCityLabels());
    return CitiesApi.listCityLabels(limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useGetCityLabelById`
 * @summary Get city by ID with label format (id and formatted name) and country information
 * @permission Requires `canUseGetCityLabelById` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CityLabelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCityLabelById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof CitiesApi.getCityLabelById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCityLabelById(id),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseGetCityLabelById());
    return CitiesApi.getCityLabelById(id) },
    ...options,
  });
};

/** 
 * Query `useFindById`
 * @summary Get city by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof CitiesApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseFindById());
    return CitiesApi.findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update city
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { CitiesModels.UpdateCityRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof CitiesApi.update, { id: string, data: CitiesModels.UpdateCityRequestDTO }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(CitiesAcl.canUseUpdate());
      return CitiesApi.update(id, data)
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
 * @summary Archive city
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof CitiesApi.archive, { id: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CitiesAcl.canUseArchive());
      return CitiesApi.archive(id)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive city
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof CitiesApi.unarchive, { id: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CitiesAcl.canUseUnarchive());
      return CitiesApi.unarchive(id)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
