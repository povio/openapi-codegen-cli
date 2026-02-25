import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionInvolvedPartiesAcl } from "./positionInvolvedParties.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { PositionInvolvedPartiesApi } from "./positionInvolvedParties.api";

export namespace PositionInvolvedPartiesQueries {
  export const moduleName = QueryModule.PositionInvolvedParties;

  export const keys = {
    all: [moduleName] as const,
    findByPositionId: (officeId: string, positionId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/involved-parties", officeId, positionId] as const,
  };

  /**
   * Query `useFindByPositionId`
   * @summary List position involved parties
   * @permission Requires `canUseFindByPositionId` ability
   * @param { string } object.officeId Path parameter
   * @param { string } object.positionId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<PositionInvolvedPartiesModels.FindByPositionIdResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindByPositionId = <TData>(
    { officeId, positionId }: { officeId: string; positionId: string },
    options?: AppQueryOptions<typeof PositionInvolvedPartiesApi.findByPositionId, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findByPositionId(officeId, positionId),
      queryFn: () => {
        checkAcl(PositionInvolvedPartiesAcl.canUseFindByPositionId({ officeId }));
        return PositionInvolvedPartiesApi.findByPositionId(officeId, positionId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useCreate`
   * @summary Create position involved party
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { CommonModels.CreateInvolvedPartyRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.InvolvedPartyResponseDto> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof PositionInvolvedPartiesApi.create,
      { officeId: string; positionId: string; data: CommonModels.CreateInvolvedPartyRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, data }) => {
        checkAcl(PositionInvolvedPartiesAcl.canUseCreate({ officeId }));
        return PositionInvolvedPartiesApi.create(officeId, positionId, data, config);
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
   * @summary Update position involved party
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.partyId Path parameter
   * @param { CommonModels.UpdateInvolvedPartyDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.InvolvedPartyResponseDto> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof PositionInvolvedPartiesApi.update,
      { officeId: string; positionId: string; partyId: string; data: CommonModels.UpdateInvolvedPartyDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, partyId, data }) => {
        checkAcl(PositionInvolvedPartiesAcl.canUseUpdate({ officeId }));
        return PositionInvolvedPartiesApi.update(officeId, positionId, partyId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useDeleteOfficesPositionsInvolvedPartiesByPartyId`
   * @summary Delete position involved party
   * @permission Requires `canUseDeleteOfficesPositionsInvolvedPartiesByPartyId` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.partyId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [204, 401]
   */
  export const useDeleteOfficesPositionsInvolvedPartiesByPartyId = (
    options?: AppMutationOptions<
      typeof PositionInvolvedPartiesApi.deleteOfficesPositionsInvolvedPartiesByPartyId,
      { officeId: string; positionId: string; partyId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, partyId }) => {
        checkAcl(PositionInvolvedPartiesAcl.canUseDeleteOfficesPositionsInvolvedPartiesByPartyId({ officeId }));
        return PositionInvolvedPartiesApi.deleteOfficesPositionsInvolvedPartiesByPartyId(
          officeId,
          positionId,
          partyId,
          config,
        );
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
