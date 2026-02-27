import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsIsfFormAcl } from "./workingDocumentsIsfForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsIsfFormModels } from "./workingDocumentsIsfForm.models";

export namespace WorkingDocumentsIsfFormQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/isfs`,
    
  );
};

const getIsfData = (positionId: string, isfId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
    
  );
};

const updateIsfData = (positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
    ZodExtended.parse(WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTOSchema, data),
    
  );
};

const deleteIsf = (positionId: string, isfId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
    
  );
};

const previewIsf = (positionId: string, isfId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/isfs/${isfId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateIsf = (positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/isfs/${isfId}/generate`,
    ZodExtended.parse(WorkingDocumentsIsfFormModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseCreate({ officeId } ));
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
 * Query `useGetIsfData`
 * @summary Get ISF document data
 * @permission Requires `canUseGetIsfData` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.isfId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetIsfData = <TData>({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: AppQueryOptions<typeof getIsfData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getIsfData(positionId, isfId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsIsfFormAcl.canUseGetIsfData({ officeId } ));
    return getIsfData(positionId, isfId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateIsfData`
 * @summary Update ISF document data
 * @permission Requires `canUseUpdateIsfData` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.isfId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsIsfFormModels.IsfDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateIsfData = (options?: AppMutationOptions<typeof updateIsfData, { positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId, data }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseUpdateIsfData({ officeId } ));
      return updateIsfData(positionId, isfId, officeId, data)
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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.isfId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } ISF document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteIsf = (options?: AppMutationOptions<typeof deleteIsf, { positionId: string, isfId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseDeleteIsf({ officeId } ));
      return deleteIsf(positionId, isfId, officeId)
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
 * Query `usePreviewIsf` - recommended when file should be cached
 * @summary Preview ISF document
 * @permission Requires `canUsePreviewIsf` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.isfId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewIsf = <TData>({ positionId, isfId, officeId }: { positionId: string, isfId: string, officeId: string }, options?: AppQueryOptions<typeof previewIsf, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewIsf(positionId, isfId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsIsfFormAcl.canUsePreviewIsf({ officeId } ));
    return previewIsf(positionId, isfId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `usePreviewIsfMutation` - recommended when file should not be cached
 * @summary Preview ISF document
 * @permission Requires `canUsePreviewIsf` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.isfId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewIsfMutation = (options?: AppMutationOptions<typeof previewIsf, { positionId: string, isfId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUsePreviewIsf({ officeId } ));
      return previewIsf(positionId, isfId, officeId)
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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.isfId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateIsf = (options?: AppMutationOptions<typeof generateIsf, { positionId: string, isfId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, isfId, officeId, data }) => { 
      checkAcl(WorkingDocumentsIsfFormAcl.canUseGenerateIsf({ officeId } ));
      return generateIsf(positionId, isfId, officeId, data)
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
