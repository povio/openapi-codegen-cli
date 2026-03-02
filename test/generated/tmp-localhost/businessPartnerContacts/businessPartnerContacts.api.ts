import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnerContactsModels } from "./businessPartnerContacts.models";

export namespace BusinessPartnerContactsApi {
export const getContacts = (officeId: string, businessPartnerId: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactListResponseDTOSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
        
    )
};
export const createContact = (officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
        ZodExtended.parse(BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTOSchema, data),
        
    )
};
export const paginateContactLabels = (officeId: string, businessPartnerId: string, limit: number, order?: string, filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto, page?: number, cursor?: string, ) => {
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
    )
};
export const updateContact = (contactId: string, officeId: string, businessPartnerId: string, data: BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
        ZodExtended.parse(BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTOSchema, data),
        
    )
};
export const deleteContact = (contactId: string, officeId: string, businessPartnerId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
        
    )
};
}
