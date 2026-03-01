import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsMasterAwbAcl } from "./workingDocumentsMasterAwb.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsMasterAwbModels } from "./workingDocumentsMasterAwb.models";

export namespace WorkingDocumentsMasterAwbQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/mawbs`,
    
  );
};

const getMasterAwbData = (positionId: string, mawbId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
    
  );
};

const updateMasterAwbData = (positionId: string, mawbId: string, officeId: string, data: WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
    ZodExtended.parse(WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTOSchema, data),
    
  );
};

const deleteMasterAwb = (positionId: string, mawbId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
    
  );
};

const previewMasterAwb = (positionId: string, mawbId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateMasterAwb = (positionId: string, mawbId: string, officeId: string, data: WorkingDocumentsMasterAwbModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/generate`,
    ZodExtended.parse(WorkingDocumentsMasterAwbModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.WorkingDocumentsMasterAwb;

export const keys = {
    all: [moduleName] as const,
    getMasterAwbData: (positionId: string, mawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/mawbs/:mawbId", positionId, mawbId, officeId] as const,
    previewMasterAwb: (positionId: string, mawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/mawbs/:mawbId/preview", positionId, mawbId, officeId] as const,
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
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsMasterAwbAcl.canUseCreate({ officeId } ));
      return create(positionId, officeId)
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
export const useGetMasterAwbData = <TData>({ positionId, mawbId, officeId }: { positionId: string, mawbId: string, officeId: string }, options?: AppQueryOptions<typeof getMasterAwbData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getMasterAwbData(positionId, mawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsMasterAwbAcl.canUseGetMasterAwbData({ officeId } ));
    return getMasterAwbData(positionId, mawbId, officeId) },
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
export const useUpdateMasterAwbData = (options?: AppMutationOptions<typeof updateMasterAwbData, { positionId: string, mawbId: string, officeId: string, data: WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, mawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsMasterAwbAcl.canUseUpdateMasterAwbData({ officeId } ));
      return updateMasterAwbData(positionId, mawbId, officeId, data)
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
export const useDeleteMasterAwb = (options?: AppMutationOptions<typeof deleteMasterAwb, { positionId: string, mawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, mawbId, officeId }) => { 
      checkAcl(WorkingDocumentsMasterAwbAcl.canUseDeleteMasterAwb({ officeId } ));
      return deleteMasterAwb(positionId, mawbId, officeId)
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
export const usePreviewMasterAwb = <TData>({ positionId, mawbId, officeId }: { positionId: string, mawbId: string, officeId: string }, options?: AppQueryOptions<typeof previewMasterAwb, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewMasterAwb(positionId, mawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsMasterAwbAcl.canUsePreviewMasterAwb({ officeId } ));
    return previewMasterAwb(positionId, mawbId, officeId) },
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
export const usePreviewMasterAwbMutation = (options?: AppMutationOptions<typeof previewMasterAwb, { positionId: string, mawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, mawbId, officeId }) => { 
      checkAcl(WorkingDocumentsMasterAwbAcl.canUsePreviewMasterAwb({ officeId } ));
      return previewMasterAwb(positionId, mawbId, officeId)
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
export const useGenerateMasterAwb = (options?: AppMutationOptions<typeof generateMasterAwb, { positionId: string, mawbId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, mawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsMasterAwbAcl.canUseGenerateMasterAwb({ officeId } ));
      return generateMasterAwb(positionId, mawbId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
