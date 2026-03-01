import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { VatRulesAcl } from "./vatRules.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { VatRulesModels } from "./vatRules.models";

export namespace VatRulesQueries {
const paginateLabels = (limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: VatRulesModels.VatRulesPaginateLabelsResponseSchema },
    `/vat-rules/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(VatRulesModels.VatRulesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const list = (limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: VatRulesModels.VatRulesListResponseSchema },
    `/vat-rules`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(VatRulesModels.VatRulesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: VatRulesModels.CreateVatRuleRequestDTO) => {
  return AppRestClient.post(
    { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
    `/vat-rules`,
    ZodExtended.parse(VatRulesModels.CreateVatRuleRequestDTOSchema, data),
    
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
    `/vat-rules/${id}`,
    
  );
};

const update = (id: string, data: VatRulesModels.UpdateVatRuleRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
    `/vat-rules/${id}`,
    ZodExtended.parse(VatRulesModels.UpdateVatRuleRequestDTOSchema, data),
    
  );
};

const archive = (id: string) => {
  return AppRestClient.post(
    { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
    `/vat-rules/${id}/archive`,
    
  );
};

const unarchive = (id: string) => {
  return AppRestClient.post(
    { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
    `/vat-rules/${id}/unarchive`,
    
  );
};


export const moduleName = QueryModule.VatRules;

export const keys = {
    all: [moduleName] as const,
    paginateLabels: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => [...keys.all, "/vat-rules/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string) => [...keys.all, "/vat-rules/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    list: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) => [...keys.all, "/vat-rules", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string) => [...keys.all, "/vat-rules", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/vat-rules/:id", id] as const,
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate VAT rule labels (id and matchcode only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(VatRulesAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate VAT rule labels (id and matchcode only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(VatRulesAcl.canUsePaginateLabels());
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
 * Query `useList`
 * @summary List VAT rules
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRulesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(VatRulesAcl.canUseList());
    return list(limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List VAT rules
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
 * @param { VatRulesModels.VatRuleFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(VatRulesAcl.canUseList());
    return list(limit, order, filter, pageParam, cursor) },
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
 * @summary Create a new VAT rule
 * @permission Requires `canUseCreate` ability 
 * @param { VatRulesModels.CreateVatRuleRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [201, 401, 409]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: VatRulesModels.CreateVatRuleRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(VatRulesAcl.canUseCreate());
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
 * Query `useFindById`
 * @summary Get VAT rule by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => { 
    checkAcl(VatRulesAcl.canUseFindById());
    return findById(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update VAT rule by ID
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { VatRulesModels.UpdateVatRuleRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: VatRulesModels.UpdateVatRuleRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(VatRulesAcl.canUseUpdate());
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
 * Mutation `useArchive`
 * @summary Archive VAT rule
 * @permission Requires `canUseArchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(VatRulesAcl.canUseArchive());
      return archive(id)
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
 * @summary Unarchive VAT rule
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id }) => { 
      checkAcl(VatRulesAcl.canUseUnarchive());
      return unarchive(id)
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
