import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QuoteDocumentModels } from "./quoteDocument.models";

export namespace QuoteDocumentApi {
export const get = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteDocumentModels.QuoteDocumentResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/document`,
        
    )
};
export const update = (officeId: string, quoteId: string, data: QuoteDocumentModels.UpdateQuoteDocumentRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/document`,
        ZodExtended.parse(QuoteDocumentModels.UpdateQuoteDocumentRequestDtoSchema, data),
        
    )
};
export const getPreview = (officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/quotes/${quoteId}/document/preview`,
        ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generate = (officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/document/generate`,
        ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentRequestDtoSchema, data),
        
    )
};
export const generateEml = (officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/quotes/${quoteId}/document/eml`,
        ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
}
