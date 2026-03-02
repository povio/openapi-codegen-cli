import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningPartnerOutstandingInvoicesModels } from "./dunningPartnerOutstandingInvoices.models";

export namespace DunningPartnerOutstandingInvoicesApi {
export const listPartnerOutstandingInvoiceSummaries = (officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesResponseSchema },
        `/offices/${officeId}/partner-outstanding-invoices`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listPartnerOutstandingInvoices = (partnerId: string, officeId: string, limit: number, order?: string, filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesResponseSchema },
        `/offices/${officeId}/partners/${partnerId}/outstanding-invoices`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listRecommendedDunningLevels = (partnerId: string, officeId: string, data: DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: DunningPartnerOutstandingInvoicesModels.ListRecommendedDunningLevelsResponseSchema },
        `/offices/${officeId}/partners/${partnerId}/recommended-dunning-levels`,
        ZodExtended.parse(DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDtoSchema, data),
        
    )
};
}
