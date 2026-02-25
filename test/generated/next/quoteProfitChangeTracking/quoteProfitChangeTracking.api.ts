import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteProfitChangeTrackingModels } from "./quoteProfitChangeTracking.models";

export namespace QuoteProfitChangeTrackingApi {
export const findProfitChangeGroups = (officeId: string, quoteId: string, limit: number, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: QuoteProfitChangeTrackingModels.QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups`,
        {
            ...config,
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findProfitChangeGroupDetail = (groupId: string, officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDetailDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/account/profit-change-groups/${groupId}`,
        config
    )
};
}
