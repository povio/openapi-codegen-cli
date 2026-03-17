import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ControlTowerContainersModels } from "./controlTowerContainers.models";

export namespace ControlTowerContainersApi {
export const findAll = (limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ControlTowerContainersFindAllResponseSchema },
        `/containers`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerContainersModels.ControlTowerContainersFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ControlTowerContainersModels.ContainerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ContainerResponseDtoSchema },
        `/containers/${id}`,
        
    )
};
export const getJourney = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ContainerJourneyResponseDtoSchema },
        `/containers/${id}/journey`,
        
    )
};
}
