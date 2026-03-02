import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsHouseAwbAcl } from "./workingDocumentsHouseAwb.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
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
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsHouseAwb>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsHouseAwbApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getHouseAwbDataQueryOptions = ({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }) => ({
  queryKey: keys.getHouseAwbData(positionId, hawbId, officeId),
  queryFn: () => WorkingDocumentsHouseAwbApi.getHouseAwbData(positionId, hawbId, officeId),
});

/** 
 * Query `useGetHouseAwbData`
 * @summary Get House AWB document data
 * @permission Requires `canUseGetHouseAwbData` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetHouseAwbData = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsHouseAwbApi.getHouseAwbData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getHouseAwbDataQueryOptions({ positionId, hawbId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsHouseAwbAcl.canUseGetHouseAwbData({ officeId } ));
      return getHouseAwbDataQueryOptions({ positionId, hawbId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateHouseAwbData`
 * @summary Update House AWB document data
 * @permission Requires `canUseUpdateHouseAwbData` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateHouseAwbData = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.updateHouseAwbData, { positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsHouseAwb>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseUpdateHouseAwbData({ officeId } ));
      return WorkingDocumentsHouseAwbApi.updateHouseAwbData(positionId, hawbId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } House AWB document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteHouseAwb = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.deleteHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsHouseAwb>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseDeleteHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.deleteHouseAwb(positionId, hawbId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const previewHouseAwbQueryOptions = ({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }) => ({
  queryKey: keys.previewHouseAwb(positionId, hawbId, officeId),
  queryFn: () => WorkingDocumentsHouseAwbApi.previewHouseAwb(positionId, hawbId, officeId),
});

/** 
 * Query `usePreviewHouseAwb` - recommended when file should be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwb = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsHouseAwbApi.previewHouseAwb, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewHouseAwbQueryOptions({ positionId, hawbId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
      return previewHouseAwbQueryOptions({ positionId, hawbId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `usePreviewHouseAwbMutation` - recommended when file should not be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwbMutation = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.previewHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsHouseAwb>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.previewHouseAwb(positionId, hawbId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateHouseAwb = (options?: AppMutationOptions<typeof WorkingDocumentsHouseAwbApi.generateHouseAwb, { positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsHouseAwb>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseGenerateHouseAwb({ officeId } ));
      return WorkingDocumentsHouseAwbApi.generateHouseAwb(positionId, hawbId, officeId, data)
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
