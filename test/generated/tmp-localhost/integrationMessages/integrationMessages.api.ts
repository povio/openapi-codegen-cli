import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { IntegrationMessagesModels } from "./integrationMessages.models";

export namespace IntegrationMessagesApi {
export const list = (officeId: string, limit: number, order?: string, filter?: IntegrationMessagesModels.IntegrationMessageFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: IntegrationMessagesModels.IntegrationMessagesListResponseSchema },
        `/offices/${officeId}/integration-messages`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(IntegrationMessagesModels.IntegrationMessagesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(IntegrationMessagesModels.IntegrationMessageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
