import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsTemplatedDocumentAcl } from "./workingDocumentsTemplatedDocument.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsTemplatedDocumentModels } from "./workingDocumentsTemplatedDocument.models";

export namespace WorkingDocumentsTemplatedDocumentQueries {
const create = (positionId: string, officeId: string, data: WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/templated-documents`,
    ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDtoSchema, data),
    
  );
};

const getTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
    
  );
};

const updateTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
    ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDtoSchema, data),
    
  );
};

const deleteTemplatedDocument = (positionId: string, templatedDocumentId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
    
  );
};

const previewTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/preview`,
    ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const issueTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/issue`,
    ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};

const generateDocumentEml = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/eml`,
    ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.WorkingDocumentsTemplatedDocument;

export const keys = {
    all: [moduleName] as const,
    getTemplatedDocument: (officeId: string, positionId: string, templatedDocumentId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/templated-documents/:templatedDocumentId", officeId, positionId, templatedDocumentId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a templated document
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string, data: WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseCreate({ officeId } ));
      return create(positionId, officeId, data)
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
 * Query `useGetTemplatedDocument`
 * @summary Get templated document data
 * @permission Requires `canUseGetTemplatedDocument` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.templatedDocumentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetTemplatedDocument = <TData>({ officeId, positionId, templatedDocumentId }: { officeId: string, positionId: string, templatedDocumentId: string }, options?: AppQueryOptions<typeof getTemplatedDocument, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getTemplatedDocument(officeId, positionId, templatedDocumentId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseGetTemplatedDocument({ officeId } ));
    return getTemplatedDocument(officeId, positionId, templatedDocumentId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateTemplatedDocument`
 * @summary Update templated document data
 * @permission Requires `canUseUpdateTemplatedDocument` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateTemplatedDocument = (options?: AppMutationOptions<typeof updateTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseUpdateTemplatedDocument({ officeId } ));
      return updateTemplatedDocument(officeId, positionId, templatedDocumentId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, templatedDocumentId } = variables;
      const updateKeys = [keys.getTemplatedDocument(officeId, positionId, templatedDocumentId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteTemplatedDocument`
 * @summary Delete templated document
 * @permission Requires `canUseDeleteTemplatedDocument` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.templatedDocumentId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } Templated document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteTemplatedDocument = (options?: AppMutationOptions<typeof deleteTemplatedDocument, { positionId: string, templatedDocumentId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, templatedDocumentId, officeId }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseDeleteTemplatedDocument({ officeId } ));
      return deleteTemplatedDocument(positionId, templatedDocumentId, officeId)
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
 * Mutation `usePreviewTemplatedDocument` - recommended when file should not be cached
 * @summary Preview templated document
 * @permission Requires `canUsePreviewTemplatedDocument` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const usePreviewTemplatedDocument = (options?: AppMutationOptions<typeof previewTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUsePreviewTemplatedDocument({ officeId } ));
      return previewTemplatedDocument(officeId, positionId, templatedDocumentId, data)
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
 * Mutation `useIssueTemplatedDocument`
 * @summary Issue templated document (generate final PDF)
 * @permission Requires `canUseIssueTemplatedDocument` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.templatedDocumentId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useIssueTemplatedDocument = (options?: AppMutationOptions<typeof issueTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseIssueTemplatedDocument({ officeId } ));
      return issueTemplatedDocument(officeId, positionId, templatedDocumentId, data)
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
 * @summary Generate templated document and return EML file
 * @permission Requires `canUseGenerateDocumentEml` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.templatedDocumentId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateDocumentEml = (options?: AppMutationOptions<typeof generateDocumentEml, { officeId: string, positionId: string, templatedDocumentId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseGenerateDocumentEml({ officeId } ));
      return generateDocumentEml(officeId, positionId, templatedDocumentId, data)
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
