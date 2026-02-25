import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { TerminalsModels } from "./terminals.models";

export namespace TerminalsApi {
export const create = (data: TerminalsModels.CreateTerminalRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals`,
        ZodExtended.parse(TerminalsModels.CreateTerminalRequestDTOSchema, data),
        
    )
};
export const paginate = (limit: number, order?: string, filter?: TerminalsModels.TerminalPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalsPaginateResponseSchema },
        `/terminals`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TerminalsModels.TerminalsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TerminalsModels.TerminalPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: TerminalsModels.TerminalLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalsPaginateLabelsResponseSchema },
        `/terminals/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TerminalsModels.TerminalsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TerminalsModels.TerminalLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals/${id}`,
        
    )
};
export const update = (id: string, data: TerminalsModels.UpdateTerminalRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: TerminalsModels.TerminalResponseDTOSchema },
        `/terminals/${id}`,
        ZodExtended.parse(TerminalsModels.UpdateTerminalRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/terminals/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/terminals/${id}/unarchive`,
        
    )
};
}
