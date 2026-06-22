import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsBlInstructionsAcl } from "./workingDocumentsBlInstructions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsBlInstructionsModels } from "./workingDocumentsBlInstructions.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsBlInstructionsApi } from "./workingDocumentsBlInstructions.api";

export namespace WorkingDocumentsBlInstructionsQueries {
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
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getBlInstructionsDataQueryOptions = ({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }) => ({
  queryKey: keys.getBlInstructionsData(positionId, blInstructionsId, officeId),
  queryFn: () => WorkingDocumentsBlInstructionsApi.getBlInstructionsData(positionId, blInstructionsId, officeId),
});

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
export const useGetBlInstructionsData = <TData>({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsBlInstructionsApi.getBlInstructionsData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getBlInstructionsDataQueryOptions({ positionId, blInstructionsId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGetBlInstructionsData({ officeId } ));
      return getBlInstructionsDataQueryOptions({ positionId, blInstructionsId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetBlInstructionsData = (queryClient: QueryClient, { positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getBlInstructionsDataQueryOptions({ positionId, blInstructionsId, officeId }), ...options });
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
export const useUpdateBlInstructionsData = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.updateBlInstructionsData, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseUpdateBlInstructionsData({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.updateBlInstructionsData(positionId, blInstructionsId, officeId, data)
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
export const useDeleteBlInstructions = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.deleteBlInstructions, { positionId: string, blInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseDeleteBlInstructions({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.deleteBlInstructions(positionId, blInstructionsId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const previewBlInstructionsQueryOptions = ({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }) => ({
  queryKey: keys.previewBlInstructions(positionId, blInstructionsId, officeId),
  queryFn: () => WorkingDocumentsBlInstructionsApi.previewBlInstructions(positionId, blInstructionsId, officeId),
});

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
export const usePreviewBlInstructions = <TData>({ positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsBlInstructionsApi.previewBlInstructions, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewBlInstructionsQueryOptions({ positionId, blInstructionsId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsBlInstructionsAcl.canUsePreviewBlInstructions({ officeId } ));
      return previewBlInstructionsQueryOptions({ positionId, blInstructionsId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchPreviewBlInstructions = (queryClient: QueryClient, { positionId, blInstructionsId, officeId }: { positionId: string, blInstructionsId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...previewBlInstructionsQueryOptions({ positionId, blInstructionsId, officeId }), ...options });
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
export const usePreviewBlInstructionsMutation = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.previewBlInstructions, { positionId: string, blInstructionsId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUsePreviewBlInstructions({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.previewBlInstructions(positionId, blInstructionsId, officeId)
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
export const useGenerateBlInstructions = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.generateBlInstructions, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGenerateBlInstructions({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.generateBlInstructions(positionId, blInstructionsId, officeId, data)
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
export const useGenerateDocumentEml = (options?: AppMutationOptions<typeof WorkingDocumentsBlInstructionsApi.generateDocumentEml, { positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsBlInstructions>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, blInstructionsId, officeId, data }) => { 
      checkAcl(WorkingDocumentsBlInstructionsAcl.canUseGenerateDocumentEml({ officeId } ));
      return WorkingDocumentsBlInstructionsApi.generateDocumentEml(positionId, blInstructionsId, officeId, data)
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
