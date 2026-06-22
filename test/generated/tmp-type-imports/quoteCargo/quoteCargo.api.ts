import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QuoteCargoModels } from "./quoteCargo.models";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteCargoApi {
export const listCargosByQuoteId = (officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteCargoModels.ListCargosByQuoteIdResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos`,
        {
            params: {
                order: ZodExtended.parse(QuoteCargoModels.ListCargosByQuoteIdOrderParamSchema.optional(), order, { type: "query", name: "order" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listCargoLabels = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteCargoModels.QuoteCargoListCargoLabelsResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/labels`,
        
    )
};
export const getCargoSummary = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteCargoModels.QuoteCargoGetCargoSummaryResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/summary`,
        
    )
};
export const getCargoById = (officeId: string, quoteId: string, cargoId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
        
    )
};
export const updateCargo = (officeId: string, quoteId: string, cargoId: string, data: QuoteCargoModels.UpdatePositionCargoDTO, ) => {
    return AppRestClient.patch(
        { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
        ZodExtended.parse(QuoteCargoModels.UpdatePositionCargoDTOSchema, data),
        
    )
};
export const deleteCargo = (officeId: string, quoteId: string, cargoId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
        
    )
};
export const createBulkCargos = (numberOfCargos: number, officeId: string, quoteId: string, data: QuoteCargoModels.CreatePositionCargoDTO, ) => {
    return AppRestClient.post(
        { resSchema: QuoteCargoModels.QuoteCargoCreateBulkCargosResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/bulk/${numberOfCargos}`,
        ZodExtended.parse(QuoteCargoModels.CreatePositionCargoDTOSchema, data),
        
    )
};
export const duplicateCargo = (officeId: string, quoteId: string, cargoId: string, ) => {
    return AppRestClient.post(
        { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/duplicate`,
        
    )
};
}
