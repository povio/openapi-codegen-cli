import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnersModels } from "./businessPartners.models";

export namespace BusinessPartnersApi {
export const paginate = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnersPaginateResponseSchema },
        `/offices/${officeId}/business-partners`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerResponseDTOSchema },
        `/offices/${officeId}/business-partners`,
        ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnersPaginateLabelsResponseSchema },
        `/offices/${officeId}/business-partners/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getById = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}`,
        
    )
};
export const update = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRequestDTOSchema, data),
        
    )
};
export const archive = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/archive`,
        
    )
};
export const unarchive = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/unarchive`,
        
    )
};
export const lock = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/lock`,
        
    )
};
export const unlock = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/unlock`,
        
    )
};
export const getRemarks = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.GetRemarksResponseSchema },
        `/offices/${officeId}/business-partners/${id}/remarks`,
        
    )
};
export const createRemark = (officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/remarks`,
        ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTOSchema, data),
        
    )
};
export const updateRemark = (officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDtoSchema, data),
        
    )
};
export const deleteRemark = (officeId: string, id: string, remarkId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
        
    )
};
export const getBasicInfo = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic`,
        
    )
};
export const updateBasicInfo = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTOSchema, data),
        
    )
};
export const createSignatureUploadInstructions = (officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerSignatureUploadResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic/signature-upload`,
        ZodExtended.parse(BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTOSchema, data),
        
    )
};
export const getCargoAgentInfo = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/cargo-agent`,
        
    )
};
export const updateCargoAgent = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/cargo-agent`,
        ZodExtended.parse(BusinessPartnersModels.UpdateCargoAgentDTOSchema, data),
        
    )
};
export const getCarrierInformation = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/carrier`,
        
    )
};
export const updateCarrier = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/carrier`,
        ZodExtended.parse(BusinessPartnersModels.UpdateCarrierDTOSchema, data),
        
    )
};
}
