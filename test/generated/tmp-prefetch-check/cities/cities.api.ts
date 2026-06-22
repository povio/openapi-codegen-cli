import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { CitiesModels } from "./cities.models";

export namespace CitiesApi {
export const paginate = (limit: number, order?: string, filter?: CitiesModels.CityPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CitiesPaginateResponseSchema },
        `/cities`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.CitiesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CitiesModels.CityPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: CitiesModels.CreateCityRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities`,
        ZodExtended.parse(CitiesModels.CreateCityRequestDTOSchema, data),
        
    )
};
export const listCityLabels = (limit: number, order?: string, filter?: CitiesModels.CityLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.ListCityLabelsResponseSchema },
        `/cities/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CitiesModels.ListCityLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CitiesModels.CityLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getCityLabelById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CityLabelResponseDTOSchema },
        `/cities/${id}/labels`,
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities/${id}`,
        
    )
};
export const update = (id: string, data: CitiesModels.UpdateCityRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: CitiesModels.CityResponseDTOSchema },
        `/cities/${id}`,
        ZodExtended.parse(CitiesModels.UpdateCityRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/cities/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/cities/${id}/unarchive`,
        
    )
};
}
