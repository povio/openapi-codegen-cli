import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsAmsInstructionsAcl } from "./workingDocumentsAmsInstructions.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsAmsInstructionsModels } from "./workingDocumentsAmsInstructions.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsAmsInstructionsApi } from "./workingDocumentsAmsInstructions.api";

export namespace WorkingDocumentsAmsInstructionsQueries {
  export const moduleName = QueryModule.WorkingDocumentsAmsInstructions;

  export const keys = {
    all: [moduleName] as const,
    getAMSInstructionsData: (positionId: string, amsInstructionsId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/ams-instructions/:amsInstructionsId",
        positionId,
        amsInstructionsId,
        officeId,
      ] as const,
    previewAMSInstructions: (positionId: string, amsInstructionsId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/ams-instructions/:amsInstructionsId/preview",
        positionId,
        amsInstructionsId,
        officeId,
      ] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create an AMS Instructions document
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsAmsInstructionsApi.create,
      { positionId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, officeId }) => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseCreate({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.create(positionId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useGetAMSInstructionsData`
   * @summary Get AMS Instructions document data
   * @permission Requires `canUseGetAMSInstructionsData` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.amsInstructionsId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetAMSInstructionsData = <TData>(
    { positionId, amsInstructionsId, officeId }: { positionId: string; amsInstructionsId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsAmsInstructionsApi.getAMSInstructionsData, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getAMSInstructionsData(positionId, amsInstructionsId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseGetAMSInstructionsData({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.getAMSInstructionsData(
          positionId,
          amsInstructionsId,
          officeId,
          config,
        );
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdateAMSInstructionsData`
   * @summary Update AMS Instructions document data
   * @permission Requires `canUseUpdateAMSInstructionsData` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.amsInstructionsId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdateAMSInstructionsData = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsAmsInstructionsApi.updateAMSInstructionsData,
      {
        positionId: string;
        amsInstructionsId: string;
        officeId: string;
        data: WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, amsInstructionsId, officeId, data }) => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseUpdateAMSInstructionsData({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.updateAMSInstructionsData(
          positionId,
          amsInstructionsId,
          officeId,
          data,
          config,
        );
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, amsInstructionsId, officeId } = variables;
        const updateKeys = [keys.getAMSInstructionsData(positionId, amsInstructionsId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useDeleteAMSInstructions`
   * @summary Delete AMS Instructions document
   * @permission Requires `canUseDeleteAMSInstructions` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.amsInstructionsId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> } AMS Instructions document deleted
   * @statusCodes [204, 401, 404]
   */
  export const useDeleteAMSInstructions = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsAmsInstructionsApi.deleteAMSInstructions,
      { positionId: string; amsInstructionsId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, amsInstructionsId, officeId }) => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseDeleteAMSInstructions({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.deleteAMSInstructions(
          positionId,
          amsInstructionsId,
          officeId,
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

  /**
   * Query `usePreviewAMSInstructions` - recommended when file should be cached
   * @summary Preview AMS Instructions document
   * @permission Requires `canUsePreviewAMSInstructions` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.amsInstructionsId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewAMSInstructions = <TData>(
    { positionId, amsInstructionsId, officeId }: { positionId: string; amsInstructionsId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsAmsInstructionsApi.previewAMSInstructions, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.previewAMSInstructions(positionId, amsInstructionsId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUsePreviewAMSInstructions({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.previewAMSInstructions(
          positionId,
          amsInstructionsId,
          officeId,
          config,
        );
      },
      ...options,
    });
  };

  /**
   * Mutation `usePreviewAMSInstructionsMutation` - recommended when file should not be cached
   * @summary Preview AMS Instructions document
   * @permission Requires `canUsePreviewAMSInstructions` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.amsInstructionsId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewAMSInstructionsMutation = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsAmsInstructionsApi.previewAMSInstructions,
      { positionId: string; amsInstructionsId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, amsInstructionsId, officeId }) => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUsePreviewAMSInstructions({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.previewAMSInstructions(
          positionId,
          amsInstructionsId,
          officeId,
          config,
        );
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, amsInstructionsId, officeId } = variables;
        const updateKeys = [keys.previewAMSInstructions(positionId, amsInstructionsId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGenerateAMSInstructions`
   * @summary Generate AMS Instructions document
   * @permission Requires `canUseGenerateAMSInstructions` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.amsInstructionsId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [201, 401]
   */
  export const useGenerateAMSInstructions = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsAmsInstructionsApi.generateAMSInstructions,
      {
        positionId: string;
        amsInstructionsId: string;
        officeId: string;
        data: CommonModels.GenerateWorkingDocumentRequestDto;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, amsInstructionsId, officeId, data }) => {
        checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseGenerateAMSInstructions({ officeId }));
        return WorkingDocumentsAmsInstructionsApi.generateAMSInstructions(
          positionId,
          amsInstructionsId,
          officeId,
          data,
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
