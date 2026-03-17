import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { InttraShippingInstructionMessagesAcl } from "./inttraShippingInstructionMessages.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InttraShippingInstructionMessagesModels } from "./inttraShippingInstructionMessages.models";
import { InttraShippingInstructionMessagesApi } from "./inttraShippingInstructionMessages.api";

export namespace InttraShippingInstructionMessagesQueries {
export const moduleName = QueryModule.InttraShippingInstructionMessages;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, positionId: string, shippingInstructionsId: string, limit?: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto) => [...keys.all, "/offices/:officeId/positions/:positionId/bl-instructions/:shippingInstructionsId/messages", officeId, positionId, shippingInstructionsId, limit, page, cursor, filter] as const,
    listInfinite: (officeId: string, positionId: string, shippingInstructionsId: string, limit?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto) => [...keys.all, "/offices/:officeId/positions/:positionId/bl-instructions/:shippingInstructionsId/messages", "infinite", officeId, positionId, shippingInstructionsId, limit, cursor, filter] as const,
    getById: (officeId: string, positionId: string, shippingInstructionsId: string, messageId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/bl-instructions/:shippingInstructionsId/messages/:messageId", officeId, positionId, shippingInstructionsId, messageId] as const,
};

const listQueryOptions = ({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }) => ({
  queryKey: keys.list(officeId, positionId, shippingInstructionsId, limit, page, cursor, filter),
  queryFn: () => InttraShippingInstructionMessagesApi.list(officeId, positionId, shippingInstructionsId, limit, page, cursor, filter),
});

/** 
 * Query `useList`
 * @summary List Inttra shipping instruction messages for a position/BL instructions
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } shippingInstructionsId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto } filter Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: AppQueryOptions<typeof InttraShippingInstructionMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }),
    queryFn: async () => {
    checkAcl(InttraShippingInstructionMessagesAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }), ...options });
};

const listInfiniteQueryOptions = ({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }) => ({
  queryKey: keys.listInfinite(officeId, positionId, shippingInstructionsId, limit, cursor, filter),
  queryFn: ({ pageParam }: { pageParam: number }) => InttraShippingInstructionMessagesApi.list(officeId, positionId, shippingInstructionsId, limit, pageParam, cursor, filter),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List Inttra shipping instruction messages for a position/BL instructions
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } shippingInstructionsId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto } filter Query parameter
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: AppInfiniteQueryOptions<typeof InttraShippingInstructionMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }),
    queryFn: async ({ pageParam }) => {
      checkAcl(InttraShippingInstructionMessagesAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { officeId, positionId, shippingInstructionsId, limit, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create Inttra shipping instruction message
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } shippingInstructionsId Path parameter
 * @param { InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof InttraShippingInstructionMessagesApi.create, { officeId: string, positionId: string, shippingInstructionsId: string, data: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.InttraShippingInstructionMessages>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, shippingInstructionsId, data }) => { 
      checkAcl(InttraShippingInstructionMessagesAcl.canUseCreate({ officeId } ));
      return InttraShippingInstructionMessagesApi.create(officeId, positionId, shippingInstructionsId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getByIdQueryOptions = ({ officeId, positionId, shippingInstructionsId, messageId }: { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string }) => ({
  queryKey: keys.getById(officeId, positionId, shippingInstructionsId, messageId),
  queryFn: () => InttraShippingInstructionMessagesApi.getById(officeId, positionId, shippingInstructionsId, messageId),
});

/** 
 * Query `useGetById`
 * @summary Get Inttra shipping instruction message details
 * @permission Requires `canUseGetById` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } shippingInstructionsId Path parameter
 * @param { string } messageId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, positionId, shippingInstructionsId, messageId }: { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string }, options?: AppQueryOptions<typeof InttraShippingInstructionMessagesApi.getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getByIdQueryOptions({ officeId, positionId, shippingInstructionsId, messageId }),
    queryFn: async () => {
    checkAcl(InttraShippingInstructionMessagesAcl.canUseGetById({ officeId } ));
      return getByIdQueryOptions({ officeId, positionId, shippingInstructionsId, messageId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetById = (queryClient: QueryClient, { officeId, positionId, shippingInstructionsId, messageId }: { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getByIdQueryOptions({ officeId, positionId, shippingInstructionsId, messageId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Inttra shipping instruction message
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } shippingInstructionsId Path parameter
 * @param { string } messageId Path parameter
 * @param { InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof InttraShippingInstructionMessagesApi.update, { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, data: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.InttraShippingInstructionMessages>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, shippingInstructionsId, messageId, data }) => { 
      checkAcl(InttraShippingInstructionMessagesAcl.canUseUpdate({ officeId } ));
      return InttraShippingInstructionMessagesApi.update(officeId, positionId, shippingInstructionsId, messageId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, shippingInstructionsId, messageId } = variables;
      const updateKeys = [keys.getById(officeId, positionId, shippingInstructionsId, messageId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
