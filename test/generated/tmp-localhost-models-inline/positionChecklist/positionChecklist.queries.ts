import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionChecklistAcl } from "./positionChecklist.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionChecklistModels } from "./positionChecklist.models";

export namespace PositionChecklistQueries {
const list = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionChecklistModels.PositionChecklistResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/checklist`,
    
  );
};

const applyTemplates = (officeId: string, positionId: string, data: PositionChecklistModels.ApplyTemplatesRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionChecklistModels.ApplyTemplatesResponseSchema },
    `/offices/${officeId}/positions/${positionId}/checklist/apply-templates`,
    ZodExtended.parse(PositionChecklistModels.ApplyTemplatesRequestDtoSchema, data),
    
  );
};

const complete = (officeId: string, positionId: string, itemId: string) => {
  return AppRestClient.post(
    { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/complete`,
    
  );
};

const uncomplete = (officeId: string, positionId: string, itemId: string) => {
  return AppRestClient.post(
    { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/uncomplete`,
    
  );
};

const updateNotes = (officeId: string, positionId: string, itemId: string, data: PositionChecklistModels.UpdatePositionChecklistItemDto) => {
  return AppRestClient.patch(
    { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/checklist/${itemId}`,
    ZodExtended.parse(PositionChecklistModels.UpdatePositionChecklistItemDtoSchema, data),
    
  );
};

const reorder = (officeId: string, positionId: string, data: PositionChecklistModels.ReorderPositionChecklistDto) => {
  return AppRestClient.put(
    { resSchema: PositionChecklistModels.PositionChecklistReorderResponseSchema },
    `/offices/${officeId}/positions/${positionId}/checklist/reorder`,
    ZodExtended.parse(PositionChecklistModels.ReorderPositionChecklistDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.PositionChecklist;

export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/checklist", officeId, positionId] as const,
};

/** 
 * Query `useList`
 * @summary Get position checklist items
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionChecklistModels.PositionChecklistResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionChecklistAcl.canUseList({ officeId } ));
    return list(officeId, positionId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useApplyTemplates`
 * @summary Apply checklist templates to position
 * @permission Requires `canUseApplyTemplates` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { PositionChecklistModels.ApplyTemplatesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.ApplyTemplatesResponse> } 
 * @statusCodes [201, 401]
 */
export const useApplyTemplates = (options?: AppMutationOptions<typeof applyTemplates, { officeId: string, positionId: string, data: PositionChecklistModels.ApplyTemplatesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseApplyTemplates({ officeId } ));
      return applyTemplates(officeId, positionId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.itemId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useComplete = (options?: AppMutationOptions<typeof complete, { officeId: string, positionId: string, itemId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId }) => { 
      checkAcl(PositionChecklistAcl.canUseComplete({ officeId } ));
      return complete(officeId, positionId, itemId)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.itemId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useUncomplete = (options?: AppMutationOptions<typeof uncomplete, { officeId: string, positionId: string, itemId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId }) => { 
      checkAcl(PositionChecklistAcl.canUseUncomplete({ officeId } ));
      return uncomplete(officeId, positionId, itemId)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.itemId Path parameter
 * @param { PositionChecklistModels.UpdatePositionChecklistItemDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistItemResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateNotes = (options?: AppMutationOptions<typeof updateNotes, { officeId: string, positionId: string, itemId: string, data: PositionChecklistModels.UpdatePositionChecklistItemDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, itemId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseUpdateNotes({ officeId } ));
      return updateNotes(officeId, positionId, itemId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { PositionChecklistModels.ReorderPositionChecklistDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistReorderResponse> } 
 * @statusCodes [200, 401]
 */
export const useReorder = (options?: AppMutationOptions<typeof reorder, { officeId: string, positionId: string, data: PositionChecklistModels.ReorderPositionChecklistDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionChecklistAcl.canUseReorder({ officeId } ));
      return reorder(officeId, positionId, data)
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
