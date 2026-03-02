import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { CurrenciesModels } from "./currencies.models";

export namespace CurrenciesApi {
export const list = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.CurrenciesListResponseSchema },
        `/currencies`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.CurrenciesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createCurrency = (data: CurrenciesModels.CreateCurrencyRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies`,
        ZodExtended.parse(CurrenciesModels.CreateCurrencyRequestDTOSchema, data),
        
    )
};
export const paginateCurrencyLabels = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.PaginateCurrencyLabelsResponseSchema },
        `/currencies/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getCurrencyById = (isoCode: string, ) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies/${isoCode}`,
        
    )
};
export const updateCurrency = (isoCode: string, data: CurrenciesModels.UpdateCurrencyRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies/${isoCode}`,
        ZodExtended.parse(CurrenciesModels.UpdateCurrencyRequestDTOSchema, data),
        
    )
};
export const paginateCurrencyLabelsByOffice = (officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.PaginateCurrencyLabelsByOfficeResponseSchema },
        `/offices/${officeId}/currencies/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
