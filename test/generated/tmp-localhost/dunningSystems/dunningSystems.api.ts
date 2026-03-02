import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningSystemsModels } from "./dunningSystems.models";

export namespace DunningSystemsApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: DunningSystemsModels.DunningSystemLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemsPaginateLabelsResponseSchema },
        `/offices/${officeId}/dunning-systems/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningSystemsModels.DunningSystemsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningSystemsModels.DunningSystemLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: DunningSystemsModels.DunningSystemFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemsPaginateResponseSchema },
        `/offices/${officeId}/dunning-systems`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningSystemsModels.DunningSystemsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningSystemsModels.DunningSystemFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: DunningSystemsModels.CreateDunningSystemRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems`,
        ZodExtended.parse(DunningSystemsModels.CreateDunningSystemRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: DunningSystemsModels.UpdateDunningSystemRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}`,
        ZodExtended.parse(DunningSystemsModels.UpdateDunningSystemRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}/unarchive`,
        
    )
};
}
