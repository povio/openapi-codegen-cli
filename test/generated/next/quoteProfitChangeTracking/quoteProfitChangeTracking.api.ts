import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteProfitChangeTrackingModels } from "./quoteProfitChangeTracking.models";

export namespace QuoteProfitChangeTrackingApi {
export const findProfitChangeGroups = (officeId: string, quoteId: string, limit: number, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteProfitChangeTrackingModels.QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups`,
        {
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findProfitChangeGroupDetail = (groupId: string, officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDetailDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups/${groupId}`,
        
    )
};
}
