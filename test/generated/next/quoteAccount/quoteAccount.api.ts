import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteAccountModels } from "./quoteAccount.models";

export namespace QuoteAccountApi {
export const get = (quoteId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: QuoteAccountModels.QuoteAccountResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/account`,
        config
    )
};
export const createItem = (quoteId: string, officeId: string, data: QuoteAccountModels.CreateQuoteAccountItemRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items`,
        ZodExtended.parse(QuoteAccountModels.CreateQuoteAccountItemRequestDtoSchema, data),
        config
    )
};
export const deleteItem = (quoteId: string, itemId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
        undefined,
        config
    )
};
export const updateItem = (quoteId: string, itemId: string, officeId: string, data: QuoteAccountModels.UpdateQuoteAccountItemRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
        ZodExtended.parse(QuoteAccountModels.UpdateQuoteAccountItemRequestDtoSchema, data),
        config
    )
};
export const duplicateItem = (quoteId: string, itemId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}/duplicate`,
        undefined,
        config
    )
};
}
