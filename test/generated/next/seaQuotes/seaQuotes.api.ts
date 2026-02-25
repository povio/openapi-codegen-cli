import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { SeaQuotesModels } from "./seaQuotes.models";

export namespace SeaQuotesApi {
export const get = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: SeaQuotesModels.SeaQuoteResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/sea-quote`,
        
    )
};
export const update = (officeId: string, quoteId: string, data: SeaQuotesModels.UpdateSeaQuoteRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: SeaQuotesModels.SeaQuoteResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/sea-quote`,
        ZodExtended.parse(SeaQuotesModels.UpdateSeaQuoteRequestDTOSchema, data),
        
    )
};
}
