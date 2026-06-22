import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CargoTypesAcl } from "./cargoTypes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CargoTypesModels } from "./cargoTypes.models";

export namespace CargoTypesQueries {
const paginate = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CargoTypesModels.CargoTypesPaginateResponseSchema },
    `/cargo-types`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CargoTypesModels.CargoTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: CargoTypesModels.CreateCargoTypeRequestDTO) => {
  return AppRestClient.post(
    { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
    `/cargo-types`,
    ZodExtended.parse(CargoTypesModels.CreateCargoTypeRequestDTOSchema, data),
    
  );
};

const paginateLabels = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CargoTypesModels.CargoTypesPaginateLabelsResponseSchema },
    `/cargo-types/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CargoTypesModels.CargoTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
    `/cargo-types/${id}`,
    
  );
};

const update = (id: string, data: CargoTypesModels.UpdateCargoTypeRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
    `/cargo-types/${id}`,
    ZodExtended.parse(CargoTypesModels.UpdateCargoTypeRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.post(
    { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
    `/cargo-types/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.post(
    { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
    `/cargo-types/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.CargoTypes;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/cargo-types", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, cursor?: string) => [...keys.all, "/cargo-types", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/cargo-types/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, cursor?: string) => [...keys.all, "/cargo-types/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/cargo-types/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Cargo Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, description, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchcode`
 * @param { CargoTypesModels.CargoTypePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CargoTypesModels.CargoTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CargoTypesAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Cargo Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, description, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchcode`
 * @param { CargoTypesModels.CargoTypePaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CargoTypesModels.CargoTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CargoTypesAcl.canUsePaginate());
    return paginate(limit, order, filter, pageParam, cursor) },
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
 * Mutation `useCreate`
 * @summary Create Cargo Type
 * @permission Requires `canUseCreate` ability 
 * @param { CargoTypesModels.CreateCargoTypeRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CargoTypesModels.CargoTypeResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: CargoTypesModels.CreateCargoTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CargoTypesAcl.canUseCreate());
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
 * Query `usePaginateLabels`
 * @summary Paginate cargo types with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, description, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchcode`
 * @param { CargoTypesModels.CargoTypeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CargoTypesModels.CargoTypesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CargoTypesAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate cargo types with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, description, createdAt, updatedAt, createdBy, updatedBy, name. Example: `matchcode`
 * @param { CargoTypesModels.CargoTypeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CargoTypesModels.CargoTypesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CargoTypesAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, pageParam, cursor) },
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
 * @summary Get Cargo Type by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CargoTypesModels.CargoTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(CargoTypesAcl.canUseFindById());
    return findById(id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Cargo Type
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { CargoTypesModels.UpdateCargoTypeRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CargoTypesModels.CargoTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: CargoTypesModels.UpdateCargoTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(CargoTypesAcl.canUseUpdate());
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
 * @summary Archive Cargo Type
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CargoTypesModels.CargoTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CargoTypesAcl.canUseArchive());
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
 * @summary Unarchive Cargo Type
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CargoTypesModels.CargoTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(CargoTypesAcl.canUseUnarchive());
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
