import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsCmrFormAcl } from "./workingDocumentsCmrForm.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsCmrFormModels } from "./workingDocumentsCmrForm.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsCmrFormApi } from "./workingDocumentsCmrForm.api";

export namespace WorkingDocumentsCmrFormQueries {
  export const moduleName = QueryModule.WorkingDocumentsCmrForm;

  export const keys = {
    all: [moduleName] as const,
    getCmrData: (positionId: string, cmrId: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/cmrs/:cmrId", positionId, cmrId, officeId] as const,
    previewCmr: (positionId: string, cmrId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/cmrs/:cmrId/preview",
        positionId,
        cmrId,
        officeId,
      ] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a CMR document
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.create, { positionId: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, officeId }) => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUseCreate({ officeId }));
        return WorkingDocumentsCmrFormApi.create(positionId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useGetCmrData`
   * @summary Get CMR document data
   * @permission Requires `canUseGetCmrData` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.cmrId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetCmrData = <TData>(
    { positionId, cmrId, officeId }: { positionId: string; cmrId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsCmrFormApi.getCmrData, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getCmrData(positionId, cmrId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUseGetCmrData({ officeId }));
        return WorkingDocumentsCmrFormApi.getCmrData(positionId, cmrId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdateCmrData`
   * @summary Update CMR document data
   * @permission Requires `canUseUpdateCmrData` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.cmrId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdateCmrData = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsCmrFormApi.updateCmrData,
      {
        positionId: string;
        cmrId: string;
        officeId: string;
        data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, cmrId, officeId, data }) => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUseUpdateCmrData({ officeId }));
        return WorkingDocumentsCmrFormApi.updateCmrData(positionId, cmrId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, cmrId, officeId } = variables;
        const updateKeys = [keys.getCmrData(positionId, cmrId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useDeleteCmr`
   * @summary Delete CMR document
   * @permission Requires `canUseDeleteCmr` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.cmrId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> } CMR document deleted
   * @statusCodes [204, 401, 404]
   */
  export const useDeleteCmr = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsCmrFormApi.deleteCmr,
      { positionId: string; cmrId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, cmrId, officeId }) => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUseDeleteCmr({ officeId }));
        return WorkingDocumentsCmrFormApi.deleteCmr(positionId, cmrId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePreviewCmr` - recommended when file should be cached
   * @summary Preview CMR document
   * @permission Requires `canUsePreviewCmr` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.cmrId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewCmr = <TData>(
    { positionId, cmrId, officeId }: { positionId: string; cmrId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsCmrFormApi.previewCmr, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.previewCmr(positionId, cmrId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId }));
        return WorkingDocumentsCmrFormApi.previewCmr(positionId, cmrId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `usePreviewCmrMutation` - recommended when file should not be cached
   * @summary Preview CMR document
   * @permission Requires `canUsePreviewCmr` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.cmrId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewCmrMutation = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsCmrFormApi.previewCmr,
      { positionId: string; cmrId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, cmrId, officeId }) => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId }));
        return WorkingDocumentsCmrFormApi.previewCmr(positionId, cmrId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, cmrId, officeId } = variables;
        const updateKeys = [keys.previewCmr(positionId, cmrId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGenerateCmr`
   * @summary Generate CMR document
   * @permission Requires `canUseGenerateCmr` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.cmrId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [201, 401]
   */
  export const useGenerateCmr = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsCmrFormApi.generateCmr,
      { positionId: string; cmrId: string; officeId: string; data: CommonModels.GenerateWorkingDocumentRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, cmrId, officeId, data }) => {
        checkAcl(WorkingDocumentsCmrFormAcl.canUseGenerateCmr({ officeId }));
        return WorkingDocumentsCmrFormApi.generateCmr(positionId, cmrId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
