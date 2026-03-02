import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionChecklistAcl } from "./positionChecklist.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionChecklistModels } from "./positionChecklist.models";
import { PositionChecklistApi } from "./positionChecklist.api";

export namespace PositionChecklistQueries {
export const moduleName = QueryModule.PositionChecklist;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/checklist", officeId, positionId] as const,
};

export const listQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.list(officeId, positionId),
  queryFn: () => PositionChecklistApi.list(officeId, positionId),
});

/** 
 * Query `useList`
 * @summary Get position checklist items
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionChecklistModels.PositionChecklistResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionChecklistApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionChecklistAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useApplyTemplates`
 * @summary Apply checklist templates to position
 * @permission Requires `canUseApplyTemplates` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionChecklistModels.ApplyTemplatesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.ApplyTemplatesResponse> } 
 * @statusCodes [201, 401]
 */
export const useApplyTemplates = (options?: AppMutationOptions<typeof PositionChecklistApi.applyTemplates, { officeId: string, positionId: string, data: PositionChecklistModels.ApplyTemplatesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionChecklist>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseApplyTemplates({ officeId } ));
      return PositionChecklistApi.applyTemplates(officeId, positionId, data)
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
 * Mutation `useComplete`
 * @summary Complete a checklist item
 * @permission Requires `canUseComplete` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } itemId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useComplete = (options?: AppMutationOptions<typeof PositionChecklistApi.complete, { officeId: string, positionId: string, itemId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionChecklist>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId }) => { 
      checkAcl(PositionChecklistAcl.canUseComplete({ officeId } ));
      return PositionChecklistApi.complete(officeId, positionId, itemId)
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
 * Mutation `useUncomplete`
 * @summary Mark checklist item as not completed
 * @permission Requires `canUseUncomplete` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } itemId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useUncomplete = (options?: AppMutationOptions<typeof PositionChecklistApi.uncomplete, { officeId: string, positionId: string, itemId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionChecklist>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId }) => { 
      checkAcl(PositionChecklistAcl.canUseUncomplete({ officeId } ));
      return PositionChecklistApi.uncomplete(officeId, positionId, itemId)
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
 * Mutation `useUpdateNotes`
 * @summary Update checklist item notes
 * @permission Requires `canUseUpdateNotes` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } itemId Path parameter
 * @param { PositionChecklistModels.UpdatePositionChecklistItemDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateNotes = (options?: AppMutationOptions<typeof PositionChecklistApi.updateNotes, { officeId: string, positionId: string, itemId: string, data: PositionChecklistModels.UpdatePositionChecklistItemDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionChecklist>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseUpdateNotes({ officeId } ));
      return PositionChecklistApi.updateNotes(officeId, positionId, itemId, data)
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
 * @summary Reorder checklist items
 * @permission Requires `canUseReorder` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionChecklistModels.ReorderPositionChecklistDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistReorderResponse> } 
 * @statusCodes [200, 401]
 */
export const useReorder = (options?: AppMutationOptions<typeof PositionChecklistApi.reorder, { officeId: string, positionId: string, data: PositionChecklistModels.ReorderPositionChecklistDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionChecklist>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseReorder({ officeId } ));
      return PositionChecklistApi.reorder(officeId, positionId, data)
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
