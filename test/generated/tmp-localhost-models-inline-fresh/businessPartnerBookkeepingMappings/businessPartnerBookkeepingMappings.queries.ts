import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { BusinessPartnerBookkeepingMappingsAcl } from "./businessPartnerBookkeepingMappings.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnerBookkeepingMappingsModels } from "./businessPartnerBookkeepingMappings.models";

export namespace BusinessPartnerBookkeepingMappingsQueries {
const getBookkeepingMappings = (officeId: string, businessPartnerId: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingsResponseDtoSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
    
  );
};

const createBookkeepingMapping = (officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto) => {
  return AppRestClient.post(
    { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
    ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDtoSchema, data),
    
  );
};

const updateBookkeepingMapping = (officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingResponseSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
    ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDtoSchema, data),
    
  );
};

const updateBookkeepingMappingById = (officeId: string, businessPartnerId: string, id: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
    ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDtoSchema, data),
    
  );
};

const deleteBookkeepingMapping = (officeId: string, businessPartnerId: string, id: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
    
  );
};


export const moduleName = QueryModule.BusinessPartnerBookkeepingMappings;

export const keys = {
    all: [moduleName] as const,
    getBookkeepingMappings: (officeId: string, businessPartnerId: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/bookkeeping-mappings", officeId, businessPartnerId] as const,
};

/** 
 * Query `useGetBookkeepingMappings`
 * @summary Fetch all bookkeeping mappings for a business partner
 * @permission Requires `canUseGetBookkeepingMappings` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetBookkeepingMappings = <TData>({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: AppQueryOptions<typeof getBookkeepingMappings, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBookkeepingMappings(officeId, businessPartnerId),
    queryFn: () => { 
    checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseGetBookkeepingMappings({ officeId } ));
    return getBookkeepingMappings(officeId, businessPartnerId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateBookkeepingMapping`
 * @summary Create a bookkeeping mapping for a business partner
 * @permission Requires `canUseCreateBookkeepingMapping` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateBookkeepingMapping = (options?: AppMutationOptions<typeof createBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseCreateBookkeepingMapping({ officeId } ));
      return createBookkeepingMapping(officeId, businessPartnerId, data)
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
 * Mutation `useUpdateBookkeepingMapping`
 * @summary Update an existing bookkeeping mapping for a business partner
 * @permission Requires `canUseUpdateBookkeepingMapping` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBookkeepingMapping = (options?: AppMutationOptions<typeof updateBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMapping({ officeId } ));
      return updateBookkeepingMapping(officeId, businessPartnerId, data)
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
 * Mutation `useUpdateBookkeepingMappingById`
 * @summary Update a specific bookkeeping mapping by ID for a business partner
 * @permission Requires `canUseUpdateBookkeepingMappingById` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBookkeepingMappingById = (options?: AppMutationOptions<typeof updateBookkeepingMappingById, { officeId: string, businessPartnerId: string, id: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMappingById({ officeId } ));
      return updateBookkeepingMappingById(officeId, businessPartnerId, id, data)
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
 * Mutation `useDeleteBookkeepingMapping`
 * @summary Delete an existing bookkeeping mapping for a business partner
 * @permission Requires `canUseDeleteBookkeepingMapping` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteBookkeepingMapping = (options?: AppMutationOptions<typeof deleteBookkeepingMapping, { officeId: string, businessPartnerId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseDeleteBookkeepingMapping({ officeId } ));
      return deleteBookkeepingMapping(officeId, businessPartnerId, id)
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
