import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PackageTypesAcl } from "./packageTypes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PackageTypesModels } from "./packageTypes.models";

export namespace PackageTypesQueries {
const paginate = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PackageTypesModels.PackageTypesPaginateResponseSchema },
    `/package-types`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PackageTypesModels.PackageTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: PackageTypesModels.CreatePackageTypeRequestDTO) => {
  return AppRestClient.post(
    { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
    `/package-types`,
    ZodExtended.parse(PackageTypesModels.CreatePackageTypeRequestDTOSchema, data),
    
  );
};

const paginateLabels = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PackageTypesModels.PackageTypesPaginateLabelsResponseSchema },
    `/package-types/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PackageTypesModels.PackageTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
    `/package-types/${id}`,
    
  );
};

const update = (id: string, data: PackageTypesModels.UpdatePackageTypeRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
    `/package-types/${id}`,
    ZodExtended.parse(PackageTypesModels.UpdatePackageTypeRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.post(
    { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
    `/package-types/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.post(
    { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
    `/package-types/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.PackageTypes;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/package-types", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, cursor?: string) => [...keys.all, "/package-types", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/package-types/paginate/labels", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, cursor?: string) => [...keys.all, "/package-types/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/package-types/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Package Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
 * @param { PackageTypesModels.PackageTypePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PackageTypesModels.PackageTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PackageTypesAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Package Types
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
 * @param { PackageTypesModels.PackageTypePaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PackageTypesModels.PackageTypesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PackageTypesAcl.canUsePaginate());
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
 * @summary Create a new Package Type
 * @permission Requires `canUseCreate` ability 
 * @param { PackageTypesModels.CreatePackageTypeRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: PackageTypesModels.CreatePackageTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(PackageTypesAcl.canUseCreate());
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
 * @summary Paginate package type labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
 * @param { PackageTypesModels.PackageTypeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PackageTypesModels.PackageTypesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PackageTypesAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate package type labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
 * @param { PackageTypesModels.PackageTypeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PackageTypesModels.PackageTypesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PackageTypesAcl.canUsePaginateLabels());
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
 * Query `useFindById`
 * @summary Get Package Type by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PackageTypesModels.PackageTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(PackageTypesAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Package Type
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { PackageTypesModels.UpdatePackageTypeRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: PackageTypesModels.UpdatePackageTypeRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(PackageTypesAcl.canUseUpdate());
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
 * @summary Archive Package Type
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PackageTypesAcl.canUseArchive());
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
 * @summary Unarchive Package Type
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(PackageTypesAcl.canUseUnarchive());
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
