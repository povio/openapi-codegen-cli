import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PartnerNetworksModels } from "./partnerNetworks.models";

export namespace PartnerNetworksApi {
export const paginateLabels = (limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PartnerNetworksModels.PartnerNetworksPaginateLabelsResponseSchema },
        `/partner-networks/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (limit: number, order?: string, filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PartnerNetworksModels.PartnerNetworksPaginateResponseSchema },
        `/partner-networks`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: PartnerNetworksModels.CreatePartnerNetworkRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
        `/partner-networks`,
        ZodExtended.parse(PartnerNetworksModels.CreatePartnerNetworkRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
        `/partner-networks/${id}`,
        
    )
};
export const update = (id: string, data: PartnerNetworksModels.UpdatePartnerNetworkRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
        `/partner-networks/${id}`,
        ZodExtended.parse(PartnerNetworksModels.UpdatePartnerNetworkRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.patch(
        { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
        `/partner-networks/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.patch(
        { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
        `/partner-networks/${id}/unarchive`,
        
    )
};
}
