import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";
import { QuoteConversionModels } from "./quoteConversion.models";

export namespace QuoteConversionApi {
export const convertQuoteToPosition = (officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/convert`,
        ZodExtended.parse(QuoteConversionModels.ConvertQuoteToPositionRequestDtoSchema, data),
        config
    )
};
}
