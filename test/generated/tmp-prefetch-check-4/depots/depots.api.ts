import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { DepotsModels } from "./depots.models";

export namespace DepotsApi {
export const create = (data: DepotsModels.CreateDepotRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: DepotsModels.DepotResponseDTOSchema },
        `/depots`,
        ZodExtended.parse(DepotsModels.CreateDepotRequestDTOSchema, data),
        
    )
};
export const paginate = (limit: number, order?: string, filter?: DepotsModels.DepotPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DepotsModels.DepotsPaginateResponseSchema },
        `/depots`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DepotsModels.DepotsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DepotsModels.DepotPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: DepotsModels.DepotLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DepotsModels.DepotsPaginateLabelsResponseSchema },
        `/depots/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DepotsModels.DepotsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DepotsModels.DepotLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: DepotsModels.DepotResponseDTOSchema },
        `/depots/${id}`,
        
    )
};
export const update = (id: string, data: DepotsModels.UpdateDepotRequestDTO, ) => {
    return AppRestClient.put(
        { resSchema: DepotsModels.DepotResponseDTOSchema },
        `/depots/${id}`,
        ZodExtended.parse(DepotsModels.UpdateDepotRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/depots/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/depots/${id}/unarchive`,
        
    )
};
}
