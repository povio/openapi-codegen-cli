import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { AirportsModels } from "./airports.models";

export namespace AirportsApi {
export const paginate = (limit: number, order?: string, filter?: AirportsModels.AirportPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportsPaginateResponseSchema },
        `/airports`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(AirportsModels.AirportsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(AirportsModels.AirportPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: AirportsModels.CreateAirportRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports`,
        ZodExtended.parse(AirportsModels.CreateAirportRequestDTOSchema, data),
        config
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: AirportsModels.AirportLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportsPaginateLabelsResponseSchema },
        `/airports/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(AirportsModels.AirportsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(AirportsModels.AirportLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const update = (id: string, data: AirportsModels.UpdateAirportRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports/${id}`,
        ZodExtended.parse(AirportsModels.UpdateAirportRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: AirportsModels.AirportResponseDTOSchema },
        `/airports/${id}`,
        config
    )
};
}
