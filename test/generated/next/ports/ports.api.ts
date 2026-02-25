import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PortsModels } from "./ports.models";

export namespace PortsApi {
export const paginate = (limit: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortsPaginateResponseSchema },
        `/ports`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PortsModels.PortPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: PortsModels.CreatePortRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports`,
        ZodExtended.parse(PortsModels.CreatePortRequestDTOSchema, data),
        config
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: PortsModels.PortLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortsPaginateLabelsResponseSchema },
        `/ports/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PortsModels.PortLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const update = (id: string, data: PortsModels.UpdatePortRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports/${id}`,
        ZodExtended.parse(PortsModels.UpdatePortRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports/${id}`,
        config
    )
};
}
