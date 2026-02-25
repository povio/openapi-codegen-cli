import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CurrenciesModels } from "./currencies.models";

export namespace CurrenciesApi {
export const list = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.CurrenciesListResponseSchema },
        `/currencies`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.CurrenciesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createCurrency = (data: CurrenciesModels.CreateCurrencyRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies`,
        ZodExtended.parse(CurrenciesModels.CreateCurrencyRequestDTOSchema, data),
        config
    )
};
export const paginateCurrencyLabels = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.PaginateCurrencyLabelsResponseSchema },
        `/currencies/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getCurrencyById = (isoCode: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies/${isoCode}`,
        config
    )
};
export const updateCurrency = (isoCode: string, data: CurrenciesModels.UpdateCurrencyRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
        `/currencies/${isoCode}`,
        ZodExtended.parse(CurrenciesModels.UpdateCurrencyRequestDTOSchema, data),
        config
    )
};
export const paginateCurrencyLabelsByOffice = (officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CurrenciesModels.PaginateCurrencyLabelsByOfficeResponseSchema },
        `/offices/${officeId}/currencies/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
