import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { RoadQuotesModels } from "./roadQuotes.models";

export namespace RoadQuotesApi {
export const get = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: RoadQuotesModels.RoadQuoteResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/road-quote`,
        
    )
};
export const update = (officeId: string, quoteId: string, data: RoadQuotesModels.UpdateRoadQuoteRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: RoadQuotesModels.RoadQuoteResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/road-quote`,
        ZodExtended.parse(RoadQuotesModels.UpdateRoadQuoteRequestDTOSchema, data),
        
    )
};
}
