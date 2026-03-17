import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BusinessPartnerContactsAcl } from "./businessPartnerContacts.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnerContactsModels } from "./businessPartnerContacts.models";
import { BusinessPartnerContactsApi } from "./businessPartnerContacts.api";

export namespace BusinessPartnerContactsQueries {
export const moduleName = QueryModule.BusinessPartnerContacts;

export const keys = {
    all: [moduleName] as const,
    getContacts: (officeId: string, businessPartnerId: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts", officeId, businessPartnerId] as const,
    paginateContactLabels: (officeId: string, businessPartnerId: string, limit?: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts/labels/paginate", officeId, businessPartnerId, limit, order, filter, page, cursor] as const,
    paginateContactLabelsInfinite: (officeId: string, businessPartnerId: string, limit?: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts/labels/paginate", "infinite", officeId, businessPartnerId, limit, order, filter, cursor] as const,
};

export const getContactsQueryOptions = ({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }) => ({
  queryKey: keys.getContacts(officeId, businessPartnerId),
  queryFn: () => BusinessPartnerContactsApi.getContacts(officeId, businessPartnerId),
});

/** 
 * Query `useGetContacts`
 * @summary Get all contacts for a business partner
 * @permission Requires `canUseGetContacts` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnerContactsModels.BusinessPartnerContactListResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetContacts = <TData>({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: AppQueryOptions<typeof BusinessPartnerContactsApi.getContacts, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getContactsQueryOptions({ officeId, businessPartnerId }),
    queryFn: async () => {
    checkAcl(BusinessPartnerContactsAcl.canUseGetContacts({ officeId } ));
      return getContactsQueryOptions({ officeId, businessPartnerId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreateContact`
 * @summary Create a new contact for a business partner
 * @permission Requires `canUseCreateContact` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerContactsModels.BusinessPartnerContactResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateContact = (options?: AppMutationOptions<typeof BusinessPartnerContactsApi.createContact, { officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerContacts>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseCreateContact({ officeId } ));
      return BusinessPartnerContactsApi.createContact(officeId, businessPartnerId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const paginateContactLabelsQueryOptions = ({ officeId, businessPartnerId, limit, order, filter, page, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateContactLabels(officeId, businessPartnerId, limit, order, filter, page, cursor),
  queryFn: () => BusinessPartnerContactsApi.paginateContactLabels(officeId, businessPartnerId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateContactLabels`
 * @summary Paginate business partner contact labels (id and name only)
 * @permission Requires `canUsePaginateContactLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, role, email, createdAt, updatedAt. Example: `name`
 * @param { BusinessPartnerContactsModels.BusinessPartnerContactFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnerContactsModels.PaginateContactLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateContactLabels = <TData>({ officeId, businessPartnerId, limit, order, filter, page, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof BusinessPartnerContactsApi.paginateContactLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateContactLabelsQueryOptions({ officeId, businessPartnerId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(BusinessPartnerContactsAcl.canUsePaginateContactLabels({ officeId } ));
      return paginateContactLabelsQueryOptions({ officeId, businessPartnerId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateContactLabelsInfiniteQueryOptions = ({ officeId, businessPartnerId, limit, order, filter, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateContactLabelsInfinite(officeId, businessPartnerId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => BusinessPartnerContactsApi.paginateContactLabels(officeId, businessPartnerId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateContactLabelsInfinite
 * @summary Paginate business partner contact labels (id and name only)
 * @permission Requires `canUsePaginateContactLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, role, email, createdAt, updatedAt. Example: `name`
 * @param { BusinessPartnerContactsModels.BusinessPartnerContactFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BusinessPartnerContactsModels.PaginateContactLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateContactLabelsInfinite = <TData>({ officeId, businessPartnerId, limit, order, filter, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof BusinessPartnerContactsApi.paginateContactLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateContactLabelsInfiniteQueryOptions({ officeId, businessPartnerId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(BusinessPartnerContactsAcl.canUsePaginateContactLabels({ officeId } ));
      return paginateContactLabelsInfiniteQueryOptions({ officeId, businessPartnerId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateContact`
 * @summary Update a business partner contact
 * @permission Requires `canUseUpdateContact` ability 
 * @param { string } contactId Path parameter
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnerContactsModels.BusinessPartnerContactResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateContact = (options?: AppMutationOptions<typeof BusinessPartnerContactsApi.updateContact, { contactId: string, officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerContacts>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ contactId, officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseUpdateContact({ officeId } ));
      return BusinessPartnerContactsApi.updateContact(contactId, officeId, businessPartnerId, data)
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
 * Mutation `useDeleteContact`
 * @permission Requires `canUseDeleteContact` ability 
 * @param { string } contactId Path parameter
 * @param { string } officeId Path parameter
 * @param { string } businessPartnerId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 204, 401]
 */
export const useDeleteContact = (options?: AppMutationOptions<typeof BusinessPartnerContactsApi.deleteContact, { contactId: string, officeId: string, businessPartnerId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartnerContacts>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ contactId, officeId, businessPartnerId }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseDeleteContact({ officeId } ));
      return BusinessPartnerContactsApi.deleteContact(contactId, officeId, businessPartnerId)
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
