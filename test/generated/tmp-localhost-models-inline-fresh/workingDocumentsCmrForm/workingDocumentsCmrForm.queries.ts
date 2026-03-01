import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsCmrFormAcl } from "./workingDocumentsCmrForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsCmrFormModels } from "./workingDocumentsCmrForm.models";

export namespace WorkingDocumentsCmrFormQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cmrs`,
    
  );
};

const getCmrData = (positionId: string, cmrId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
    
  );
};

const updateCmrData = (positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
    ZodExtended.parse(WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTOSchema, data),
    
  );
};

const deleteCmr = (positionId: string, cmrId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
    
  );
};

const previewCmr = (positionId: string, cmrId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateCmr = (positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/generate`,
    ZodExtended.parse(WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


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
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseCreate({ officeId } ));
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
export const useGetCmrData = <TData>({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: AppQueryOptions<typeof getCmrData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCmrData(positionId, cmrId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsCmrFormAcl.canUseGetCmrData({ officeId } ));
    return getCmrData(positionId, cmrId, officeId) },
    ...options,
  });
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
export const useUpdateCmrData = (options?: AppMutationOptions<typeof updateCmrData, { positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseUpdateCmrData({ officeId } ));
      return updateCmrData(positionId, cmrId, officeId, data)
    },
    ...options,
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
export const useDeleteCmr = (options?: AppMutationOptions<typeof deleteCmr, { positionId: string, cmrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseDeleteCmr({ officeId } ));
      return deleteCmr(positionId, cmrId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

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
export const usePreviewCmr = <TData>({ positionId, cmrId, officeId }: { positionId: string, cmrId: string, officeId: string }, options?: AppQueryOptions<typeof previewCmr, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewCmr(positionId, cmrId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId } ));
    return previewCmr(positionId, cmrId, officeId) },
    ...options,
  });
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
export const usePreviewCmrMutation = (options?: AppMutationOptions<typeof previewCmr, { positionId: string, cmrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUsePreviewCmr({ officeId } ));
      return previewCmr(positionId, cmrId, officeId)
    },
    ...options,
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
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateCmr = (options?: AppMutationOptions<typeof generateCmr, { positionId: string, cmrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, cmrId, officeId, data }) => { 
      checkAcl(WorkingDocumentsCmrFormAcl.canUseGenerateCmr({ officeId } ));
      return generateCmr(positionId, cmrId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
