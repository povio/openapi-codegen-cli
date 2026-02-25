import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { AWBStocksModels } from "./aWBStocks.models";

export namespace AWBStocksApi {
  export const paginate = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: AWBStocksModels.AWBStockFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: AWBStocksModels.AWBStocksPaginateResponseSchema },
      `/offices/${officeId}/awb-stocks`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(AWBStocksModels.AWBStocksPaginateOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(AWBStocksModels.AWBStockFilterDtoSchema.optional(), filter, {
            type: "query",
            name: "filter",
          }),
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

  export const create = (
    officeId: string,
    data: AWBStocksModels.CreateAWBStockRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
      `/offices/${officeId}/awb-stocks`,
      ZodExtended.parse(AWBStocksModels.CreateAWBStockRequestDTOSchema, data),
      config,
    );
  };

  export const findById = (stockId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
      `/offices/${officeId}/awb-stocks/${stockId}`,
      config,
    );
  };

  export const update = (
    stockId: string,
    officeId: string,
    data: AWBStocksModels.UpdateAWBStockRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
      `/offices/${officeId}/awb-stocks/${stockId}`,
      ZodExtended.parse(AWBStocksModels.UpdateAWBStockRequestDTOSchema, data),
      config,
    );
  };

  export const archive = (stockId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
      `/offices/${officeId}/awb-stocks/${stockId}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (stockId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
      `/offices/${officeId}/awb-stocks/${stockId}/unarchive`,
      undefined,
      config,
    );
  };

  export const generateNextNumber = (
    officeId: string,
    data: AWBStocksModels.GenerateAWBNumberRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: AWBStocksModels.GenerateAWBNumberResponseDTOSchema },
      `/offices/${officeId}/awb-stocks/generate-number`,
      ZodExtended.parse(AWBStocksModels.GenerateAWBNumberRequestDTOSchema, data),
      config,
    );
  };
}
