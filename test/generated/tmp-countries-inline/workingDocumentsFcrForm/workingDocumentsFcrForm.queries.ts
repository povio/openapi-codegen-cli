import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsFcrFormAcl } from "./workingDocumentsFcrForm.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsFcrFormModels } from "./workingDocumentsFcrForm.models";
import { CommonModels } from "@/data/common/common.models";

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

const generateFcr = (positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/generate`,
    ZodExtended.parse(WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
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
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsFcrFormModels.FcrDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

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

export const getFcrDataQueryOptions = ({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }) => ({
  queryKey: keys.getFcrData(positionId, fcrId, officeId),
  queryFn: () => getFcrData(positionId, fcrId, officeId),
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
export const useGetFcrData = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof getFcrData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getFcrDataQueryOptions({ positionId, fcrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsFcrFormAcl.canUseGetFcrData({ officeId } ));
      return getFcrDataQueryOptions({ positionId, fcrId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetFcrData = (queryClient: QueryClient, { positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getFcrDataQueryOptions({ positionId, fcrId, officeId }), ...options });
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
export const useUpdateFcrData = (options?: AppMutationOptions<typeof updateFcrData, { positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

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
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } FCR document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteFcr = (options?: AppMutationOptions<typeof deleteFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

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

export const previewFcrQueryOptions = ({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }) => ({
  queryKey: keys.previewFcr(positionId, fcrId, officeId),
  queryFn: () => previewFcr(positionId, fcrId, officeId),
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
export const usePreviewFcr = <TData>({ positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: AppQueryOptions<typeof previewFcr, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...previewFcrQueryOptions({ positionId, fcrId, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsFcrFormAcl.canUsePreviewFcr({ officeId } ));
      return previewFcrQueryOptions({ positionId, fcrId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPreviewFcr = (queryClient: QueryClient, { positionId, fcrId, officeId }: { positionId: string, fcrId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...previewFcrQueryOptions({ positionId, fcrId, officeId }), ...options });
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
export const usePreviewFcrMutation = (options?: AppMutationOptions<typeof previewFcr, { positionId: string, fcrId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

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
 * @param { string } positionId Path parameter
 * @param { string } fcrId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateFcr = (options?: AppMutationOptions<typeof generateFcr, { positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.WorkingDocumentsFcrForm>({ currentModule: moduleName });

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
