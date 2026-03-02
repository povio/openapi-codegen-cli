import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsExportDeclarationAcl } from "./workingDocumentsExportDeclaration.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsExportDeclarationModels } from "./workingDocumentsExportDeclaration.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsExportDeclarationApi } from "./workingDocumentsExportDeclaration.api";

export namespace WorkingDocumentsExportDeclarationQueries {
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
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsExportDeclarationApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsExportDeclaration>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsExportDeclarationApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getExportDeclarationDataQueryOptions = ({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }) => ({
  queryKey: keys.getExportDeclarationData(officeId, positionId, exportDeclarationId),
  queryFn: () => WorkingDocumentsExportDeclarationApi.getExportDeclarationData(officeId, positionId, exportDeclarationId),
});

/** 
 * Query `useGetExportDeclarationData`
 * @summary Get export declaration document data
 * @permission Requires `canUseGetExportDeclarationData` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetExportDeclarationData = <TData>({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: AppQueryOptions<typeof WorkingDocumentsExportDeclarationApi.getExportDeclarationData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getExportDeclarationDataQueryOptions({ officeId, positionId, exportDeclarationId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsExportDeclarationAcl.canUseGetExportDeclarationData({ officeId } ));
      return getExportDeclarationDataQueryOptions({ officeId, positionId, exportDeclarationId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetExportDeclarationData = (queryClient: QueryClient, { officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getExportDeclarationDataQueryOptions({ officeId, positionId, exportDeclarationId }), ...options });
};

/** 
 * Mutation `useUpdateExportDeclarationData`
 * @summary Update export declaration document data
 * @permission Requires `canUseUpdateExportDeclarationData` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateExportDeclarationData = (options?: AppMutationOptions<typeof WorkingDocumentsExportDeclarationApi.updateExportDeclarationData, { officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsExportDeclaration>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId, data }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseUpdateExportDeclarationData({ officeId } ));
      return WorkingDocumentsExportDeclarationApi.updateExportDeclarationData(officeId, positionId, exportDeclarationId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } Export declaration document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteExportDeclaration = (options?: AppMutationOptions<typeof WorkingDocumentsExportDeclarationApi.deleteExportDeclaration, { positionId: string, exportDeclarationId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsExportDeclaration>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, exportDeclarationId, officeId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseDeleteExportDeclaration({ officeId } ));
      return WorkingDocumentsExportDeclarationApi.deleteExportDeclaration(positionId, exportDeclarationId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const previewExportDeclarationQueryOptions = ({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }) => ({
  queryKey: keys.previewExportDeclaration(officeId, positionId, exportDeclarationId),
  queryFn: () => WorkingDocumentsExportDeclarationApi.previewExportDeclaration(officeId, positionId, exportDeclarationId),
});

/** 
 * Query `usePreviewExportDeclaration` - recommended when file should be cached
 * @summary Preview export declaration document
 * @permission Requires `canUsePreviewExportDeclaration` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewExportDeclaration = <TData>({ officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: AppQueryOptions<typeof WorkingDocumentsExportDeclarationApi.previewExportDeclaration, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewExportDeclarationQueryOptions({ officeId, positionId, exportDeclarationId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsExportDeclarationAcl.canUsePreviewExportDeclaration({ officeId } ));
      return previewExportDeclarationQueryOptions({ officeId, positionId, exportDeclarationId }).queryFn();
    },
    ...options,
  });
};

export const prefetchPreviewExportDeclaration = (queryClient: QueryClient, { officeId, positionId, exportDeclarationId }: { officeId: string, positionId: string, exportDeclarationId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...previewExportDeclarationQueryOptions({ officeId, positionId, exportDeclarationId }), ...options });
};

/** 
 * Mutation `usePreviewExportDeclarationMutation` - recommended when file should not be cached
 * @summary Preview export declaration document
 * @permission Requires `canUsePreviewExportDeclaration` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewExportDeclarationMutation = (options?: AppMutationOptions<typeof WorkingDocumentsExportDeclarationApi.previewExportDeclaration, { officeId: string, positionId: string, exportDeclarationId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsExportDeclaration>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUsePreviewExportDeclaration({ officeId } ));
      return WorkingDocumentsExportDeclarationApi.previewExportDeclaration(officeId, positionId, exportDeclarationId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } exportDeclarationId Path parameter
 * @param { WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateExportDeclaration = (options?: AppMutationOptions<typeof WorkingDocumentsExportDeclarationApi.generateExportDeclaration, { officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsExportDeclaration>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, exportDeclarationId, data }) => { 
      checkAcl(WorkingDocumentsExportDeclarationAcl.canUseGenerateExportDeclaration({ officeId } ));
      return WorkingDocumentsExportDeclarationApi.generateExportDeclaration(officeId, positionId, exportDeclarationId, data)
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
