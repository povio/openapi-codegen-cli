import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QuotesModels } from "./quotes.models";
import { CommonModels } from "@/data/common/common.models";

export namespace QuotesApi {
export const paginate = (officeId: string, limit: number, order?: string, filter?: QuotesModels.QuoteFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: QuotesModels.QuotesPaginateResponseSchema },
        `/offices/${officeId}/quotes`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(QuotesModels.QuotesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(QuotesModels.QuoteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: QuotesModels.CreateQuoteRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
        `/offices/${officeId}/quotes`,
        ZodExtended.parse(QuotesModels.CreateQuoteRequestDTOSchema, data),
        
    )
};
export const listAvailablePartnersFor = (officeId: string, quoteId: string, search?: string, useCase?: QuotesModels.PositionAvailablePartnersUseCase, ) => {
    return AppRestClient.get(
        { resSchema: QuotesModels.QuotesListAvailablePartnersForResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/available-partners`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                useCase: ZodExtended.parse(QuotesModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
            },
        }
    )
};
export const exportQuotes = (officeId: string, data: QuotesModels.QuoteExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/quotes/exports`,
        ZodExtended.parse(QuotesModels.QuoteExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getById = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}`,
        
    )
};
export const update = (officeId: string, quoteId: string, data: QuotesModels.UpdateQuoteRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}`,
        ZodExtended.parse(QuotesModels.UpdateQuoteRequestDTOSchema, data),
        
    )
};
export const cancel = (officeId: string, quoteId: string, ) => {
    return AppRestClient.post(
        { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cancel`,
        
    )
};
export const duplicate = (officeId: string, quoteId: string, data: QuotesModels.DuplicateQuoteRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/duplicate`,
        ZodExtended.parse(QuotesModels.DuplicateQuoteRequestDtoSchema, data),
        
    )
};
export const getInvolvedParties = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuotesModels.GetInvolvedPartiesResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
        
    )
};
export const createInvolvedParty = (officeId: string, quoteId: string, data: QuotesModels.CreateInvolvedPartyRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: QuotesModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
        ZodExtended.parse(QuotesModels.CreateInvolvedPartyRequestDtoSchema, data),
        
    )
};
export const updateInvolvedParty = (officeId: string, quoteId: string, partyId: string, data: QuotesModels.UpdateInvolvedPartyDto, ) => {
    return AppRestClient.patch(
        { resSchema: QuotesModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
        ZodExtended.parse(QuotesModels.UpdateInvolvedPartyDtoSchema, data),
        
    )
};
export const deleteInvolvedParty = (officeId: string, quoteId: string, partyId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
        
    )
};
}
