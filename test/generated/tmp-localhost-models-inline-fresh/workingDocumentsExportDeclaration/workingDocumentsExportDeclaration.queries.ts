import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsExportDeclarationAcl } from "./workingDocumentsExportDeclaration.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsExportDeclarationModels } from "./workingDocumentsExportDeclaration.models";

export namespace WorkingDocumentsExportDeclarationQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/export-declarations`,
    
  );
};

const getExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
    
  );
};

const updateExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
    ZodExtended.parse(WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTOSchema, data),
    
  );
};

const deleteExportDeclaration = (positionId: string, exportDeclarationId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
    
  );
};

const previewExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/generate`,
    ZodExtended.parse(WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.WorkingDocumentsExportDeclaration;

export const keys = {
    all: [moduleName] as const,
    getExportDeclarationData: (officeId: string, positionId: string, exportDeclarationId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/export-declarations/:exportDeclarationId", officeId, positionId, exportDeclarationId] as const,
    previewExportDeclaration: (officeId: string, positionId: string, exportDeclarationId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/export-declarations/:exportDeclarationId/preview", officeId, positionId, exportDeclarationId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create an export declaration document
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseCreate({ officeId } ));
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
 * Query `useGetExportDeclarationData`
 * @summary Get export declaration document data
 * @permission Requires `canUseGetExportDeclarationData` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.exportDeclarationId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetExportDeclarationData = <TData>({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: AppQueryOptions<typeof getExportDeclarationData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getExportDeclarationData(officeId, positionId, exportDeclarationId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsExportDeclarationAcl.canUseGetExportDeclarationData({ officeId } ));
    return getExportDeclarationData(officeId, positionId, exportDeclarationId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateExportDeclarationData`
 * @summary Update export declaration document data
 * @permission Requires `canUseUpdateExportDeclarationData` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.exportDeclarationId Path parameter
 * @param { WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateExportDeclarationData = (options?: AppMutationOptions<typeof updateExportDeclarationData, { officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId, data }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseUpdateExportDeclarationData({ officeId } ));
      return updateExportDeclarationData(officeId, positionId, exportDeclarationId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, exportDeclarationId } = variables;
      const updateKeys = [keys.getExportDeclarationData(officeId, positionId, exportDeclarationId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteExportDeclaration`
 * @summary Delete export declaration document
 * @permission Requires `canUseDeleteExportDeclaration` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.exportDeclarationId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } Export declaration document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteExportDeclaration = (options?: AppMutationOptions<typeof deleteExportDeclaration, { positionId: string, exportDeclarationId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, exportDeclarationId, officeId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseDeleteExportDeclaration({ officeId } ));
      return deleteExportDeclaration(positionId, exportDeclarationId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePreviewExportDeclaration` - recommended when file should be cached
 * @summary Preview export declaration document
 * @permission Requires `canUsePreviewExportDeclaration` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.exportDeclarationId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewExportDeclaration = <TData>({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: AppQueryOptions<typeof previewExportDeclaration, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewExportDeclaration(officeId, positionId, exportDeclarationId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsExportDeclarationAcl.canUsePreviewExportDeclaration({ officeId } ));
    return previewExportDeclaration(officeId, positionId, exportDeclarationId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewExportDeclarationMutation` - recommended when file should not be cached
 * @summary Preview export declaration document
 * @permission Requires `canUsePreviewExportDeclaration` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.exportDeclarationId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewExportDeclarationMutation = (options?: AppMutationOptions<typeof previewExportDeclaration, { officeId: string, positionId: string, exportDeclarationId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUsePreviewExportDeclaration({ officeId } ));
      return previewExportDeclaration(officeId, positionId, exportDeclarationId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, exportDeclarationId } = variables;
      const updateKeys = [keys.previewExportDeclaration(officeId, positionId, exportDeclarationId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateExportDeclaration`
 * @summary Generate export declaration document
 * @permission Requires `canUseGenerateExportDeclaration` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.exportDeclarationId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateExportDeclaration = (options?: AppMutationOptions<typeof generateExportDeclaration, { officeId: string, positionId: string, exportDeclarationId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId, data }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseGenerateExportDeclaration({ officeId } ));
      return generateExportDeclaration(officeId, positionId, exportDeclarationId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
