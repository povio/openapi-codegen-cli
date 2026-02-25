import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BookkeepingExportModels } from "./bookkeepingExport.models";

export namespace BookkeepingExportApi {
export const createBatch = (officeId: string, data: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: BookkeepingExportModels.CreateBookkeepingExportBatchResponseDtoSchema },
        `/offices/${officeId}/bookkeeping-exports`,
        ZodExtended.parse(BookkeepingExportModels.CreateBookkeepingExportBatchRequestDtoSchema, data),
        
    )
};
export const paginateBatches = (officeId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: BookkeepingExportModels.PaginateBatchesResponseSchema },
        `/offices/${officeId}/bookkeeping-exports`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getBatch = (officeId: string, batchId: string, ) => {
    return AppRestClient.get(
        { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
        `/offices/${officeId}/bookkeeping-exports/${batchId}`,
        
    )
};
export const updateBatchFormat = (officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
        `/offices/${officeId}/bookkeeping-exports/${batchId}`,
        ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDtoSchema, data),
        
    )
};
export const updateBatchItem = (officeId: string, batchId: string, data: BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: z.void() },
        `/offices/${officeId}/bookkeeping-exports/${batchId}/items`,
        ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDtoSchema, data),
        
    )
};
export const paginateBatchItems = (officeId: string, batchId: string, limit: number, order?: string, filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: BookkeepingExportModels.PaginateBatchItemsResponseSchema },
        `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/items`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchItemsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BookkeepingExportModels.BookkeepingExportItemDetailFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const validateBookkeepingBatch = (officeId: string, batchId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/bookkeeping-exports/${batchId}/validate`,
        
    )
};
export const exportBookkeepingBatch = (officeId: string, batchId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/bookkeeping-exports/${batchId}/export`,
        
    )
};
export const revertBookkeepingBatch = (officeId: string, batchId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/bookkeeping-exports/${batchId}/revert`,
        
    )
};
export const getVatLineItems = (officeId: string, batchId: string, order?: string, ) => {
    return AppRestClient.get(
        { resSchema: BookkeepingExportModels.GetVatLineItemsResponseSchema },
        `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/vat-line-items`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BookkeepingExportModels.GetVatLineItemsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
            },
        }
    )
};
}
