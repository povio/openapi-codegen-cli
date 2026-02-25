import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { IntegrationChannelsAcl } from "./integrationChannels.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { IntegrationChannelsModels } from "./integrationChannels.models";
import { IntegrationChannelsApi } from "./integrationChannels.api";

export namespace IntegrationChannelsQueries {
export const moduleName = QueryModule.IntegrationChannels;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/integration-channels/:id", officeId, id] as const,
    listMessages: (officeId: string, id: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationMessageFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/:id/messages", officeId, id, limit, order, filter, page, cursor] as const,
    listMessagesInfinite: (officeId: string, id: string, limit?: number, order?: string, filter?: IntegrationChannelsModels.IntegrationMessageFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/integration-channels/:id/messages", "infinite", officeId, id, limit, order, filter, cursor] as const,
};

/** 
 * Query `useList`
 * @summary List integration channels for an office
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.IntegrationChannelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
    return IntegrationChannelsApi.list(officeId, limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List integration channels for an office
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, name, businessPartner, lastPolledAt. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationChannelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<IntegrationChannelsModels.IntegrationChannelsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof IntegrationChannelsApi.list, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(IntegrationChannelsAcl.canUseList({ officeId } ));
    return IntegrationChannelsApi.list(officeId, limit, order, filter, pageParam, cursor, config) },
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
 * @param { string } mutation.officeId Path parameter
 * @param { IntegrationChannelsModels.CreateIntegrationChannelRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof IntegrationChannelsApi.create, { officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseCreate({ officeId } ));
      return IntegrationChannelsApi.create(officeId, data, config)
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
 * @summary Get integration channel by id
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.findById, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(officeId, id),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUseFindById({ officeId } ));
    return IntegrationChannelsApi.findById(officeId, id, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update integration channel by id
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { IntegrationChannelsModels.UpdateIntegrationChannelRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof IntegrationChannelsApi.update, { officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUpdate({ officeId } ));
      return IntegrationChannelsApi.update(officeId, id, data, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof IntegrationChannelsApi.archive, { officeId: string, id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseArchive({ officeId } ));
      return IntegrationChannelsApi.archive(officeId, id, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.IntegrationChannelResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof IntegrationChannelsApi.unarchive, { officeId: string, id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseUnarchive({ officeId } ));
      return IntegrationChannelsApi.unarchive(officeId, id, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<IntegrationChannelsModels.TestConnectionResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useTestConnection = (options?: AppMutationOptions<typeof IntegrationChannelsApi.testConnection, { officeId: string, id: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(IntegrationChannelsAcl.canUseTestConnection({ officeId } ));
      return IntegrationChannelsApi.testConnection(officeId, id, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useListMessages`
 * @summary Paginate integration channel messages
 * @permission Requires `canUseListMessages` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, direction, format. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationMessageFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<IntegrationChannelsModels.ListMessagesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListMessages = <TData>({ officeId, id, limit, order, filter, page, cursor }: { officeId: string, id: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationMessageFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof IntegrationChannelsApi.listMessages, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listMessages(officeId, id, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(IntegrationChannelsAcl.canUseListMessages({ officeId } ));
    return IntegrationChannelsApi.listMessages(officeId, id, limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `useListMessagesInfinite
 * @summary Paginate integration channel messages
 * @permission Requires `canUseListMessages` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, status, direction, format. Example: `createdAt`
 * @param { IntegrationChannelsModels.IntegrationMessageFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<IntegrationChannelsModels.ListMessagesResponse> } 
 * @statusCodes [200, 401]
 */
export const useListMessagesInfinite = <TData>({ officeId, id, limit, order, filter, cursor }: { officeId: string, id: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationMessageFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof IntegrationChannelsApi.listMessages, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listMessagesInfinite(officeId, id, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(IntegrationChannelsAcl.canUseListMessages({ officeId } ));
    return IntegrationChannelsApi.listMessages(officeId, id, limit, order, filter, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
