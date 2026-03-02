import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { ChargeTypesAcl } from "./chargeTypes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ChargeTypesModels } from "./chargeTypes.models";

export namespace ChargeTypesQueries {
const findAll = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ChargeTypesModels.ChargeTypesFindAllResponseSchema },
    `/charge-types/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ChargeTypesModels.ChargeTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginate = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ChargeTypesModels.ChargeTypesPaginateResponseSchema },
    `/charge-types`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ChargeTypesModels.ChargeTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: ChargeTypesModels.CreateChargeTypeRequestDTO) => {
  return AppRestClient.post(
    { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
    `/charge-types`,
    ZodExtended.parse(ChargeTypesModels.CreateChargeTypeRequestDTOSchema, data),
    
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
    `/charge-types/${id}`,
    
  );
};

const update = (id: string, data: ChargeTypesModels.UpdateChargeTypeRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
    `/charge-types/${id}`,
    ZodExtended.parse(ChargeTypesModels.UpdateChargeTypeRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.post(
    { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
    `/charge-types/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.post(
    { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
    `/charge-types/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.ChargeTypes;

export const keys = {
    all: [moduleName] as const,
    findAll: (limit?: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/charge-types/paginate/labels", limit, order, filter, page, cursor] as const,
    findAllInfinite: (limit?: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, cursor?: string) => [...keys.all, "/charge-types/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    paginate: (limit?: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/charge-types", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, cursor?: string) => [...keys.all, "/charge-types", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/charge-types/:id", id] as const,
};

/** 
 * Query `useFindAll`
 * @summary Paginate charge types with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
 * @param { ChargeTypesModels.ChargeTypeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChargeTypesModels.ChargeTypesFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ChargeTypesAcl.canUseFindAll());
    return findAll(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @summary Paginate charge types with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
 * @param { ChargeTypesModels.ChargeTypeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ChargeTypesModels.ChargeTypesFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findAll, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findAllInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ChargeTypesAcl.canUseFindAll());
    return findAll(limit, order, filter, pageParam, cursor) },
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
 * @summary Paginate Charge Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
 * @param { ChargeTypesModels.ChargeTypePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChargeTypesModels.ChargeTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(ChargeTypesAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Charge Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
 * @param { ChargeTypesModels.ChargeTypePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ChargeTypesModels.ChargeTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(ChargeTypesAcl.canUsePaginate());
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
 * @summary Create a new Charge Type
 * @permission Requires `canUseCreate` ability 
 * @param { ChargeTypesModels.CreateChargeTypeRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: ChargeTypesModels.CreateChargeTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(ChargeTypesAcl.canUseCreate());
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
 * @summary Get Charge Type Details by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ChargeTypesModels.ChargeTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(ChargeTypesAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update an existing Charge Type
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { ChargeTypesModels.UpdateChargeTypeRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: ChargeTypesModels.UpdateChargeTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(ChargeTypesAcl.canUseUpdate());
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
 * @summary Archive a Charge Type
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(ChargeTypesAcl.canUseArchive());
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
 * @summary Unarchive a Charge Type
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(ChargeTypesAcl.canUseUnarchive());
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
