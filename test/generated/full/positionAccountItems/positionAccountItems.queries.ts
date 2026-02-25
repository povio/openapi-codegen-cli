import { AxiosRequestConfig } from "axios";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionAccountItemsAcl } from "./positionAccountItems.acl";
import { AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionAccountItemsModels } from "./positionAccountItems.models";
import { PositionAccountItemsApi } from "./positionAccountItems.api";

export namespace PositionAccountItemsQueries {
export const moduleName = QueryModule.PositionAccountItems;



/** 
 * Mutation `useCreate`
 * @summary Create position account items (bulk)
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.CreatePositionAccountItemsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsCreateResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof PositionAccountItemsApi.create, { positionId: string, officeId: string, data: PositionAccountItemsModels.CreatePositionAccountItemsRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseCreate({ officeId } ));
      return PositionAccountItemsApi.create(positionId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeletePositionAccountItems`
 * @summary Delete position account items (bulk)
 * @permission Requires `canUseDeletePositionAccountItems` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.DeletePositionAccountItemsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeletePositionAccountItems = (options?: AppMutationOptions<typeof PositionAccountItemsApi.deletePositionAccountItems, { positionId: string, officeId: string, data: PositionAccountItemsModels.DeletePositionAccountItemsRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseDeletePositionAccountItems({ officeId } ));
      return PositionAccountItemsApi.deletePositionAccountItems(positionId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update position account items (bulk)
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsUpdateResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof PositionAccountItemsApi.update, { positionId: string, officeId: string, data: PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseUpdate({ officeId } ));
      return PositionAccountItemsApi.update(positionId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDuplicate`
 * @summary Duplicate position account items (bulk)
 * @permission Requires `canUseDuplicate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsDuplicateResponse> } 
 * @statusCodes [201, 401]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof PositionAccountItemsApi.duplicate, { positionId: string, officeId: string, data: PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseDuplicate({ officeId } ));
      return PositionAccountItemsApi.duplicate(positionId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useReassign`
 * @summary Reassign position account items to another position (bulk)
 * @permission Requires `canUseReassign` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.ReassignResponse> } 
 * @statusCodes [200, 401]
 */
export const useReassign = (options?: AppMutationOptions<typeof PositionAccountItemsApi.reassign, { positionId: string, officeId: string, data: PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseReassign({ officeId } ));
      return PositionAccountItemsApi.reassign(positionId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useReorder`
 * @summary Reorder position account item
 * @permission Requires `canUseReorder` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.itemId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { PositionAccountItemsModels.ReorderPositionAccountItemRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useReorder = (options?: AppMutationOptions<typeof PositionAccountItemsApi.reorder, { positionId: string, itemId: string, officeId: string, data: PositionAccountItemsModels.ReorderPositionAccountItemRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, itemId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseReorder({ officeId } ));
      return PositionAccountItemsApi.reorder(positionId, itemId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
