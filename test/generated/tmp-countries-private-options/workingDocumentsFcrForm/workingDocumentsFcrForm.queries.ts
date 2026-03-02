import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsFcrFormAcl } from "./workingDocumentsFcrForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsFcrFormModels } from "./workingDocumentsFcrForm.models";
import { CommonModels } from "@/data/common/common.models";
import { WorkingDocumentsFcrFormApi } from "./workingDocumentsFcrForm.api";

export namespace WorkingDocumentsFcrFormQueries {
export const moduleName = QueryModule.WorkingDocumentsFcrForm;

export const keys = {
    all: [moduleName] as const,
    getFcrData: (positionId: string, fcrId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/fcrs/:fcrId", positionId, fcrId, officeId] as const,
    previewFcr: (positionId: string, fcrId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/fcrs/:fcrId/preview", positionId, fcrId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create an FCR document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof WorkingDocumentsFcrFormApi.create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseCreate({ officeId } ));
      return WorkingDocumentsFcrFormApi.create(positionId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getFcrDataQueryOptions = ({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }) => ({
  queryKey: keys.getFcrData(positionId, fcrId, officeId),
  queryFn: () => WorkingDocumentsFcrFormApi.getFcrData(positionId, fcrId, officeId),
});

/** 
 * Query `useGetFcrData`
 * @summary Get FCR document data
 * @permission Requires `canUseGetFcrData` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetFcrData = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsFcrFormApi.getFcrData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getFcrDataQueryOptions({ positionId, fcrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsFcrFormAcl.canUseGetFcrData({ officeId } ));
      return getFcrDataQueryOptions({ positionId, fcrId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetFcrData = (queryClient: QueryClient, { positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getFcrDataQueryOptions({ positionId, fcrId, officeId }), ...options });
};

/** 
 * Mutation `useUpdateFcrData`
 * @summary Update FCR document data
 * @permission Requires `canUseUpdateFcrData` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateFcrData = (options?: AppMutationOptions<typeof WorkingDocumentsFcrFormApi.updateFcrData, { positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseUpdateFcrData({ officeId } ));
      return WorkingDocumentsFcrFormApi.updateFcrData(positionId, fcrId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, fcrId, officeId } = variables;
      const updateKeys = [keys.getFcrData(positionId, fcrId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteFcr`
 * @summary Delete FCR document
 * @permission Requires `canUseDeleteFcr` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } FCR document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteFcr = (options?: AppMutationOptions<typeof WorkingDocumentsFcrFormApi.deleteFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseDeleteFcr({ officeId } ));
      return WorkingDocumentsFcrFormApi.deleteFcr(positionId, fcrId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const previewFcrQueryOptions = ({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }) => ({
  queryKey: keys.previewFcr(positionId, fcrId, officeId),
  queryFn: () => WorkingDocumentsFcrFormApi.previewFcr(positionId, fcrId, officeId),
});

/** 
 * Query `usePreviewFcr` - recommended when file should be cached
 * @summary Preview FCR document
 * @permission Requires `canUsePreviewFcr` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewFcr = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsFcrFormApi.previewFcr, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewFcrQueryOptions({ positionId, fcrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsFcrFormAcl.canUsePreviewFcr({ officeId } ));
      return previewFcrQueryOptions({ positionId, fcrId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchPreviewFcr = (queryClient: QueryClient, { positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...previewFcrQueryOptions({ positionId, fcrId, officeId }), ...options });
};

/** 
 * Mutation `usePreviewFcrMutation` - recommended when file should not be cached
 * @summary Preview FCR document
 * @permission Requires `canUsePreviewFcr` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewFcrMutation = (options?: AppMutationOptions<typeof WorkingDocumentsFcrFormApi.previewFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUsePreviewFcr({ officeId } ));
      return WorkingDocumentsFcrFormApi.previewFcr(positionId, fcrId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, fcrId, officeId } = variables;
      const updateKeys = [keys.previewFcr(positionId, fcrId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateFcr`
 * @summary Generate FCR document
 * @permission Requires `canUseGenerateFcr` ability 
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateFcr = (options?: AppMutationOptions<typeof WorkingDocumentsFcrFormApi.generateFcr, { positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseGenerateFcr({ officeId } ));
      return WorkingDocumentsFcrFormApi.generateFcr(positionId, fcrId, officeId, data)
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
