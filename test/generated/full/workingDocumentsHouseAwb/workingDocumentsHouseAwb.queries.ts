import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsHouseAwbAcl } from "./workingDocumentsHouseAwb.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsHouseAwbModels } from "./workingDocumentsHouseAwb.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsHouseAwbApi } from "./workingDocumentsHouseAwb.api";

export namespace WorkingDocumentsHouseAwbQueries {
export const moduleName = QueryModule.WorkingDocumentsHouseAwb;

export const keys = {
    all: [moduleName] as const,
    getHouseAwbData: (positionId: string, hawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/hawbs/:hawbId", positionId, hawbId, officeId] as const,
    previewHouseAwb: (positionId: string, hawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/hawbs/:hawbId/preview", positionId, hawbId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a House AWB document
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsHouseAwbApi.create(positionId, officeId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetHouseAwbData`
 * @summary Get House AWB document data
 * @permission Requires `canUseGetHouseAwbData` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.hawbId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetHouseAwbData = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsHouseAwbApi.getHouseAwbData, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getHouseAwbData(positionId, hawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseAwbAcl.canUseGetHouseAwbData({ officeId } ));
    return WorkingDocumentsHouseAwbApi.getHouseAwbData(positionId, hawbId, officeId, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateHouseAwbData`
 * @summary Update House AWB document data
 * @permission Requires `canUseUpdateHouseAwbData` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.hawbId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateHouseAwbData = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.updateHouseAwbData, { positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseUpdateHouseAwbData({ officeId } ));
      return WorkingDocumentsHouseAwbApi.updateHouseAwbData(positionId, hawbId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, hawbId, officeId } = variables;
      const updateKeys = [keys.getHouseAwbData(positionId, hawbId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteHouseAwb`
 * @summary Delete House AWB document
 * @permission Requires `canUseDeleteHouseAwb` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.hawbId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } House AWB document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteHouseAwb = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.deleteHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseDeleteHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.deleteHouseAwb(positionId, hawbId, officeId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePreviewHouseAwb` - recommended when file should be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.hawbId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwb = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsHouseAwbApi.previewHouseAwb, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewHouseAwb(positionId, hawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
    return WorkingDocumentsHouseAwbApi.previewHouseAwb(positionId, hawbId, officeId, config) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewHouseAwbMutation` - recommended when file should not be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.hawbId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwbMutation = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.previewHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.previewHouseAwb(positionId, hawbId, officeId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, hawbId, officeId } = variables;
      const updateKeys = [keys.previewHouseAwb(positionId, hawbId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateHouseAwb`
 * @summary Generate House AWB document
 * @permission Requires `canUseGenerateHouseAwb` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.hawbId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateHouseAwb = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.generateHouseAwb, { positionId: string, hawbId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseGenerateHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.generateHouseAwb(positionId, hawbId, officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
