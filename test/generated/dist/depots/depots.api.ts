import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DepotsModels } from "./depots.models";

export namespace DepotsApi {
  export const create = (data: DepotsModels.CreateDepotRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: DepotsModels.DepotResponseDTOSchema },
      `/depots`,
      ZodExtended.parse(DepotsModels.CreateDepotRequestDTOSchema, data),
      config,
    );
  };
  export const paginate = (
    limit: number,
    order?: string,
    filter?: DepotsModels.DepotPaginationFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: DepotsModels.DepotsPaginateResponseSchema }, `/depots`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(DepotsModels.DepotsPaginateOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(DepotsModels.DepotPaginationFilterDtoSchema.optional(), filter, {
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
    filter?: DepotsModels.DepotLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: DepotsModels.DepotsPaginateLabelsResponseSchema },
      `/depots/paginate/labels`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(DepotsModels.DepotsPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(DepotsModels.DepotLabelFilterDtoSchema.optional(), filter, {
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
    return AppRestClient.get({ resSchema: DepotsModels.DepotResponseDTOSchema }, `/depots/${id}`, config);
  };
  export const update = (id: string, data: DepotsModels.UpdateDepotRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
      { resSchema: DepotsModels.DepotResponseDTOSchema },
      `/depots/${id}`,
      ZodExtended.parse(DepotsModels.UpdateDepotRequestDTOSchema, data),
      config,
    );
  };
  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post({ resSchema: z.void() }, `/depots/${id}/archive`, undefined, config);
  };
  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post({ resSchema: z.void() }, `/depots/${id}/unarchive`, undefined, config);
  };
}
