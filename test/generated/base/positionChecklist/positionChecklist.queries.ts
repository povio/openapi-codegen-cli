import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionChecklistAcl } from "./positionChecklist.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionChecklistModels } from "./positionChecklist.models";
import { PositionChecklistApi } from "./positionChecklist.api";

export namespace PositionChecklistQueries {
  export const moduleName = QueryModule.PositionChecklist;

  export const keys = {
    all: [moduleName] as const,
    list: (officeId: string, positionId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/checklist", officeId, positionId] as const,
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
  export const useList = <TData>(
    { officeId, positionId }: { officeId: string; positionId: string },
    options?: AppQueryOptions<typeof PositionChecklistApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.list(officeId, positionId),
      queryFn: () => {
        checkAcl(PositionChecklistAcl.canUseList({ officeId }));
        return PositionChecklistApi.list(officeId, positionId, config);
      },
      ...options,
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
  export const useApplyTemplates = (
    options?: AppMutationOptions<
      typeof PositionChecklistApi.applyTemplates,
      { officeId: string; positionId: string; data: PositionChecklistModels.ApplyTemplatesRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, data }) => {
        checkAcl(PositionChecklistAcl.canUseApplyTemplates({ officeId }));
        return PositionChecklistApi.applyTemplates(officeId, positionId, data, config);
      },
      ...options,
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
  export const useComplete = (
    options?: AppMutationOptions<
      typeof PositionChecklistApi.complete,
      { officeId: string; positionId: string; itemId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, itemId }) => {
        checkAcl(PositionChecklistAcl.canUseComplete({ officeId }));
        return PositionChecklistApi.complete(officeId, positionId, itemId, config);
      },
      ...options,
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
  export const useUncomplete = (
    options?: AppMutationOptions<
      typeof PositionChecklistApi.uncomplete,
      { officeId: string; positionId: string; itemId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, itemId }) => {
        checkAcl(PositionChecklistAcl.canUseUncomplete({ officeId }));
        return PositionChecklistApi.uncomplete(officeId, positionId, itemId, config);
      },
      ...options,
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
  export const useUpdateNotes = (
    options?: AppMutationOptions<
      typeof PositionChecklistApi.updateNotes,
      {
        officeId: string;
        positionId: string;
        itemId: string;
        data: PositionChecklistModels.UpdatePositionChecklistItemDto;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, itemId, data }) => {
        checkAcl(PositionChecklistAcl.canUseUpdateNotes({ officeId }));
        return PositionChecklistApi.updateNotes(officeId, positionId, itemId, data, config);
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
   * @summary Reorder checklist items
   * @permission Requires `canUseReorder` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { PositionChecklistModels.ReorderPositionChecklistDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<PositionChecklistModels.PositionChecklistReorderResponse> }
   * @statusCodes [200, 401]
   */
  export const useReorder = (
    options?: AppMutationOptions<
      typeof PositionChecklistApi.reorder,
      { officeId: string; positionId: string; data: PositionChecklistModels.ReorderPositionChecklistDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, data }) => {
        checkAcl(PositionChecklistAcl.canUseReorder({ officeId }));
        return PositionChecklistApi.reorder(officeId, positionId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
