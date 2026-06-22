import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PortsModels } from "./ports.models";

export namespace PortsApi {
export const paginate = (limit: number, order?: string, filter?: PortsModels.PortPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortsPaginateResponseSchema },
        `/ports`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PortsModels.PortPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: PortsModels.CreatePortRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports`,
        ZodExtended.parse(PortsModels.CreatePortRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: PortsModels.PortLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortsPaginateLabelsResponseSchema },
        `/ports/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PortsModels.PortsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PortsModels.PortLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const update = (id: string, data: PortsModels.UpdatePortRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports/${id}`,
        ZodExtended.parse(PortsModels.UpdatePortRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: PortsModels.PortResponseDTOSchema },
        `/ports/${id}`,
        
    )
};
}
