import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PortsAcl } from "./ports.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PortsModels } from "./ports.models";

export namespace PortsQueries {
const paginate = (limit: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PortsModels.PortsPaginateResponseSchema },
    `/ports`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PortsModels.PortPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: PortsModels.CreatePortRequestDTO) => {
  return AppRestClient.post(
    { resSchema: PortsModels.PortResponseDTOSchema },
    `/ports`,
    ZodExtended.parse(PortsModels.CreatePortRequestDTOSchema, data),
    
  );
};

const paginateLabels = (limit: number, order?: string, filter?: PortsModels.PortLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PortsModels.PortsPaginateLabelsResponseSchema },
    `/ports/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PortsModels.PortLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const update = (id: string, data: PortsModels.UpdatePortRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: PortsModels.PortResponseDTOSchema },
    `/ports/${id}`,
    ZodExtended.parse(PortsModels.UpdatePortRequestDTOSchema, data),
    
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: PortsModels.PortResponseDTOSchema },
    `/ports/${id}`,
    
  );
};


export const moduleName = QueryModule.Ports;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/ports", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, cursor?: string) => [...keys.all, "/ports", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (limit?: number, order?: string, filter?: PortsModels.PortLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/ports/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: PortsModels.PortLabelFilterDto, cursor?: string) => [...keys.all, "/ports/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/ports/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Ports
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PortsModels.PortPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PortsModels.PortsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PortsAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Ports
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PortsModels.PortPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PortsModels.PortsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PortsAcl.canUsePaginate());
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
 * @summary Create port
 * @permission Requires `canUseCreate` ability 
 * @param { PortsModels.CreatePortRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PortsModels.PortResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: PortsModels.CreatePortRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(PortsAcl.canUseCreate());
      return create(data)
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
 * @summary Paginate ports with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PortsModels.PortLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PortsModels.PortsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: PortsModels.PortLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PortsAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate ports with only their labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { PortsModels.PortLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PortsModels.PortsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: PortsModels.PortLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PortsAcl.canUsePaginateLabels());
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
 * Mutation `useUpdate`
 * @summary Update port
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { PortsModels.UpdatePortRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PortsModels.PortResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: PortsModels.UpdatePortRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(PortsAcl.canUseUpdate());
      return update(id, data)
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
 * Query `useFindById`
 * @summary Get port by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PortsModels.PortResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(PortsAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

}
