import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BusinessPartnerBookkeepingMappingsAcl } from "./businessPartnerBookkeepingMappings.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnerBookkeepingMappingsModels } from "./businessPartnerBookkeepingMappings.models";
import { BusinessPartnerBookkeepingMappingsApi } from "./businessPartnerBookkeepingMappings.api";

export namespace BusinessPartnerBookkeepingMappingsQueries {
export const moduleName = QueryModule.BusinessPartnerBookkeepingMappings;

export const keys = {
    all: [moduleName] as const,
    getBookkeepingMappings: (officeId: string, businessPartnerId: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/bookkeeping-mappings", officeId, businessPartnerId] as const,
};

const getBookkeepingMappingsQueryOptions = ({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }) => ({
  queryKey: keys.getBookkeepingMappings(officeId, businessPartnerId),
  queryFn: () => BusinessPartnerBookkeepingMappingsApi.getBookkeepingMappings(officeId, businessPartnerId),
});

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
export const useGetBookkeepingMappings = <TData>({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: AppQueryOptions<typeof BusinessPartnerBookkeepingMappingsApi.getBookkeepingMappings, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getBookkeepingMappingsQueryOptions({ officeId, businessPartnerId }),
    queryFn: async () => {
    checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseGetBookkeepingMappings({ officeId } ));
      return getBookkeepingMappingsQueryOptions({ officeId, businessPartnerId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetBookkeepingMappings = (queryClient: QueryClient, { officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getBookkeepingMappingsQueryOptions({ officeId, businessPartnerId }), ...options });
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
export const useCreateBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.createBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerBookkeepingMappings>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseCreateBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.createBookkeepingMapping(officeId, businessPartnerId, data)
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
export const useUpdateBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMapping, { officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerBookkeepingMappings>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMapping(officeId, businessPartnerId, data)
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
export const useUpdateBookkeepingMappingById = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMappingById, { officeId: string, businessPartnerId: string, id: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerBookkeepingMappings>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id, data }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseUpdateBookkeepingMappingById({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.updateBookkeepingMappingById(officeId, businessPartnerId, id, data)
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
export const useDeleteBookkeepingMapping = (options?: AppMutationOptions<typeof BusinessPartnerBookkeepingMappingsApi.deleteBookkeepingMapping, { officeId: string, businessPartnerId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerBookkeepingMappings>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, id }) => { 
      checkAcl(BusinessPartnerBookkeepingMappingsAcl.canUseDeleteBookkeepingMapping({ officeId } ));
      return BusinessPartnerBookkeepingMappingsApi.deleteBookkeepingMapping(officeId, businessPartnerId, id)
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
