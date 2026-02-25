import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WarehousesModels } from "./warehouses.models";

export namespace WarehousesApi {
  export const create = (data: WarehousesModels.CreateWarehouseRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: WarehousesModels.WarehouseResponseDTOSchema },
      `/warehouses`,
      ZodExtended.parse(WarehousesModels.CreateWarehouseRequestDTOSchema, data),
      config,
    );
  };

  export const paginate = (
    limit: number,
    order?: string,
    filter?: WarehousesModels.WarehouseFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: WarehousesModels.WarehousesPaginateResponseSchema }, `/warehouses`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(WarehousesModels.WarehousesPaginateOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(WarehousesModels.WarehouseFilterDtoSchema.optional(), filter, {
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
    });
  };

  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: WarehousesModels.WarehouseLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: WarehousesModels.WarehousesPaginateLabelsResponseSchema },
      `/warehouses/paginate/labels`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(WarehousesModels.WarehousesPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(WarehousesModels.WarehouseLabelFilterDtoSchema.optional(), filter, {
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

  export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get({ resSchema: WarehousesModels.WarehouseResponseDTOSchema }, `/warehouses/${id}`, config);
  };

  export const update = (id: string, data: WarehousesModels.UpdateWarehouseRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: WarehousesModels.WarehouseResponseDTOSchema },
      `/warehouses/${id}`,
      ZodExtended.parse(WarehousesModels.UpdateWarehouseRequestDTOSchema, data),
      config,
    );
  };

  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post({ resSchema: z.void() }, `/warehouses/${id}/archive`, undefined, config);
  };

  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post({ resSchema: z.void() }, `/warehouses/${id}/unarchive`, undefined, config);
  };
}
