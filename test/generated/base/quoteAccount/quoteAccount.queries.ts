import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteAccountAcl } from "./quoteAccount.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteAccountModels } from "./quoteAccount.models";
import { QuoteAccountApi } from "./quoteAccount.api";

export namespace QuoteAccountQueries {
  export const moduleName = QueryModule.QuoteAccount;

  export const keys = {
    all: [moduleName] as const,
    get: (quoteId: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/quotes/:quoteId/account", quoteId, officeId] as const,
  };

  /**
   * Query `useGet`
   * @summary Get quote account details
   * @permission Requires `canUseGet` ability
   * @param { string } object.quoteId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<QuoteAccountModels.QuoteAccountResponseDto> }
   * @statusCodes [200, 401]
   */
  export const useGet = <TData>(
    { quoteId, officeId }: { quoteId: string; officeId: string },
    options?: AppQueryOptions<typeof QuoteAccountApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(quoteId, officeId),
      queryFn: () => {
        checkAcl(QuoteAccountAcl.canUseGet({ officeId }));
        return QuoteAccountApi.get(quoteId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useCreateItem`
   * @summary Create quote account item
   * @permission Requires `canUseCreateItem` ability
   * @param { string } mutation.quoteId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { QuoteAccountModels.CreateQuoteAccountItemRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> }
   * @statusCodes [201, 401]
   */
  export const useCreateItem = (
    options?: AppMutationOptions<
      typeof QuoteAccountApi.createItem,
      { quoteId: string; officeId: string; data: QuoteAccountModels.CreateQuoteAccountItemRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ quoteId, officeId, data }) => {
        checkAcl(QuoteAccountAcl.canUseCreateItem({ officeId }));
        return QuoteAccountApi.createItem(quoteId, officeId, data, config);
      },
      ...options,
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
   * @param { string } mutation.quoteId Path parameter
   * @param { string } mutation.itemId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [200, 401]
   */
  export const useDeleteItem = (
    options?: AppMutationOptions<
      typeof QuoteAccountApi.deleteItem,
      { quoteId: string; itemId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ quoteId, itemId, officeId }) => {
        checkAcl(QuoteAccountAcl.canUseDeleteItem({ officeId }));
        return QuoteAccountApi.deleteItem(quoteId, itemId, officeId, config);
      },
      ...options,
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
   * @param { string } mutation.quoteId Path parameter
   * @param { string } mutation.itemId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { QuoteAccountModels.UpdateQuoteAccountItemRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> }
   * @statusCodes [200, 401]
   */
  export const useUpdateItem = (
    options?: AppMutationOptions<
      typeof QuoteAccountApi.updateItem,
      { quoteId: string; itemId: string; officeId: string; data: QuoteAccountModels.UpdateQuoteAccountItemRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ quoteId, itemId, officeId, data }) => {
        checkAcl(QuoteAccountAcl.canUseUpdateItem({ officeId }));
        return QuoteAccountApi.updateItem(quoteId, itemId, officeId, data, config);
      },
      ...options,
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
   * @param { string } mutation.quoteId Path parameter
   * @param { string } mutation.itemId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<QuoteAccountModels.QuoteAccountItemDtoResponse> }
   * @statusCodes [201, 401]
   */
  export const useDuplicateItem = (
    options?: AppMutationOptions<
      typeof QuoteAccountApi.duplicateItem,
      { quoteId: string; itemId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ quoteId, itemId, officeId }) => {
        checkAcl(QuoteAccountAcl.canUseDuplicateItem({ officeId }));
        return QuoteAccountApi.duplicateItem(quoteId, itemId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
