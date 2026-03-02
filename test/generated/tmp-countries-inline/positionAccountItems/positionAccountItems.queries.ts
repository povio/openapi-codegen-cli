import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionAccountItemsAcl } from "./positionAccountItems.acl";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionAccountItemsModels } from "./positionAccountItems.models";

export namespace PositionAccountItemsQueries {
const create = (positionId: string, officeId: string, data: PositionAccountItemsModels.CreatePositionAccountItemsRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionAccountItemsModels.PositionAccountItemsCreateResponseSchema },
    `/offices/${officeId}/positions/${positionId}/account/items`,
    ZodExtended.parse(PositionAccountItemsModels.CreatePositionAccountItemsRequestDtoSchema, data),
    
  );
};

const deletePositionAccountItems = (positionId: string, officeId: string, data: PositionAccountItemsModels.DeletePositionAccountItemsRequestDto) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/account/items`,
    ZodExtended.parse(PositionAccountItemsModels.DeletePositionAccountItemsRequestDtoSchema, data),
    
  );
};

const update = (positionId: string, officeId: string, data: PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto) => {
  return AppRestClient.patch(
    { resSchema: PositionAccountItemsModels.PositionAccountItemsUpdateResponseSchema },
    `/offices/${officeId}/positions/${positionId}/account/items`,
    ZodExtended.parse(PositionAccountItemsModels.UpdatePositionAccountItemsRequestDtoSchema, data),
    
  );
};

const duplicate = (positionId: string, officeId: string, data: PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionAccountItemsModels.PositionAccountItemsDuplicateResponseSchema },
    `/offices/${officeId}/positions/${positionId}/account/items/duplicate`,
    ZodExtended.parse(PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDtoSchema, data),
    
  );
};

const reassign = (positionId: string, officeId: string, data: PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto) => {
  return AppRestClient.patch(
    { resSchema: PositionAccountItemsModels.ReassignResponseSchema },
    `/offices/${officeId}/positions/${positionId}/account/items/reassign`,
    ZodExtended.parse(PositionAccountItemsModels.ReassignPositionAccountItemsRequestDtoSchema, data),
    
  );
};

const reorder = (positionId: string, itemId: string, officeId: string, data: PositionAccountItemsModels.ReorderPositionAccountItemRequestDto) => {
  return AppRestClient.patch(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/account/items/${itemId}/reorder`,
    ZodExtended.parse(PositionAccountItemsModels.ReorderPositionAccountItemRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.PositionAccountItems;



/** 
 * Mutation `useCreate`
 * @summary Create position account items (bulk)
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.CreatePositionAccountItemsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsCreateResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string, data: PositionAccountItemsModels.CreatePositionAccountItemsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseCreate({ officeId } ));
      return create(positionId, officeId, data)
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
 * Mutation `useDeletePositionAccountItems`
 * @summary Delete position account items (bulk)
 * @permission Requires `canUseDeletePositionAccountItems` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.DeletePositionAccountItemsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeletePositionAccountItems = (options?: AppMutationOptions<typeof deletePositionAccountItems, { positionId: string, officeId: string, data: PositionAccountItemsModels.DeletePositionAccountItemsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseDeletePositionAccountItems({ officeId } ));
      return deletePositionAccountItems(positionId, officeId, data)
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
 * Mutation `useUpdate`
 * @summary Update position account items (bulk)
 * @permission Requires `canUseUpdate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsUpdateResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { positionId: string, officeId: string, data: PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseUpdate({ officeId } ));
      return update(positionId, officeId, data)
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
 * Mutation `useDuplicate`
 * @summary Duplicate position account items (bulk)
 * @permission Requires `canUseDuplicate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.PositionAccountItemsDuplicateResponse> } 
 * @statusCodes [201, 401]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof duplicate, { positionId: string, officeId: string, data: PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseDuplicate({ officeId } ));
      return duplicate(positionId, officeId, data)
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
 * Mutation `useReassign`
 * @summary Reassign position account items to another position (bulk)
 * @permission Requires `canUseReassign` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionAccountItemsModels.ReassignResponse> } 
 * @statusCodes [200, 401]
 */
export const useReassign = (options?: AppMutationOptions<typeof reassign, { positionId: string, officeId: string, data: PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseReassign({ officeId } ));
      return reassign(positionId, officeId, data)
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
 * Mutation `useReorder`
 * @summary Reorder position account item
 * @permission Requires `canUseReorder` ability 
 * @param { string } positionId Path parameter
 * @param { string } itemId Path parameter
 * @param { string } officeId Path parameter
 * @param { PositionAccountItemsModels.ReorderPositionAccountItemRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useReorder = (options?: AppMutationOptions<typeof reorder, { positionId: string, itemId: string, officeId: string, data: PositionAccountItemsModels.ReorderPositionAccountItemRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionAccountItems>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, itemId, officeId, data }) => { 
      checkAcl(PositionAccountItemsAcl.canUseReorder({ officeId } ));
      return reorder(positionId, itemId, officeId, data)
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
