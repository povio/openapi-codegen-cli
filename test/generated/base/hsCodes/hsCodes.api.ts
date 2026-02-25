import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { HsCodesModels } from "./hsCodes.models";

export namespace HsCodesApi {
  export const paginate = (
    limit: number,
    order?: string,
    filter?: HsCodesModels.HsCodePaginationFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: HsCodesModels.HsCodesPaginateResponseSchema }, `/hs-codes`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(HsCodesModels.HsCodesPaginateOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(HsCodesModels.HsCodePaginationFilterDtoSchema.optional(), filter, {
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

  export const create = (data: HsCodesModels.CreateHsCodeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
      `/hs-codes`,
      ZodExtended.parse(HsCodesModels.CreateHsCodeRequestDTOSchema, data),
      config,
    );
  };

  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: HsCodesModels.HsCodeLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: HsCodesModels.HsCodesPaginateLabelsResponseSchema },
      `/hs-codes/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(HsCodesModels.HsCodesPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(HsCodesModels.HsCodeLabelFilterDtoSchema.optional(), filter, {
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
    return AppRestClient.get({ resSchema: HsCodesModels.HsCodeResponseDTOSchema }, `/hs-codes/${id}`, config);
  };

  export const update = (id: string, data: HsCodesModels.UpdateHsCodeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
      `/hs-codes/${id}`,
      ZodExtended.parse(HsCodesModels.UpdateHsCodeRequestDTOSchema, data),
      config,
    );
  };

  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
      `/hs-codes/${id}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
      `/hs-codes/${id}/unarchive`,
      undefined,
      config,
    );
  };
}
