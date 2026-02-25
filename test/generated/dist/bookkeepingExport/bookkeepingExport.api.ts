import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BookkeepingExportModels } from "./bookkeepingExport.models";

export namespace BookkeepingExportApi {
  export const createBatch = (
    officeId: string,
    data: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: BookkeepingExportModels.CreateBookkeepingExportBatchResponseDtoSchema },
      `/offices/${officeId}/bookkeeping-exports`,
      ZodExtended.parse(BookkeepingExportModels.CreateBookkeepingExportBatchRequestDtoSchema, data),
      config,
    );
  };
  export const paginateBatches = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: BookkeepingExportModels.PaginateBatchesResponseSchema },
      `/offices/${officeId}/bookkeeping-exports`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchesOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(
            BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDtoSchema.optional(),
            filter,
            { type: "query", name: "filter" },
          ),
          limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, {
            type: "query",
            name: "limit",
          }),
          page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, {
            type: "query",
            name: "page",
          }),
          cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, {
            type: "query",
            name: "cursor",
          }),
        },
      },
    );
  };
  export const getBatch = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
      `/offices/${officeId}/bookkeeping-exports/${batchId}`,
      config,
    );
  };
  export const updateBatchFormat = (
    officeId: string,
    batchId: string,
    data: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema },
      `/offices/${officeId}/bookkeeping-exports/${batchId}`,
      ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDtoSchema, data),
      config,
    );
  };
  export const updateBatchItem = (
    officeId: string,
    batchId: string,
    data: BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: z.void() },
      `/offices/${officeId}/bookkeeping-exports/${batchId}/items`,
      ZodExtended.parse(BookkeepingExportModels.UpdateBookkeepingExportBatchItemRequestDtoSchema, data),
      config,
    );
  };
  export const paginateBatchItems = (
    officeId: string,
    batchId: string,
    limit: number,
    order?: string,
    filter?: BookkeepingExportModels.BookkeepingExportItemDetailFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: BookkeepingExportModels.PaginateBatchItemsResponseSchema },
      `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/items`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(BookkeepingExportModels.PaginateBatchItemsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(
            BookkeepingExportModels.BookkeepingExportItemDetailFilterDtoSchema.optional(),
            filter,
            { type: "query", name: "filter" },
          ),
          limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, {
            type: "query",
            name: "limit",
          }),
          page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, {
            type: "query",
            name: "page",
          }),
          cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, {
            type: "query",
            name: "cursor",
          }),
        },
      },
    );
  };
  export const validateBookkeepingBatch = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/bookkeeping-exports/${batchId}/validate`,
      undefined,
      config,
    );
  };
  export const exportBookkeepingBatch = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/bookkeeping-exports/${batchId}/export`,
      undefined,
      config,
    );
  };
  export const revertBookkeepingBatch = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/bookkeeping-exports/${batchId}/revert`,
      undefined,
      config,
    );
  };
  export const getVatLineItems = (officeId: string, batchId: string, order?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: BookkeepingExportModels.GetVatLineItemsResponseSchema },
      `/offices/${officeId}/bookkeeping-exports/batches/${batchId}/vat-line-items`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(BookkeepingExportModels.GetVatLineItemsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
        },
      },
    );
  };
}
