import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsCmrFormAcl } from "./workingDocumentsCmrForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsCmrFormModels } from "./workingDocumentsCmrForm.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsCmrFormApi } from "./workingDocumentsCmrForm.api";

export namespace WorkingDocumentsCmrFormQueries {
export const moduleName = QueryModule.WorkingDocumentsCmrForm;

export const keys = {
    all: [moduleName] as const,
    getCmrData: (positionId: string, cmrId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cmrs/:cmrId", positionId, cmrId, officeId] as const,
    previewCmr: (positionId: string, cmrId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cmrs/:cmrId/preview", positionId, cmrId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a CMR document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsCmrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsCmrFormApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getGetCmrDataQueryOptions = ({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }) => ({
  queryKey: keys.getCmrData(positionId, cmrId, officeId),
  queryFn: () => WorkingDocumentsCmrFormApi.getCmrData(positionId, cmrId, officeId),
});

/** 
 * Query `useGetCmrData`
 * @summary Get CMR document data
 * @permission Requires `canUseGetCmrData` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCmrData = <TData>({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsCmrFormApi.getCmrData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getGetCmrDataQueryOptions({ positionId, cmrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsCmrFormAcl.canUseGetCmrData({ officeId } ));
      return getGetCmrDataQueryOptions({ positionId, cmrId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCmrData = (queryClient: QueryClient, { positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetCmrDataQueryOptions({ positionId, cmrId, officeId }), ...options });
};

/** 
 * Mutation `useUpdateCmrData`
 * @summary Update CMR document data
 * @permission Requires `canUseUpdateCmrData` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsCmrFormModels.CmrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCmrData = (options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.updateCmrData, { positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsCmrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseUpdateCmrData({ officeId } ));
      return WorkingDocumentsCmrFormApi.updateCmrData(positionId, cmrId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, cmrId, officeId } = variables;
      const updateKeys = [keys.getCmrData(positionId, cmrId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteCmr`
 * @summary Delete CMR document
 * @permission Requires `canUseDeleteCmr` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } CMR document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteCmr = (options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.deleteCmr, { positionId: string, cmrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsCmrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseDeleteCmr({ officeId } ));
      return WorkingDocumentsCmrFormApi.deleteCmr(positionId, cmrId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getPreviewCmrQueryOptions = ({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }) => ({
  queryKey: keys.previewCmr(positionId, cmrId, officeId),
  queryFn: () => WorkingDocumentsCmrFormApi.previewCmr(positionId, cmrId, officeId),
});

/** 
 * Query `usePreviewCmr` - recommended when file should be cached
 * @summary Preview CMR document
 * @permission Requires `canUsePreviewCmr` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewCmr = <TData>({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsCmrFormApi.previewCmr, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getPreviewCmrQueryOptions({ positionId, cmrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId } ));
      return getPreviewCmrQueryOptions({ positionId, cmrId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchPreviewCmr = (queryClient: QueryClient, { positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getPreviewCmrQueryOptions({ positionId, cmrId, officeId }), ...options });
};

/** 
 * Mutation `usePreviewCmrMutation` - recommended when file should not be cached
 * @summary Preview CMR document
 * @permission Requires `canUsePreviewCmr` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewCmrMutation = (options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.previewCmr, { positionId: string, cmrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsCmrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId } ));
      return WorkingDocumentsCmrFormApi.previewCmr(positionId, cmrId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, cmrId, officeId } = variables;
      const updateKeys = [keys.previewCmr(positionId, cmrId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateCmr`
 * @summary Generate CMR document
 * @permission Requires `canUseGenerateCmr` ability 
 * @param { string } positionId Path parameter
 * @param { string } cmrId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateCmr = (options?: AppMutationOptions<typeof WorkingDocumentsCmrFormApi.generateCmr, { positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsCmrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseGenerateCmr({ officeId } ));
      return WorkingDocumentsCmrFormApi.generateCmr(positionId, cmrId, officeId, data)
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
