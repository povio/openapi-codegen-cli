import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { BusinessPartnerContactsAcl } from "./businessPartnerContacts.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnerContactsModels } from "./businessPartnerContacts.models";

export namespace BusinessPartnerContactsQueries {
const getContacts = (officeId: string, businessPartnerId: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactListResponseDTOSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
    
  );
};

const createContact = (officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO) => {
  return AppRestClient.post(
    { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
    ZodExtended.parse(BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTOSchema, data),
    
  );
};

const paginateContactLabels = (officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnerContactsModels.PaginateContactLabelsResponseSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnerContactsModels.PaginateContactLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BusinessPartnerContactsModels.BusinessPartnerContactFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const updateContact = (contactId: string, officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
    `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
    ZodExtended.parse(BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTOSchema, data),
    
  );
};

const deleteContact = (contactId: string, officeId: string, businessPartnerId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
    
  );
};


export const moduleName = QueryModule.BusinessPartnerContacts;

export const keys = {
    all: [moduleName] as const,
    getContacts: (officeId: string, businessPartnerId: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts", officeId, businessPartnerId] as const,
    paginateContactLabels: (officeId: string, businessPartnerId: string, limit?: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts/labels/paginate", officeId, businessPartnerId, limit, order, filter, page, cursor] as const,
    paginateContactLabelsInfinite: (officeId: string, businessPartnerId: string, limit?: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/:businessPartnerId/contacts/labels/paginate", "infinite", officeId, businessPartnerId, limit, order, filter, cursor] as const,
};

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
export const useGetContacts = <TData>({ officeId, businessPartnerId }: { officeId: string, businessPartnerId: string }, options?: AppQueryOptions<typeof getContacts, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getContacts(officeId, businessPartnerId),
    queryFn: () => { 
    checkAcl(BusinessPartnerContactsAcl.canUseGetContacts({ officeId } ));
    return getContacts(officeId, businessPartnerId) },
    ...options,
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
export const useCreateContact = (options?: AppMutationOptions<typeof createContact, { officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseCreateContact({ officeId } ));
      return createContact(officeId, businessPartnerId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

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
export const usePaginateContactLabels = <TData>({ officeId, businessPartnerId, limit, order, filter, page, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateContactLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateContactLabels(officeId, businessPartnerId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BusinessPartnerContactsAcl.canUsePaginateContactLabels({ officeId } ));
    return paginateContactLabels(officeId, businessPartnerId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateContactLabelsInfinite = <TData>({ officeId, businessPartnerId, limit, order, filter, cursor }: { officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateContactLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateContactLabelsInfinite(officeId, businessPartnerId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BusinessPartnerContactsAcl.canUsePaginateContactLabels({ officeId } ));
    return paginateContactLabels(officeId, businessPartnerId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
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
export const useUpdateContact = (options?: AppMutationOptions<typeof updateContact, { contactId: string, officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ contactId, officeId, businessPartnerId, data }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseUpdateContact({ officeId } ));
      return updateContact(contactId, officeId, businessPartnerId, data)
    },
    ...options,
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
export const useDeleteContact = (options?: AppMutationOptions<typeof deleteContact, { contactId: string, officeId: string, businessPartnerId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ contactId, officeId, businessPartnerId }) => { 
      checkAcl(BusinessPartnerContactsAcl.canUseDeleteContact({ officeId } ));
      return deleteContact(contactId, officeId, businessPartnerId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
