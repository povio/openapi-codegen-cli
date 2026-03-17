import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { CommonModels } from "@/data/common/common.models";
import { QuoteConversionModels } from "./quoteConversion.models";

export namespace QuoteConversionApi {
export const convertQuoteToPosition = (officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: QuoteConversionModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/convert`,
        ZodExtended.parse(QuoteConversionModels.ConvertQuoteToPositionRequestDtoSchema, data),
        
    )
};
}
