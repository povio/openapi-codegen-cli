import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { AirportsModels } from "./airports.models";

export namespace AirportsApi {
export const paginate = (limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportsPaginateResponseSchema },
        `/airports`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(AirportsModels.AirportsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(AirportsModels.AirportPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: AirportsModels.CreateAirportRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports`,
        ZodExtended.parse(AirportsModels.CreateAirportRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportsPaginateLabelsResponseSchema },
        `/airports/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(AirportsModels.AirportsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(AirportsModels.AirportLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const update = (id: string, data: AirportsModels.UpdateAirportRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports/${id}`,
        ZodExtended.parse(AirportsModels.UpdateAirportRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports/${id}`,
        
    )
};
}
