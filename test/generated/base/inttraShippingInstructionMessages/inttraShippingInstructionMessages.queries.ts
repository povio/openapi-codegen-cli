import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InttraShippingInstructionMessagesAcl } from "./inttraShippingInstructionMessages.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
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

/** 
 * Query `useList`
 * @summary List Inttra shipping instruction messages for a position/BL instructions
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.shippingInstructionsId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto } object.filter Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, positionId, shippingInstructionsId, limit, page, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: AppQueryOptions<typeof InttraShippingInstructionMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, positionId, shippingInstructionsId, limit, page, cursor, filter),
    queryFn: () => { 
    checkAcl(InttraShippingInstructionMessagesAcl.canUseList({ officeId } ));
    return InttraShippingInstructionMessagesApi.list(officeId, positionId, shippingInstructionsId, limit, page, cursor, filter) },
    ...options,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List Inttra shipping instruction messages for a position/BL instructions
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.shippingInstructionsId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto } object.filter Query parameter
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, positionId, shippingInstructionsId, limit, cursor, filter }: { officeId: string, positionId: string, shippingInstructionsId: string, limit: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto }, options?: AppInfiniteQueryOptions<typeof InttraShippingInstructionMessagesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, positionId, shippingInstructionsId, limit, cursor, filter),
    queryFn: ({ pageParam }) => { 
    checkAcl(InttraShippingInstructionMessagesAcl.canUseList({ officeId } ));
    return InttraShippingInstructionMessagesApi.list(officeId, positionId, shippingInstructionsId, limit, pageParam, cursor, filter) },
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
 * @summary Create Inttra shipping instruction message
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.shippingInstructionsId Path parameter
 * @param { InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof InttraShippingInstructionMessagesApi.create, { officeId: string, positionId: string, shippingInstructionsId: string, data: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, shippingInstructionsId, data }) => { 
      checkAcl(InttraShippingInstructionMessagesAcl.canUseCreate({ officeId } ));
      return InttraShippingInstructionMessagesApi.create(officeId, positionId, shippingInstructionsId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetById`
 * @summary Get Inttra shipping instruction message details
 * @permission Requires `canUseGetById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.shippingInstructionsId Path parameter
 * @param { string } object.messageId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, positionId, shippingInstructionsId, messageId }: { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string }, options?: AppQueryOptions<typeof InttraShippingInstructionMessagesApi.getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getById(officeId, positionId, shippingInstructionsId, messageId),
    queryFn: () => { 
    checkAcl(InttraShippingInstructionMessagesAcl.canUseGetById({ officeId } ));
    return InttraShippingInstructionMessagesApi.getById(officeId, positionId, shippingInstructionsId, messageId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update Inttra shipping instruction message
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.shippingInstructionsId Path parameter
 * @param { string } mutation.messageId Path parameter
 * @param { InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof InttraShippingInstructionMessagesApi.update, { officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, data: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, shippingInstructionsId, messageId, data }) => { 
      checkAcl(InttraShippingInstructionMessagesAcl.canUseUpdate({ officeId } ));
      return InttraShippingInstructionMessagesApi.update(officeId, positionId, shippingInstructionsId, messageId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, shippingInstructionsId, messageId } = variables;
      const updateKeys = [keys.getById(officeId, positionId, shippingInstructionsId, messageId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
