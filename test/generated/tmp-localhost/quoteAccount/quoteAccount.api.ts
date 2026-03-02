import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteAccountModels } from "./quoteAccount.models";

export namespace QuoteAccountApi {
export const get = (quoteId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteAccountModels.QuoteAccountResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/account`,
        
    )
};
export const createItem = (quoteId: string, officeId: string, data: QuoteAccountModels.CreateQuoteAccountItemRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items`,
        ZodExtended.parse(QuoteAccountModels.CreateQuoteAccountItemRequestDtoSchema, data),
        
    )
};
export const deleteItem = (quoteId: string, itemId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
        
    )
};
export const updateItem = (quoteId: string, itemId: string, officeId: string, data: QuoteAccountModels.UpdateQuoteAccountItemRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}`,
        ZodExtended.parse(QuoteAccountModels.UpdateQuoteAccountItemRequestDtoSchema, data),
        
    )
};
export const duplicateItem = (quoteId: string, itemId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: QuoteAccountModels.QuoteAccountItemDtoResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/items/${itemId}/duplicate`,
        
    )
};
}
