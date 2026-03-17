import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsAmsInstructionsAcl } from "./workingDocumentsAmsInstructions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsAmsInstructionsModels } from "./workingDocumentsAmsInstructions.models";

export namespace WorkingDocumentsAmsInstructionsQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/ams-instructions`,
    
  );
};

const getAMSInstructionsData = (positionId: string, amsInstructionsId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
    
  );
};

const updateAMSInstructionsData = (positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
    ZodExtended.parse(WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTOSchema, data),
    
  );
};

const deleteAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
    
  );
};

const previewAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/generate`,
    ZodExtended.parse(WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.WorkingDocumentsAmsInstructions;

export const keys = {
    all: [moduleName] as const,
    getAMSInstructionsData: (positionId: string, amsInstructionsId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/ams-instructions/:amsInstructionsId", positionId, amsInstructionsId, officeId] as const,
    previewAMSInstructions: (positionId: string, amsInstructionsId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/ams-instructions/:amsInstructionsId/preview", positionId, amsInstructionsId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create an AMS Instructions document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsAmsInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseCreate({ officeId } ));
      return create(positionId, officeId)
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
 * Query `useGetAMSInstructionsData`
 * @summary Get AMS Instructions document data
 * @permission Requires `canUseGetAMSInstructionsData` ability 
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetAMSInstructionsData = <TData>({ positionId, amsInstructionsId, officeId }: { positionId: string, amsInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof getAMSInstructionsData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getAMSInstructionsData(positionId, amsInstructionsId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseGetAMSInstructionsData({ officeId } ));
    return getAMSInstructionsData(positionId, amsInstructionsId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateAMSInstructionsData`
 * @summary Update AMS Instructions document data
 * @permission Requires `canUseUpdateAMSInstructionsData` ability 
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateAMSInstructionsData = (options?: AppMutationOptions<typeof updateAMSInstructionsData, { positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsAmsInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, amsInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseUpdateAMSInstructionsData({ officeId } ));
      return updateAMSInstructionsData(positionId, amsInstructionsId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } AMS Instructions document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteAMSInstructions = (options?: AppMutationOptions<typeof deleteAMSInstructions, { positionId: string, amsInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsAmsInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, amsInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseDeleteAMSInstructions({ officeId } ));
      return deleteAMSInstructions(positionId, amsInstructionsId, officeId)
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
 * Query `usePreviewAMSInstructions` - recommended when file should be cached
 * @summary Preview AMS Instructions document
 * @permission Requires `canUsePreviewAMSInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewAMSInstructions = <TData>({ positionId, amsInstructionsId, officeId }: { positionId: string, amsInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof previewAMSInstructions, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewAMSInstructions(positionId, amsInstructionsId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsAmsInstructionsAcl.canUsePreviewAMSInstructions({ officeId } ));
    return previewAMSInstructions(positionId, amsInstructionsId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewAMSInstructionsMutation` - recommended when file should not be cached
 * @summary Preview AMS Instructions document
 * @permission Requires `canUsePreviewAMSInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewAMSInstructionsMutation = (options?: AppMutationOptions<typeof previewAMSInstructions, { positionId: string, amsInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsAmsInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, amsInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsAmsInstructionsAcl.canUsePreviewAMSInstructions({ officeId } ));
      return previewAMSInstructions(positionId, amsInstructionsId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } positionId Path parameter
 * @param { string } amsInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateAMSInstructions = (options?: AppMutationOptions<typeof generateAMSInstructions, { positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsAmsInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, amsInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsAmsInstructionsAcl.canUseGenerateAMSInstructions({ officeId } ));
      return generateAMSInstructions(positionId, amsInstructionsId, officeId, data)
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
