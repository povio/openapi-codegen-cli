import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { BusinessPartnerBookkeepingMappingsAcl } from "./businessPartnerBookkeepingMappings.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnerBookkeepingMappingsModels } from "./businessPartnerBookkeepingMappings.models";
import { BusinessPartnerBookkeepingMappingsApi } from "./businessPartnerBookkeepingMappings.api";

export namespace BusinessPartnerBookkeepingMappingsQueries {
export const moduleName = QueryModule.BusinessPartnerBookkeepingMappings;

export const keys = {
    all: [moduleName] as const,
    getBookkeepingMappings: (officeId: string, businessPartnerId: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/bookkeeping-mappings", officeId, businessPartnerId] as const,
};

/** 
 * Query `useGetBookkeepingMappings`
 * @summary Fetch all bookkeeping mappings for a business partner
 * @permission Requires `canUseGetBookkeepingMappings` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.businessPartnerId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetBookkeepingMappings = <TData>({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: AppQueryOptions<typeof BusinessPartnerBookkeepingMappingsApi.getBookkeepingMappings, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBookkeepingMappings(officeId, businessPartnerId),
    queryFn: () => { 
    checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseGetBookkeepingMappings({ officeId } ));
    return BusinessPartnerBookkeepingMappingsApi.getBookkeepingMappings(officeId, businessPartnerId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateBookkeepingMapping`
 * @summary Create a bookkeeping mapping for a business partner
 * @permission Requires `canUseCreateBookkeepingMapping` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.businessPartnerId Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.createBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseCreateBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.createBookkeepingMapping(officeId, businessPartnerId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.businessPartnerId Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingResponse> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMapping(officeId, businessPartnerId, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.businessPartnerId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBookkeepingMappingById = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMappingById, { officeId: string, businessPartnerId: string, id: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMappingById({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMappingById(officeId, businessPartnerId, id, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.businessPartnerId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.deleteBookkeepingMapping, { officeId: string, businessPartnerId: string, id: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseDeleteBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.deleteBookkeepingMapping(officeId, businessPartnerId, id)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
