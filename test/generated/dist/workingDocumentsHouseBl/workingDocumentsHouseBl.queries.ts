import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsHouseBlAcl } from "./workingDocumentsHouseBl.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsHouseBlModels } from "./workingDocumentsHouseBl.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsHouseBlApi } from "./workingDocumentsHouseBl.api";

export namespace WorkingDocumentsHouseBlQueries {
  export const moduleName = QueryModule.WorkingDocumentsHouseBl;

  export const keys = {
    all: [moduleName] as const,
    getHouseBlData: (positionId: string, houseBlId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/house-bls/:houseBlId",
        positionId,
        houseBlId,
        officeId,
      ] as const,
    previewHouseBl: (positionId: string, houseBlId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/house-bls/:houseBlId/preview",
        positionId,
        houseBlId,
        officeId,
      ] as const,
    previewHouseBlEml: (positionId: string, houseBlId: string, officeId: string) =>
      [
        ...keys.all,
        "/offices/:officeId/positions/:positionId/house-bls/:houseBlId/preview/eml",
        positionId,
        houseBlId,
        officeId,
      ] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a house BL document
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof WorkingDocumentsHouseBlApi.create, { positionId: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, officeId }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseCreate({ officeId }));
        return WorkingDocumentsHouseBlApi.create(positionId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useGetHouseBlData`
   * @summary Get house BL document data
   * @permission Requires `canUseGetHouseBlData` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.houseBlId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetHouseBlData = <TData>(
    { positionId, houseBlId, officeId }: { positionId: string; houseBlId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsHouseBlApi.getHouseBlData, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getHouseBlData(positionId, houseBlId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseGetHouseBlData({ officeId }));
        return WorkingDocumentsHouseBlApi.getHouseBlData(positionId, houseBlId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdateHouseBlData`
   * @summary Update house BL document data
   * @permission Requires `canUseUpdateHouseBlData` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdateHouseBlData = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.updateHouseBlData,
      {
        positionId: string;
        houseBlId: string;
        officeId: string;
        data: WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId, data }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseUpdateHouseBlData({ officeId }));
        return WorkingDocumentsHouseBlApi.updateHouseBlData(positionId, houseBlId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, houseBlId, officeId } = variables;
        const updateKeys = [keys.getHouseBlData(positionId, houseBlId, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useDeleteHouseBl`
   * @summary Delete house BL document
   * @permission Requires `canUseDeleteHouseBl` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> } House BL document deleted
   * @statusCodes [204, 401, 404]
   */
  export const useDeleteHouseBl = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.deleteHouseBl,
      { positionId: string; houseBlId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseDeleteHouseBl({ officeId }));
        return WorkingDocumentsHouseBlApi.deleteHouseBl(positionId, houseBlId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePreviewHouseBl` - recommended when file should be cached
   * @summary Preview house BL document
   * @permission Requires `canUsePreviewHouseBl` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.houseBlId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewHouseBl = <TData>(
    { positionId, houseBlId, officeId }: { positionId: string; houseBlId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsHouseBlApi.previewHouseBl, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.previewHouseBl(positionId, houseBlId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBl({ officeId }));
        return WorkingDocumentsHouseBlApi.previewHouseBl(positionId, houseBlId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `usePreviewHouseBlMutation` - recommended when file should not be cached
   * @summary Preview house BL document
   * @permission Requires `canUsePreviewHouseBl` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewHouseBlMutation = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.previewHouseBl,
      { positionId: string; houseBlId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBl({ officeId }));
        return WorkingDocumentsHouseBlApi.previewHouseBl(positionId, houseBlId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, houseBlId, officeId } = variables;
        const updateKeys = [
          keys.previewHouseBl(positionId, houseBlId, officeId),
          keys.previewHouseBlEml(positionId, houseBlId, officeId),
        ];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePreviewHouseBlEml` - recommended when file should be cached
   * @summary Preview house BL document and return EML file
   * @permission Requires `canUsePreviewHouseBlEml` ability
   * @param { string } object.positionId Path parameter
   * @param { string } object.houseBlId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewHouseBlEml = <TData>(
    { positionId, houseBlId, officeId }: { positionId: string; houseBlId: string; officeId: string },
    options?: AppQueryOptions<typeof WorkingDocumentsHouseBlApi.previewHouseBlEml, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.previewHouseBlEml(positionId, houseBlId, officeId),
      queryFn: () => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBlEml({ officeId }));
        return WorkingDocumentsHouseBlApi.previewHouseBlEml(positionId, houseBlId, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `usePreviewHouseBlEmlMutation` - recommended when file should not be cached
   * @summary Preview house BL document and return EML file
   * @permission Requires `canUsePreviewHouseBlEml` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const usePreviewHouseBlEmlMutation = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.previewHouseBlEml,
      { positionId: string; houseBlId: string; officeId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBlEml({ officeId }));
        return WorkingDocumentsHouseBlApi.previewHouseBlEml(positionId, houseBlId, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, houseBlId, officeId } = variables;
        const updateKeys = [
          keys.previewHouseBl(positionId, houseBlId, officeId),
          keys.previewHouseBlEml(positionId, houseBlId, officeId),
        ];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGenerateHouseBl`
   * @summary Generate house BL document
   * @permission Requires `canUseGenerateHouseBl` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [201, 401]
   */
  export const useGenerateHouseBl = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.generateHouseBl,
      { positionId: string; houseBlId: string; officeId: string; data: CommonModels.GenerateWorkingDocumentRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId, data }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseGenerateHouseBl({ officeId }));
        return WorkingDocumentsHouseBlApi.generateHouseBl(positionId, houseBlId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGenerateDocumentEml` - recommended when file should not be cached
   * @summary Generate house BL document and return EML file
   * @permission Requires `canUseGenerateDocumentEml` ability
   * @param { string } mutation.positionId Path parameter
   * @param { string } mutation.houseBlId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const useGenerateDocumentEml = (
    options?: AppMutationOptions<
      typeof WorkingDocumentsHouseBlApi.generateDocumentEml,
      { positionId: string; houseBlId: string; officeId: string; data: CommonModels.GenerateWorkingDocumentRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ positionId, houseBlId, officeId, data }) => {
        checkAcl(WorkingDocumentsHouseBlAcl.canUseGenerateDocumentEml({ officeId }));
        return WorkingDocumentsHouseBlApi.generateDocumentEml(positionId, houseBlId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { positionId, houseBlId, officeId } = variables;
        const updateKeys = [
          keys.previewHouseBl(positionId, houseBlId, officeId),
          keys.previewHouseBlEml(positionId, houseBlId, officeId),
        ];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
