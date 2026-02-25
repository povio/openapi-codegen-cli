import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnersModels } from "./businessPartners.models";

export namespace BusinessPartnersApi {
export const paginate = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnersPaginateResponseSchema },
        `/offices/${officeId}/business-partners`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerResponseDTOSchema },
        `/offices/${officeId}/business-partners`,
        ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRequestDTOSchema, data),
        config
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnersPaginateLabelsResponseSchema },
        `/offices/${officeId}/business-partners/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getById = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}`,
        config
    )
};
export const update = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRequestDTOSchema, data),
        config
    )
};
export const archive = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/unarchive`,
        undefined,
        config
    )
};
export const lock = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/lock`,
        undefined,
        config
    )
};
export const unlock = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/unlock`,
        undefined,
        config
    )
};
export const getRemarks = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.GetRemarksResponseSchema },
        `/offices/${officeId}/business-partners/${id}/remarks`,
        config
    )
};
export const createRemark = (officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/remarks`,
        ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTOSchema, data),
        config
    )
};
export const updateRemark = (officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDtoSchema, data),
        config
    )
};
export const deleteRemark = (officeId: string, id: string, remarkId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
        undefined,
        config
    )
};
export const getBasicInfo = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic`,
        config
    )
};
export const updateBasicInfo = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic`,
        ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTOSchema, data),
        config
    )
};
export const createSignatureUploadInstructions = (officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnersModels.BusinessPartnerSignatureUploadResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/basic/signature-upload`,
        ZodExtended.parse(BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTOSchema, data),
        config
    )
};
export const getCargoAgentInfo = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/cargo-agent`,
        config
    )
};
export const updateCargoAgent = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/cargo-agent`,
        ZodExtended.parse(BusinessPartnersModels.UpdateCargoAgentDTOSchema, data),
        config
    )
};
export const getCarrierInformation = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/carrier`,
        config
    )
};
export const updateCarrier = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
        `/offices/${officeId}/business-partners/${id}/carrier`,
        ZodExtended.parse(BusinessPartnersModels.UpdateCarrierDTOSchema, data),
        config
    )
};
}
