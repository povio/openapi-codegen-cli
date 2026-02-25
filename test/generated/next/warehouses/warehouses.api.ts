import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WarehousesModels } from "./warehouses.models";

export namespace WarehousesApi {
export const create = (data: WarehousesModels.CreateWarehouseRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: WarehousesModels.WarehouseResponseDTOSchema },
        `/warehouses`,
        ZodExtended.parse(WarehousesModels.CreateWarehouseRequestDTOSchema, data),
        
    )
};
export const paginate = (limit: number, order?: string, filter?: WarehousesModels.WarehouseFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: WarehousesModels.WarehousesPaginateResponseSchema },
        `/warehouses`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(WarehousesModels.WarehousesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(WarehousesModels.WarehouseFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: WarehousesModels.WarehouseLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: WarehousesModels.WarehousesPaginateLabelsResponseSchema },
        `/warehouses/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(WarehousesModels.WarehousesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(WarehousesModels.WarehouseLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: WarehousesModels.WarehouseResponseDTOSchema },
        `/warehouses/${id}`,
        
    )
};
export const update = (id: string, data: WarehousesModels.UpdateWarehouseRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WarehousesModels.WarehouseResponseDTOSchema },
        `/warehouses/${id}`,
        ZodExtended.parse(WarehousesModels.UpdateWarehouseRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/warehouses/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/warehouses/${id}/unarchive`,
        
    )
};
}
