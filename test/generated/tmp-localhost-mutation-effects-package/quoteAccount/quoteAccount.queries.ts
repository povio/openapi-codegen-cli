import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteAccountAcl } from "./quoteAccount.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteAccountModels } from "./quoteAccount.models";

export namespace QuoteAccountQueries {
const get = (quoteId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteAccountModels.QuoteAccountResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/account`,
    
  );
};

const createItem = (quoteId: string, officeId: string, data: QuoteAccountModels.CreateQuoteAccountItemRequestDto) => {
  return AppRestClient.post(
    { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/account/items`,
    ZodExtended.parse(QuoteAccountModels.CreateQuoteAccountItemRequestDtoSchema, data),
    
  );
};

const deleteItem = (quoteId: string, itemId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
    
  );
};

const updateItem = (quoteId: string, itemId: string, officeId: string, data: QuoteAccountModels.UpdateQuoteAccountItemRequestDto) => {
  return AppRestClient.patch(
    { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
    ZodExtended.parse(QuoteAccountModels.UpdateQuoteAccountItemRequestDtoSchema, data),
    
  );
};

const duplicateItem = (quoteId: string, itemId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}/duplicate`,
    
  );
};


export const moduleName = QueryModule.QuoteAccount;

export const keys = {
    all: [moduleName] as const,
    get: (quoteId: string, officeId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/account", quoteId, officeId] as const,
};

/** 
 * Query `useGet`
 * @summary Get quote account details
 * @permission Requires `canUseGet` ability 
 * @param { string } quoteId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteAccountModels.QuoteAccountResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ quoteId, officeId }: { quoteId: string, officeId: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(quoteId, officeId),
    queryFn: () => { 
    checkAcl(QuoteAccountAcl.canUseGet({ officeId } ));
    return get(quoteId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateItem`
 * @summary Create quote account item
 * @permission Requires `canUseCreateItem` ability 
 * @param { string } quoteId Path parameter
 * @param { string } officeId Path parameter
 * @param { QuoteAccountModels.CreateQuoteAccountItemRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateItem = (options?: AppMutationOptions<typeof createItem, { quoteId: string, officeId: string, data: QuoteAccountModels.CreateQuoteAccountItemRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteAccount>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ quoteId, officeId, data }) => { 
      checkAcl(QuoteAccountAcl.canUseCreateItem({ officeId } ));
      return createItem(quoteId, officeId, data)
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
 * Mutation `useDeleteItem`
 * @summary Delete quote account item
 * @permission Requires `canUseDeleteItem` ability 
 * @param { string } quoteId Path parameter
 * @param { string } itemId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteItem = (options?: AppMutationOptions<typeof deleteItem, { quoteId: string, itemId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteAccount>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ quoteId, itemId, officeId }) => { 
      checkAcl(QuoteAccountAcl.canUseDeleteItem({ officeId } ));
      return deleteItem(quoteId, itemId, officeId)
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
 * Mutation `useUpdateItem`
 * @summary Update quote account item
 * @permission Requires `canUseUpdateItem` ability 
 * @param { string } quoteId Path parameter
 * @param { string } itemId Path parameter
 * @param { string } officeId Path parameter
 * @param { QuoteAccountModels.UpdateQuoteAccountItemRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateItem = (options?: AppMutationOptions<typeof updateItem, { quoteId: string, itemId: string, officeId: string, data: QuoteAccountModels.UpdateQuoteAccountItemRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteAccount>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ quoteId, itemId, officeId, data }) => { 
      checkAcl(QuoteAccountAcl.canUseUpdateItem({ officeId } ));
      return updateItem(quoteId, itemId, officeId, data)
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
 * Mutation `useDuplicateItem`
 * @summary Duplicate quote account item
 * @permission Requires `canUseDuplicateItem` ability 
 * @param { string } quoteId Path parameter
 * @param { string } itemId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateItem = (options?: AppMutationOptions<typeof duplicateItem, { quoteId: string, itemId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteAccount>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ quoteId, itemId, officeId }) => { 
      checkAcl(QuoteAccountAcl.canUseDuplicateItem({ officeId } ));
      return duplicateItem(quoteId, itemId, officeId)
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
