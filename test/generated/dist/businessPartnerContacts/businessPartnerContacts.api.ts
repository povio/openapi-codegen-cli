import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnerContactsModels } from "./businessPartnerContacts.models";

export namespace BusinessPartnerContactsApi {
  export const getContacts = (officeId: string, businessPartnerId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactListResponseDTOSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
      config,
    );
  };
  export const createContact = (
    officeId: string,
    businessPartnerId: string,
    data: BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/contacts`,
      ZodExtended.parse(BusinessPartnerContactsModels.CreateBusinessPartnerContactRequestDTOSchema, data),
      config,
    );
  };
  export const paginateContactLabels = (
    officeId: string,
    businessPartnerId: string,
    limit: number,
    order?: string,
    filter?: BusinessPartnerContactsModels.BusinessPartnerContactFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: BusinessPartnerContactsModels.PaginateContactLabelsResponseSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(BusinessPartnerContactsModels.PaginateContactLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(
            BusinessPartnerContactsModels.BusinessPartnerContactFilterDtoSchema.optional(),
            filter,
            { type: "query", name: "filter" },
          ),
          limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, {
            type: "query",
            name: "limit",
          }),
          page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, {
            type: "query",
            name: "page",
          }),
          cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, {
            type: "query",
            name: "cursor",
          }),
        },
      },
    );
  };
  export const updateContact = (
    contactId: string,
    officeId: string,
    businessPartnerId: string,
    data: BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: BusinessPartnerContactsModels.BusinessPartnerContactResponseDTOSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
      ZodExtended.parse(BusinessPartnerContactsModels.UpdateBusinessPartnerContactRequestDTOSchema, data),
      config,
    );
  };
  export const deleteContact = (
    contactId: string,
    officeId: string,
    businessPartnerId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/business-partners/${businessPartnerId}/contacts/${contactId}`,
      undefined,
      config,
    );
  };
}
