import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerContainersModels } from "./controlTowerContainers.models";

export namespace ControlTowerContainersApi {
export const findAll = (limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ControlTowerContainersFindAllResponseSchema },
        `/containers`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerContainersModels.ControlTowerContainersFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ControlTowerContainersModels.ContainerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ContainerResponseDtoSchema },
        `/containers/${id}`,
        config
    )
};
export const getJourney = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ControlTowerContainersModels.ContainerJourneyResponseDtoSchema },
        `/containers/${id}/journey`,
        config
    )
};
}
