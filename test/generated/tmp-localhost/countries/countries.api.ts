import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CountriesModels } from "./countries.models";

export namespace CountriesApi {
export const paginate = (limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CountriesModels.CountriesPaginateResponseSchema },
        `/countries/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CountriesModels.CountriesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CountriesModels.CountryPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateCountryLabels = (limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CountriesModels.PaginateCountryLabelsResponseSchema },
        `/countries/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CountriesModels.PaginateCountryLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CountriesModels.CountryPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getCountryById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: CountriesModels.CountryResponseDTOSchema },
        `/countries/${id}`,
        
    )
};
}
