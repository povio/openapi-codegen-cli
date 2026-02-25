import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsMasterAwbAcl } from "./workingDocumentsMasterAwb.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsMasterAwbModels } from "./workingDocumentsMasterAwb.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsMasterAwbApi } from "./workingDocumentsMasterAwb.api";

export namespace WorkingDocumentsMasterAwbQueries {
  export const moduleName = QueryModule.WorkingDocumentsMasterAwb;

  export const keys = {
    all: [moduleName] as const,
    getMasterAwbData: (positionId: string, mawbId: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/mawbs/:mawbId", positionId, mawbId, officeId] as const,
    previewMasterAwb: (positionId: string, mawbId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/mawbs/:mawbId/preview",
        positionId,
        mawbId,
        officeId,
      ] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a Master AWB document
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof WorkingDocumentsMasterAwbApi.create, { positionId: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, officeId }) => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUseCreate({ officeId }));
        return WorkingDocumentsMasterAwbApi.create(positionId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useGetMasterAwbData`
   * @summary Get Master AWB document data
   * @permission Requires `canUseGetMasterAwbData` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.mawbId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetMasterAwbData = <TData>(
    { positionId, mawbId, officeId }: { positionId: string; mawbId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsMasterAwbApi.getMasterAwbData, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getMasterAwbData(positionId, mawbId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUseGetMasterAwbData({ officeId }));
        return WorkingDocumentsMasterAwbApi.getMasterAwbData(positionId, mawbId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdateMasterAwbData`
   * @summary Update Master AWB document data
   * @permission Requires `canUseUpdateMasterAwbData` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.mawbId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdateMasterAwbData = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsMasterAwbApi.updateMasterAwbData,
      {
        positionId: string;
        mawbId: string;
        officeId: string;
        data: WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, mawbId, officeId, data }) => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUseUpdateMasterAwbData({ officeId }));
        return WorkingDocumentsMasterAwbApi.updateMasterAwbData(positionId, mawbId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, mawbId, officeId } = variables;
        const updateKeys = [keys.getMasterAwbData(positionId, mawbId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useDeleteMasterAwb`
   * @summary Delete Master AWB document
   * @permission Requires `canUseDeleteMasterAwb` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.mawbId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> } Master AWB document deleted
   * @statusCodes [204, 401, 404]
   */
  export const useDeleteMasterAwb = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsMasterAwbApi.deleteMasterAwb,
      { positionId: string; mawbId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, mawbId, officeId }) => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUseDeleteMasterAwb({ officeId }));
        return WorkingDocumentsMasterAwbApi.deleteMasterAwb(positionId, mawbId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePreviewMasterAwb` - recommended when file should be cached
   * @summary Preview Master AWB document
   * @permission Requires `canUsePreviewMasterAwb` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.mawbId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewMasterAwb = <TData>(
    { positionId, mawbId, officeId }: { positionId: string; mawbId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsMasterAwbApi.previewMasterAwb, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.previewMasterAwb(positionId, mawbId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUsePreviewMasterAwb({ officeId }));
        return WorkingDocumentsMasterAwbApi.previewMasterAwb(positionId, mawbId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `usePreviewMasterAwbMutation` - recommended when file should not be cached
   * @summary Preview Master AWB document
   * @permission Requires `canUsePreviewMasterAwb` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.mawbId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewMasterAwbMutation = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsMasterAwbApi.previewMasterAwb,
      { positionId: string; mawbId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, mawbId, officeId }) => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUsePreviewMasterAwb({ officeId }));
        return WorkingDocumentsMasterAwbApi.previewMasterAwb(positionId, mawbId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, mawbId, officeId } = variables;
        const updateKeys = [keys.previewMasterAwb(positionId, mawbId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGenerateMasterAwb`
   * @summary Generate Master AWB document
   * @permission Requires `canUseGenerateMasterAwb` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.mawbId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [201, 401]
   */
  export const useGenerateMasterAwb = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsMasterAwbApi.generateMasterAwb,
      { positionId: string; mawbId: string; officeId: string; data: CommonModels.GenerateWorkingDocumentRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, mawbId, officeId, data }) => {
        checkAcl(WorkingDocumentsMasterAwbAcl.canUseGenerateMasterAwb({ officeId }));
        return WorkingDocumentsMasterAwbApi.generateMasterAwb(positionId, mawbId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
