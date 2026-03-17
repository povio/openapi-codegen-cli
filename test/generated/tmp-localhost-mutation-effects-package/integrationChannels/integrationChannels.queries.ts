import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { IntegrationChannelsAcl } from "./integrationChannels.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { IntegrationChannelsModels } from "./integrationChannels.models";

export namespace IntegrationChannelsQueries {
const list = (officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: IntegrationChannelsModels.IntegrationChannelsListResponseSchema },
    `/offices/${officeId}/integration-channels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.IntegrationChannelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationChannelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto) => {
  return AppRestClient.post(
    { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
    `/offices/${officeId}/integration-channels`,
    ZodExtended.parse(IntegrationChannelsModels.CreateIntegrationChannelRequestDtoSchema, data),
    
  );
};

const paginateLabels = (officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: IntegrationChannelsModels.IntegrationChannelsPaginateLabelsResponseSchema },
    `/offices/${officeId}/integration-channels/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.IntegrationChannelsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationChannelLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
    `/offices/${officeId}/integration-channels/${id}`,
    
  );
};

const update = (officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto) => {
  return AppRestClient.patch(
    { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
    `/offices/${officeId}/integration-channels/${id}`,
    ZodExtended.parse(IntegrationChannelsModels.UpdateIntegrationChannelRequestDtoSchema, data),
    
  );
};

const archive = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
    `/offices/${officeId}/integration-channels/${id}/archive`,
    
  );
};

const unarchive = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
    `/offices/${officeId}/integration-channels/${id}/unarchive`,
    
  );
};

const testConnection = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: IntegrationChannelsModels.TestConnectionResponseDtoSchema },
    `/offices/${officeId}/integration-channels/${id}/test-connection`,
    
  );
};


export const moduleName = QueryModule.IntegrationChannels;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/integration-channels/:id", officeId, id] as const,
};

/** 
 * Query `useList`
 * @summary List integration channels for an office
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.IntegrationChannelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List integration channels for an office
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<IntegrationChannelsModels.IntegrationChannelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
    return list(officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Create integration channel
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { IntegrationChannelsModels.CreateIntegrationChannelRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
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
 * @summary Paginate integration channel labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.IntegrationChannelsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate integration channel labels
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<IntegrationChannelsModels.IntegrationChannelsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(IntegrationChannelsAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Get integration channel by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(officeId, id),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUseFindById({ officeId } ));
    return findById(officeId, id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update integration channel by id
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { IntegrationChannelsModels.UpdateIntegrationChannelRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUpdate({ officeId } ));
      return update(officeId, id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.findById(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive integration channel by id
 * @permission Requires `canUseArchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseArchive({ officeId } ));
      return archive(officeId, id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.findById(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive integration channel by id
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUnarchive({ officeId } ));
      return unarchive(officeId, id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.findById(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useTestConnection`
 * @summary Test integration channel SFTP connection
 * @permission Requires `canUseTestConnection` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.TestConnectionResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useTestConnection = (options?: AppMutationOptions<typeof testConnection, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseTestConnection({ officeId } ));
      return testConnection(officeId, id)
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
