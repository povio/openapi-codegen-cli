import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsFcrFormAcl } from "./workingDocumentsFcrForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsFcrFormModels } from "./workingDocumentsFcrForm.models";

export namespace WorkingDocumentsFcrFormQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/fcrs`,
    
  );
};

const getFcrData = (positionId: string, fcrId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
    
  );
};

const updateFcrData = (positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
    ZodExtended.parse(WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTOSchema, data),
    
  );
};

const deleteFcr = (positionId: string, fcrId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
    
  );
};

const previewFcr = (positionId: string, fcrId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateFcr = (positionId: string, fcrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/generate`,
    ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseCreate({ officeId } ));
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
 * Query `useGetFcrData`
 * @summary Get FCR document data
 * @permission Requires `canUseGetFcrData` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.fcrId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetFcrData = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof getFcrData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getFcrData(positionId, fcrId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsFcrFormAcl.canUseGetFcrData({ officeId } ));
    return getFcrData(positionId, fcrId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateFcrData`
 * @summary Update FCR document data
 * @permission Requires `canUseUpdateFcrData` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.fcrId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateFcrData = (options?: AppMutationOptions<typeof updateFcrData, { positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseUpdateFcrData({ officeId } ));
      return updateFcrData(positionId, fcrId, officeId, data)
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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.fcrId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } FCR document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteFcr = (options?: AppMutationOptions<typeof deleteFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseDeleteFcr({ officeId } ));
      return deleteFcr(positionId, fcrId, officeId)
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
 * Query `usePreviewFcr` - recommended when file should be cached
 * @summary Preview FCR document
 * @permission Requires `canUsePreviewFcr` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.fcrId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewFcr = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof previewFcr, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewFcr(positionId, fcrId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsFcrFormAcl.canUsePreviewFcr({ officeId } ));
    return previewFcr(positionId, fcrId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `usePreviewFcrMutation` - recommended when file should not be cached
 * @summary Preview FCR document
 * @permission Requires `canUsePreviewFcr` ability 
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.fcrId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewFcrMutation = (options?: AppMutationOptions<typeof previewFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUsePreviewFcr({ officeId } ));
      return previewFcr(positionId, fcrId, officeId)
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
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.fcrId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateFcr = (options?: AppMutationOptions<typeof generateFcr, { positionId: string, fcrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, fcrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsFcrFormAcl.canUseGenerateFcr({ officeId } ));
      return generateFcr(positionId, fcrId, officeId, data)
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
