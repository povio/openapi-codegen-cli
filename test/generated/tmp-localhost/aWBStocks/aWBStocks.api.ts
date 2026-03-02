import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { AWBStocksModels } from "./aWBStocks.models";

export namespace AWBStocksApi {
export const paginate = (officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: AWBStocksModels.AWBStocksPaginateResponseSchema },
        `/offices/${officeId}/awb-stocks`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(AWBStocksModels.AWBStocksPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(AWBStocksModels.AWBStockFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: AWBStocksModels.CreateAWBStockRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
        `/offices/${officeId}/awb-stocks`,
        ZodExtended.parse(AWBStocksModels.CreateAWBStockRequestDTOSchema, data),
        
    )
};
export const findById = (stockId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
        `/offices/${officeId}/awb-stocks/${stockId}`,
        
    )
};
export const update = (stockId: string, officeId: string, data: AWBStocksModels.UpdateAWBStockRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
        `/offices/${officeId}/awb-stocks/${stockId}`,
        ZodExtended.parse(AWBStocksModels.UpdateAWBStockRequestDTOSchema, data),
        
    )
};
export const archive = (stockId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
        `/offices/${officeId}/awb-stocks/${stockId}/archive`,
        
    )
};
export const unarchive = (stockId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
        `/offices/${officeId}/awb-stocks/${stockId}/unarchive`,
        
    )
};
export const generateNextNumber = (officeId: string, data: AWBStocksModels.GenerateAWBNumberRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: AWBStocksModels.GenerateAWBNumberResponseDTOSchema },
        `/offices/${officeId}/awb-stocks/generate-number`,
        ZodExtended.parse(AWBStocksModels.GenerateAWBNumberRequestDTOSchema, data),
        
    )
};
}
