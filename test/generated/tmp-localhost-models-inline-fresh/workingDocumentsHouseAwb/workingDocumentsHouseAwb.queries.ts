import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsHouseAwbAcl } from "./workingDocumentsHouseAwb.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsHouseAwbModels } from "./workingDocumentsHouseAwb.models";

export namespace WorkingDocumentsHouseAwbQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/hawbs`,
    
  );
};

const getHouseAwbData = (positionId: string, hawbId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
    
  );
};

const updateHouseAwbData = (positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
    ZodExtended.parse(WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTOSchema, data),
    
  );
};

const deleteHouseAwb = (positionId: string, hawbId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
    
  );
};

const previewHouseAwb = (positionId: string, hawbId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateHouseAwb = (positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/generate`,
    ZodExtended.parse(WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.WorkingDocumentsHouseAwb;

export const keys = {
    all: [moduleName] as const,
    getHouseAwbData: (positionId: string, hawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/hawbs/:hawbId", positionId, hawbId, officeId] as const,
    previewHouseAwb: (positionId: string, hawbId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/hawbs/:hawbId/preview", positionId, hawbId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a House AWB document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseCreate({ officeId } ));
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
 * Query `useGetHouseAwbData`
 * @summary Get House AWB document data
 * @permission Requires `canUseGetHouseAwbData` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetHouseAwbData = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof getHouseAwbData, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getHouseAwbData(positionId, hawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseAwbAcl.canUseGetHouseAwbData({ officeId } ));
    return getHouseAwbData(positionId, hawbId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateHouseAwbData`
 * @summary Update House AWB document data
 * @permission Requires `canUseUpdateHouseAwbData` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateHouseAwbData = (options?: AppMutationOptions<typeof updateHouseAwbData, { positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseUpdateHouseAwbData({ officeId } ));
      return updateHouseAwbData(positionId, hawbId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, hawbId, officeId } = variables;
      const updateKeys = [keys.getHouseAwbData(positionId, hawbId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteHouseAwb`
 * @summary Delete House AWB document
 * @permission Requires `canUseDeleteHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } House AWB document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteHouseAwb = (options?: AppMutationOptions<typeof deleteHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseDeleteHouseAwb({ officeId } ));
      return deleteHouseAwb(positionId, hawbId, officeId)
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
 * Query `usePreviewHouseAwb` - recommended when file should be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwb = <TData>({ positionId, hawbId, officeId }: { positionId: string, hawbId: string, officeId: string }, options?: AppQueryOptions<typeof previewHouseAwb, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewHouseAwb(positionId, hawbId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
    return previewHouseAwb(positionId, hawbId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewHouseAwbMutation` - recommended when file should not be cached
 * @summary Preview House AWB document
 * @permission Requires `canUsePreviewHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseAwbMutation = (options?: AppMutationOptions<typeof previewHouseAwb, { positionId: string, hawbId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUsePreviewHouseAwb({ officeId } ));
      return previewHouseAwb(positionId, hawbId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, hawbId, officeId } = variables;
      const updateKeys = [keys.previewHouseAwb(positionId, hawbId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateHouseAwb`
 * @summary Generate House AWB document
 * @permission Requires `canUseGenerateHouseAwb` ability 
 * @param { string } positionId Path parameter
 * @param { string } hawbId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateHouseAwb = (options?: AppMutationOptions<typeof generateHouseAwb, { positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, hawbId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseAwbAcl.canUseGenerateHouseAwb({ officeId } ));
      return generateHouseAwb(positionId, hawbId, officeId, data)
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
