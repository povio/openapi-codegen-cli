import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { ShippingInstructionsAcl } from "./shippingInstructions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ShippingInstructionsModels } from "./shippingInstructions.models";

export namespace ShippingInstructionsQueries {
const create = (officeId: string, positionId: string) => {
  return AppRestClient.post(
    { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions`,
    
  );
};

const get = (officeId: string, positionId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
    
  );
};

const update = (officeId: string, positionId: string, id: string, data: ShippingInstructionsModels.UpdateShippingInstructionsRequestDto) => {
  return AppRestClient.patch(
    { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
    ZodExtended.parse(ShippingInstructionsModels.UpdateShippingInstructionsRequestDtoSchema, data),
    
  );
};

const deleteOfficesPositionsShippingInstructionsById = (officeId: string, positionId: string, id: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
    
  );
};

const preview = (officeId: string, positionId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/preview`,
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const generate = (officeId: string, positionId: string, id: string, data: ShippingInstructionsModels.GenerateWorkingDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/generate`,
    ZodExtended.parse(ShippingInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.ShippingInstructions;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, positionId: string, id: string) => [...keys.all, "/offices/:officeId/positions/:positionId/shipping-instructions/:id", officeId, positionId, id] as const,
    preview: (officeId: string, positionId: string, id: string) => [...keys.all, "/offices/:officeId/positions/:positionId/shipping-instructions/:id/preview", officeId, positionId, id] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create shipping instructions
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ShippingInstructionsModels.ShippingInstructionsResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(ShippingInstructionsAcl.canUseCreate({ officeId } ));
      return create(officeId, positionId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGet`
 * @summary Get shipping instructions data
 * @permission Requires `canUseGet` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ShippingInstructionsModels.ShippingInstructionsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, positionId, id }: { officeId: string, positionId: string, id: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, positionId, id),
    queryFn: () => { 
    checkAcl(ShippingInstructionsAcl.canUseGet({ officeId } ));
    return get(officeId, positionId, id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update shipping instructions
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { ShippingInstructionsModels.UpdateShippingInstructionsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ShippingInstructionsModels.ShippingInstructionsResponseDto> } Shipping instructions updated successfully
 * @statusCodes [200, 401, 404]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, positionId: string, id: string, data: ShippingInstructionsModels.UpdateShippingInstructionsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, id, data }) => { 
      checkAcl(ShippingInstructionsAcl.canUseUpdate({ officeId } ));
      return update(officeId, positionId, id, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, id } = variables;
      const updateKeys = [keys.get(officeId, positionId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteOfficesPositionsShippingInstructionsById`
 * @summary Delete shipping instructions
 * @permission Requires `canUseDeleteOfficesPositionsShippingInstructionsById` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } Shipping instructions deleted
 * @statusCodes [204, 401, 404]
 */
export const useDeleteOfficesPositionsShippingInstructionsById = (options?: AppMutationOptions<typeof deleteOfficesPositionsShippingInstructionsById, { officeId: string, positionId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, id }) => { 
      checkAcl(ShippingInstructionsAcl.canUseDeleteOfficesPositionsShippingInstructionsById({ officeId } ));
      return deleteOfficesPositionsShippingInstructionsById(officeId, positionId, id)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `usePreview` - recommended when file should be cached
 * @summary Preview shipping instructions document
 * @permission Requires `canUsePreview` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreview = <TData>({ officeId, positionId, id }: { officeId: string, positionId: string, id: string }, options?: AppQueryOptions<typeof preview, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.preview(officeId, positionId, id),
    queryFn: () => { 
    checkAcl(ShippingInstructionsAcl.canUsePreview({ officeId } ));
    return preview(officeId, positionId, id) },
    ...options,
  });
};

/** 
 * Mutation `usePreviewMutation` - recommended when file should not be cached
 * @summary Preview shipping instructions document
 * @permission Requires `canUsePreview` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const usePreviewMutation = (options?: AppMutationOptions<typeof preview, { officeId: string, positionId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, id }) => { 
      checkAcl(ShippingInstructionsAcl.canUsePreview({ officeId } ));
      return preview(officeId, positionId, id)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, id } = variables;
      const updateKeys = [keys.preview(officeId, positionId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerate`
 * @summary Generate shipping instructions document
 * @permission Requires `canUseGenerate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { CommonModels.GenerateWorkingDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof generate, { officeId: string, positionId: string, id: string, data: CommonModels.GenerateWorkingDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, id, data }) => { 
      checkAcl(ShippingInstructionsAcl.canUseGenerate({ officeId } ));
      return generate(officeId, positionId, id, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
