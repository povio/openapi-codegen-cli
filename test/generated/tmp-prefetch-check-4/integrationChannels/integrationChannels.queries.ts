import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { IntegrationChannelsAcl } from "./integrationChannels.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { IntegrationChannelsModels } from "./integrationChannels.models";
import { IntegrationChannelsApi } from "./integrationChannels.api";

export namespace IntegrationChannelsQueries {
export const moduleName = QueryModule.IntegrationChannels;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/integration-channels/:id", officeId, id] as const,
};

export const listQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(officeId, limit, order, filter, page, cursor),
  queryFn: () => IntegrationChannelsApi.list(officeId, limit, order, filter, page, cursor),
});

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
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => IntegrationChannelsApi.list(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof IntegrationChannelsApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
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
export const useCreate = (options?: AppMutationOptions<typeof IntegrationChannelsApi.create, { officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseCreate({ officeId } ));
      return IntegrationChannelsApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const paginateLabelsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
  queryFn: () => IntegrationChannelsApi.paginateLabels(officeId, limit, order, filter, page, cursor),
});

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
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(IntegrationChannelsAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateLabelsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => IntegrationChannelsApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof IntegrationChannelsApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(IntegrationChannelsAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

export const findByIdQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.findById(officeId, id),
  queryFn: () => IntegrationChannelsApi.findById(officeId, id),
});

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
export const useFindById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(IntegrationChannelsAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findByIdQueryOptions({ officeId, id }), ...options });
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
export const useUpdate = (options?: AppMutationOptions<typeof IntegrationChannelsApi.update, { officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUpdate({ officeId } ));
      return IntegrationChannelsApi.update(officeId, id, data)
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
export const useArchive = (options?: AppMutationOptions<typeof IntegrationChannelsApi.archive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseArchive({ officeId } ));
      return IntegrationChannelsApi.archive(officeId, id)
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
export const useUnarchive = (options?: AppMutationOptions<typeof IntegrationChannelsApi.unarchive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUnarchive({ officeId } ));
      return IntegrationChannelsApi.unarchive(officeId, id)
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
export const useTestConnection = (options?: AppMutationOptions<typeof IntegrationChannelsApi.testConnection, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.IntegrationChannels>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseTestConnection({ officeId } ));
      return IntegrationChannelsApi.testConnection(officeId, id)
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
