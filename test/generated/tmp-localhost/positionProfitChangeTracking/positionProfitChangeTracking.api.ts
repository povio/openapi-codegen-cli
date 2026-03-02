import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionProfitChangeTrackingModels } from "./positionProfitChangeTracking.models";

export namespace PositionProfitChangeTrackingApi {
export const findProfitChangeGroups = (officeId: string, positionId: string, limit: number, order?: string, filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema },
        `/offices/${officeId}/positions/${positionId}/account/profit-change-groups`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findProfitChangeGroupDetail = (groupId: string, officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDtoSchema },
        `/offices/${officeId}/positions/${positionId}/account/profit-change-groups/${groupId}`,
        
    )
};
}
