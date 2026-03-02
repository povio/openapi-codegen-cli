import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { CitiesAcl } from "./cities.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CitiesModels } from "./cities.models";

export namespace CitiesQueries {
const paginate = (limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CitiesModels.CitiesPaginateResponseSchema },
    `/cities`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.CitiesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CitiesModels.CityPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: CitiesModels.CreateCityRequestDTO) => {
  return AppRestClient.post(
    { resSchema: CitiesModels.CityResponseDTOSchema },
    `/cities`,
    ZodExtended.parse(CitiesModels.CreateCityRequestDTOSchema, data),
    
  );
};

const listCityLabels = (limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CitiesModels.ListCityLabelsResponseSchema },
    `/cities/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.ListCityLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CitiesModels.CityLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const getCityLabelById = (id: string) => {
  return AppRestClient.get(
    { resSchema: CitiesModels.CityLabelResponseDTOSchema },
    `/cities/${id}/labels`,
    
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: CitiesModels.CityResponseDTOSchema },
    `/cities/${id}`,
    
  );
};

const update = (id: string, data: CitiesModels.UpdateCityRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: CitiesModels.CityResponseDTOSchema },
    `/cities/${id}`,
    ZodExtended.parse(CitiesModels.UpdateCityRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/cities/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/cities/${id}/unarchive`,
    
  );
};


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
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CitiesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Cities
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CitiesModels.CitiesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CitiesAcl.canUsePaginate());
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
 * @summary Create city
 * @permission Requires `canUseCreate` ability 
 * @param { CitiesModels.CreateCityRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: CitiesModels.CreateCityRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Cities>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CitiesAcl.canUseCreate());
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
 * Query `useListCityLabels`
 * @summary Paginate cities with only their labels (id and name) and country information
 * @permission Requires `canUseListCityLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.ListCityLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCityLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listCityLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCityLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseListCityLabels());
    return listCityLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListCityLabelsInfinite
 * @summary Paginate cities with only their labels (id and name) and country information
 * @permission Requires `canUseListCityLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CitiesModels.CityLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CitiesModels.ListCityLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCityLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listCityLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listCityLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CitiesAcl.canUseListCityLabels());
    return listCityLabels(limit, order, filter, pageParam, cursor) },
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
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CityLabelResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCityLabelById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof getCityLabelById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCityLabelById(id),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseGetCityLabelById());
    return getCityLabelById(id) },
    ...options,
  });
};

/** 
 * Query `useFindById`
 * @summary Get city by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(CitiesAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update city
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { CitiesModels.UpdateCityRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CitiesModels.CityResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: CitiesModels.UpdateCityRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Cities>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(CitiesAcl.canUseUpdate());
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
 * @summary Archive city
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Cities>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CitiesAcl.canUseArchive());
      return archive(id)
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
 * @summary Unarchive city
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Cities>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CitiesAcl.canUseUnarchive());
      return unarchive(id)
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
