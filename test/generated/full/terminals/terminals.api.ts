import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { TerminalsModels } from "./terminals.models";

export namespace TerminalsApi {
export const create = (data: TerminalsModels.CreateTerminalRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals`,
        ZodExtended.parse(TerminalsModels.CreateTerminalRequestDTOSchema, data),
        config
    )
};
export const paginate = (limit: number, order?: string, filter?: TerminalsModels.TerminalPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalsPaginateResponseSchema },
        `/terminals`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TerminalsModels.TerminalsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TerminalsModels.TerminalPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: TerminalsModels.TerminalLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalsPaginateLabelsResponseSchema },
        `/terminals/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TerminalsModels.TerminalsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TerminalsModels.TerminalLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals/${id}`,
        config
    )
};
export const update = (id: string, data: TerminalsModels.UpdateTerminalRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals/${id}`,
        ZodExtended.parse(TerminalsModels.UpdateTerminalRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/terminals/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/terminals/${id}/unarchive`,
        undefined,
        config
    )
};
}
