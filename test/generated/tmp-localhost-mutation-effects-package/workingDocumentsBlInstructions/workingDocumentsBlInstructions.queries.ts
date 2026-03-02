import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsBlInstructionsAcl } from "./workingDocumentsBlInstructions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsBlInstructionsModels } from "./workingDocumentsBlInstructions.models";

export namespace WorkingDocumentsBlInstructionsQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/bl-instructions`,
    
  );
};

const getBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
    
  );
};

const updateBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
    ZodExtended.parse(WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTOSchema, data),
    
  );
};

const deleteBlInstructions = (positionId: string, blInstructionsId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
    
  );
};

const previewBlInstructions = (positionId: string, blInstructionsId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/generate`,
    ZodExtended.parse(WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};

const generateDocumentEml = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/eml`,
    ZodExtended.parse(WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.WorkingDocumentsBlInstructions;

export const keys = {
    all: [moduleName] as const,
    getBlInstructionsData: (positionId: string, blInstructionsId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/bl-instructions/:blInstructionsId", positionId, blInstructionsId, officeId] as const,
    previewBlInstructions: (positionId: string, blInstructionsId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/bl-instructions/:blInstructionsId/preview", positionId, blInstructionsId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a BL Instructions document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseCreate({ officeId } ));
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
 * Query `useGetBlInstructionsData`
 * @summary Get BL Instructions document data
 * @permission Requires `canUseGetBlInstructionsData` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetBlInstructionsData = <TData>({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof getBlInstructionsData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBlInstructionsData(positionId, blInstructionsId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGetBlInstructionsData({ officeId } ));
    return getBlInstructionsData(positionId, blInstructionsId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateBlInstructionsData`
 * @summary Update BL Instructions document data
 * @permission Requires `canUseUpdateBlInstructionsData` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBlInstructionsData = (options?: AppMutationOptions<typeof updateBlInstructionsData, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseUpdateBlInstructionsData({ officeId } ));
      return updateBlInstructionsData(positionId, blInstructionsId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, blInstructionsId, officeId } = variables;
      const updateKeys = [keys.getBlInstructionsData(positionId, blInstructionsId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteBlInstructions`
 * @summary Delete BL Instructions document
 * @permission Requires `canUseDeleteBlInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } BL Instructions document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteBlInstructions = (options?: AppMutationOptions<typeof deleteBlInstructions, { positionId: string, blInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseDeleteBlInstructions({ officeId } ));
      return deleteBlInstructions(positionId, blInstructionsId, officeId)
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
 * Query `usePreviewBlInstructions` - recommended when file should be cached
 * @summary Preview BL Instructions document
 * @permission Requires `canUsePreviewBlInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewBlInstructions = <TData>({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof previewBlInstructions, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewBlInstructions(positionId, blInstructionsId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsBlInstructionsAcl.canUsePreviewBlInstructions({ officeId } ));
    return previewBlInstructions(positionId, blInstructionsId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewBlInstructionsMutation` - recommended when file should not be cached
 * @summary Preview BL Instructions document
 * @permission Requires `canUsePreviewBlInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewBlInstructionsMutation = (options?: AppMutationOptions<typeof previewBlInstructions, { positionId: string, blInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUsePreviewBlInstructions({ officeId } ));
      return previewBlInstructions(positionId, blInstructionsId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, blInstructionsId, officeId } = variables;
      const updateKeys = [keys.previewBlInstructions(positionId, blInstructionsId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateBlInstructions`
 * @summary Generate BL Instructions document
 * @permission Requires `canUseGenerateBlInstructions` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateBlInstructions = (options?: AppMutationOptions<typeof generateBlInstructions, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGenerateBlInstructions({ officeId } ));
      return generateBlInstructions(positionId, blInstructionsId, officeId, data)
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
 * Mutation `useGenerateDocumentEml` - recommended when file should not be cached
 * @summary Generate BL Instructions document and return EML file
 * @permission Requires `canUseGenerateDocumentEml` ability 
 * @param { string } positionId Path parameter
 * @param { string } blInstructionsId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateDocumentEml = (options?: AppMutationOptions<typeof generateDocumentEml, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGenerateDocumentEml({ officeId } ));
      return generateDocumentEml(positionId, blInstructionsId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, blInstructionsId, officeId } = variables;
      const updateKeys = [keys.previewBlInstructions(positionId, blInstructionsId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
