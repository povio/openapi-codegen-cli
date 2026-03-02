import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsIsfFormAcl } from "./workingDocumentsIsfForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsIsfFormModels } from "./workingDocumentsIsfForm.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsIsfFormApi } from "./workingDocumentsIsfForm.api";

export namespace WorkingDocumentsIsfFormQueries {
export const moduleName = QueryModule.WorkingDocumentsIsfForm;

export const keys = {
    all: [moduleName] as const,
    getIsfData: (positionId: string, isfId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/isfs/:isfId", positionId, isfId, officeId] as const,
    previewIsf: (positionId: string, isfId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/isfs/:isfId/preview", positionId, isfId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create an ISF document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsIsfFormApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsIsfForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsIsfFormApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getIsfDataQueryOptions = ({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }) => ({
  queryKey: keys.getIsfData(positionId, isfId, officeId),
  queryFn: () => WorkingDocumentsIsfFormApi.getIsfData(positionId, isfId, officeId),
});

/** 
 * Query `useGetIsfData`
 * @summary Get ISF document data
 * @permission Requires `canUseGetIsfData` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetIsfData = <TData>({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsIsfFormApi.getIsfData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getIsfDataQueryOptions({ positionId, isfId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsIsfFormAcl.canUseGetIsfData({ officeId } ));
      return getIsfDataQueryOptions({ positionId, isfId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetIsfData = (queryClient: QueryClient, { positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getIsfDataQueryOptions({ positionId, isfId, officeId }), ...options });
};

/** 
 * Mutation `useUpdateIsfData`
 * @summary Update ISF document data
 * @permission Requires `canUseUpdateIsfData` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateIsfData = (options?: AppMutationOptions<typeof WorkingDocumentsIsfFormApi.updateIsfData, { positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsIsfForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId, data }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseUpdateIsfData({ officeId } ));
      return WorkingDocumentsIsfFormApi.updateIsfData(positionId, isfId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, isfId, officeId } = variables;
      const updateKeys = [keys.getIsfData(positionId, isfId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteIsf`
 * @summary Delete ISF document
 * @permission Requires `canUseDeleteIsf` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } ISF document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteIsf = (options?: AppMutationOptions<typeof WorkingDocumentsIsfFormApi.deleteIsf, { positionId: string, isfId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsIsfForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseDeleteIsf({ officeId } ));
      return WorkingDocumentsIsfFormApi.deleteIsf(positionId, isfId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const previewIsfQueryOptions = ({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }) => ({
  queryKey: keys.previewIsf(positionId, isfId, officeId),
  queryFn: () => WorkingDocumentsIsfFormApi.previewIsf(positionId, isfId, officeId),
});

/** 
 * Query `usePreviewIsf` - recommended when file should be cached
 * @summary Preview ISF document
 * @permission Requires `canUsePreviewIsf` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewIsf = <TData>({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsIsfFormApi.previewIsf, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewIsfQueryOptions({ positionId, isfId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsIsfFormAcl.canUsePreviewIsf({ officeId } ));
      return previewIsfQueryOptions({ positionId, isfId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPreviewIsf = (queryClient: QueryClient, { positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...previewIsfQueryOptions({ positionId, isfId, officeId }), ...options });
};

/** 
 * Mutation `usePreviewIsfMutation` - recommended when file should not be cached
 * @summary Preview ISF document
 * @permission Requires `canUsePreviewIsf` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewIsfMutation = (options?: AppMutationOptions<typeof WorkingDocumentsIsfFormApi.previewIsf, { positionId: string, isfId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsIsfForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUsePreviewIsf({ officeId } ));
      return WorkingDocumentsIsfFormApi.previewIsf(positionId, isfId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, isfId, officeId } = variables;
      const updateKeys = [keys.previewIsf(positionId, isfId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateIsf`
 * @summary Generate ISF document
 * @permission Requires `canUseGenerateIsf` ability 
 * @param { string } positionId Path parameter
 * @param { string } isfId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsIsfFormModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateIsf = (options?: AppMutationOptions<typeof WorkingDocumentsIsfFormApi.generateIsf, { positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsIsfForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId, data }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseGenerateIsf({ officeId } ));
      return WorkingDocumentsIsfFormApi.generateIsf(positionId, isfId, officeId, data)
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
