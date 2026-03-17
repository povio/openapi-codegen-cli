import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsTemplatedDocumentAcl } from "./workingDocumentsTemplatedDocument.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsTemplatedDocumentModels } from "./workingDocumentsTemplatedDocument.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsTemplatedDocumentApi } from "./workingDocumentsTemplatedDocument.api";

export namespace WorkingDocumentsTemplatedDocumentQueries {
export const moduleName = QueryModule.WorkingDocumentsTemplatedDocument;

export const keys = {
    all: [moduleName] as const,
    getTemplatedDocument: (officeId: string, positionId: string, templatedDocumentId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/templated-documents/:templatedDocumentId", officeId, positionId, templatedDocumentId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a templated document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.create, { positionId: string, officeId: string, data: WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.create(positionId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getTemplatedDocumentQueryOptions = ({ officeId, positionId, templatedDocumentId }: { officeId: string, positionId: string, templatedDocumentId: string }) => ({
  queryKey: keys.getTemplatedDocument(officeId, positionId, templatedDocumentId),
  queryFn: () => WorkingDocumentsTemplatedDocumentApi.getTemplatedDocument(officeId, positionId, templatedDocumentId),
});

/** 
 * Query `useGetTemplatedDocument`
 * @summary Get templated document data
 * @permission Requires `canUseGetTemplatedDocument` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetTemplatedDocument = <TData>({ officeId, positionId, templatedDocumentId }: { officeId: string, positionId: string, templatedDocumentId: string }, options?: AppQueryOptions<typeof WorkingDocumentsTemplatedDocumentApi.getTemplatedDocument, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getTemplatedDocumentQueryOptions({ officeId, positionId, templatedDocumentId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseGetTemplatedDocument({ officeId } ));
      return getTemplatedDocumentQueryOptions({ officeId, positionId, templatedDocumentId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetTemplatedDocument = (queryClient: QueryClient, { officeId, positionId, templatedDocumentId }: { officeId: string, positionId: string, templatedDocumentId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getTemplatedDocumentQueryOptions({ officeId, positionId, templatedDocumentId }), ...options });
};

/** 
 * Mutation `useUpdateTemplatedDocument`
 * @summary Update templated document data
 * @permission Requires `canUseUpdateTemplatedDocument` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateTemplatedDocument = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.updateTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseUpdateTemplatedDocument({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.updateTemplatedDocument(officeId, positionId, templatedDocumentId, data)
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
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } Templated document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteTemplatedDocument = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.deleteTemplatedDocument, { positionId: string, templatedDocumentId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, templatedDocumentId, officeId }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseDeleteTemplatedDocument({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.deleteTemplatedDocument(positionId, templatedDocumentId, officeId)
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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const usePreviewTemplatedDocument = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.previewTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUsePreviewTemplatedDocument({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.previewTemplatedDocument(officeId, positionId, templatedDocumentId, data)
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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useIssueTemplatedDocument = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.issueTemplatedDocument, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseIssueTemplatedDocument({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.issueTemplatedDocument(officeId, positionId, templatedDocumentId, data)
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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } templatedDocumentId Path parameter
 * @param { WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateDocumentEml = (options?: AppMutationOptions<typeof WorkingDocumentsTemplatedDocumentApi.generateDocumentEml, { officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsTemplatedDocument>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, templatedDocumentId, data }) => { 
      checkAcl(WorkingDocumentsTemplatedDocumentAcl.canUseGenerateDocumentEml({ officeId } ));
      return WorkingDocumentsTemplatedDocumentApi.generateDocumentEml(officeId, positionId, templatedDocumentId, data)
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
