import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CitiesModels } from "./cities.models";

export namespace CitiesApi {
export const paginate = (limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CitiesPaginateResponseSchema },
        `/cities`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.CitiesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CitiesModels.CityPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: CitiesModels.CreateCityRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities`,
        ZodExtended.parse(CitiesModels.CreateCityRequestDTOSchema, data),
        config
    )
};
export const listCityLabels = (limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.ListCityLabelsResponseSchema },
        `/cities/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.ListCityLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CitiesModels.CityLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getCityLabelById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CityLabelResponseDTOSchema },
        `/cities/${id}/labels`,
        config
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities/${id}`,
        config
    )
};
export const update = (id: string, data: CitiesModels.UpdateCityRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities/${id}`,
        ZodExtended.parse(CitiesModels.UpdateCityRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/cities/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/cities/${id}/unarchive`,
        undefined,
        config
    )
};
}
