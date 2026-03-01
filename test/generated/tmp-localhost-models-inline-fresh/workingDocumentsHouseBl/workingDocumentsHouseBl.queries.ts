import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { WorkingDocumentsHouseBlAcl } from "./workingDocumentsHouseBl.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsHouseBlModels } from "./workingDocumentsHouseBl.models";

export namespace WorkingDocumentsHouseBlQueries {
const create = (positionId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/house-bls`,
    
  );
};

const getHouseBlData = (positionId: string, houseBlId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
    
  );
};

const updateHouseBlData = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
    ZodExtended.parse(WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTOSchema, data),
    
  );
};

const deleteHouseBl = (positionId: string, houseBlId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
    
  );
};

const previewHouseBl = (positionId: string, houseBlId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const previewHouseBlEml = (positionId: string, houseBlId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview/eml`,
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generateHouseBl = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/generate`,
    ZodExtended.parse(WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};

const generateDocumentEml = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/eml`,
    ZodExtended.parse(WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.WorkingDocumentsHouseBl;

export const keys = {
    all: [moduleName] as const,
    getHouseBlData: (positionId: string, houseBlId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/house-bls/:houseBlId", positionId, houseBlId, officeId] as const,
    previewHouseBl: (positionId: string, houseBlId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/house-bls/:houseBlId/preview", positionId, houseBlId, officeId] as const,
    previewHouseBlEml: (positionId: string, houseBlId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/house-bls/:houseBlId/preview/eml", positionId, houseBlId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create a house BL document
 * @permission Requires `canUseCreate` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { positionId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUseCreate({ officeId } ));
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
 * Query `useGetHouseBlData`
 * @summary Get house BL document data
 * @permission Requires `canUseGetHouseBlData` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetHouseBlData = <TData>({ positionId, houseBlId, officeId }: { positionId: string, houseBlId: string, officeId: string }, options?: AppQueryOptions<typeof getHouseBlData, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getHouseBlData(positionId, houseBlId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseBlAcl.canUseGetHouseBlData({ officeId } ));
    return getHouseBlData(positionId, houseBlId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateHouseBlData`
 * @summary Update house BL document data
 * @permission Requires `canUseUpdateHouseBlData` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateHouseBlData = (options?: AppMutationOptions<typeof updateHouseBlData, { positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUseUpdateHouseBlData({ officeId } ));
      return updateHouseBlData(positionId, houseBlId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, houseBlId, officeId } = variables;
      const updateKeys = [keys.getHouseBlData(positionId, houseBlId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteHouseBl`
 * @summary Delete house BL document
 * @permission Requires `canUseDeleteHouseBl` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } House BL document deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteHouseBl = (options?: AppMutationOptions<typeof deleteHouseBl, { positionId: string, houseBlId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUseDeleteHouseBl({ officeId } ));
      return deleteHouseBl(positionId, houseBlId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePreviewHouseBl` - recommended when file should be cached
 * @summary Preview house BL document
 * @permission Requires `canUsePreviewHouseBl` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseBl = <TData>({ positionId, houseBlId, officeId }: { positionId: string, houseBlId: string, officeId: string }, options?: AppQueryOptions<typeof previewHouseBl, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewHouseBl(positionId, houseBlId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBl({ officeId } ));
    return previewHouseBl(positionId, houseBlId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewHouseBlMutation` - recommended when file should not be cached
 * @summary Preview house BL document
 * @permission Requires `canUsePreviewHouseBl` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseBlMutation = (options?: AppMutationOptions<typeof previewHouseBl, { positionId: string, houseBlId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBl({ officeId } ));
      return previewHouseBl(positionId, houseBlId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, houseBlId, officeId } = variables;
      const updateKeys = [keys.previewHouseBl(positionId, houseBlId, officeId), keys.previewHouseBlEml(positionId, houseBlId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePreviewHouseBlEml` - recommended when file should be cached
 * @summary Preview house BL document and return EML file
 * @permission Requires `canUsePreviewHouseBlEml` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseBlEml = <TData>({ positionId, houseBlId, officeId }: { positionId: string, houseBlId: string, officeId: string }, options?: AppQueryOptions<typeof previewHouseBlEml, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.previewHouseBlEml(positionId, houseBlId, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBlEml({ officeId } ));
    return previewHouseBlEml(positionId, houseBlId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewHouseBlEmlMutation` - recommended when file should not be cached
 * @summary Preview house BL document and return EML file
 * @permission Requires `canUsePreviewHouseBlEml` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewHouseBlEmlMutation = (options?: AppMutationOptions<typeof previewHouseBlEml, { positionId: string, houseBlId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUsePreviewHouseBlEml({ officeId } ));
      return previewHouseBlEml(positionId, houseBlId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, houseBlId, officeId } = variables;
      const updateKeys = [keys.previewHouseBl(positionId, houseBlId, officeId), keys.previewHouseBlEml(positionId, houseBlId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateHouseBl`
 * @summary Generate house BL document
 * @permission Requires `canUseGenerateHouseBl` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerateHouseBl = (options?: AppMutationOptions<typeof generateHouseBl, { positionId: string, houseBlId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUseGenerateHouseBl({ officeId } ));
      return generateHouseBl(positionId, houseBlId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateDocumentEml` - recommended when file should not be cached
 * @summary Generate house BL document and return EML file
 * @permission Requires `canUseGenerateDocumentEml` ability 
 * @param { string } positionId Path parameter
 * @param { string } houseBlId Path parameter
 * @param { string } officeId Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateDocumentEml = (options?: AppMutationOptions<typeof generateDocumentEml, { positionId: string, houseBlId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ positionId, houseBlId, officeId, data }) => { 
      checkAcl(WorkingDocumentsHouseBlAcl.canUseGenerateDocumentEml({ officeId } ));
      return generateDocumentEml(positionId, houseBlId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { positionId, houseBlId, officeId } = variables;
      const updateKeys = [keys.previewHouseBl(positionId, houseBlId, officeId), keys.previewHouseBlEml(positionId, houseBlId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
