import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PartnerNetworksModels } from "./partnerNetworks.models";

export namespace PartnerNetworksApi {
  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: PartnerNetworksModels.PartnerNetworkLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PartnerNetworksModels.PartnerNetworksPaginateLabelsResponseSchema },
      `/partner-networks/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkLabelFilterDtoSchema.optional(), filter, {
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

  export const paginate = (
    limit: number,
    order?: string,
    filter?: PartnerNetworksModels.PartnerNetworkPaginationFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PartnerNetworksModels.PartnerNetworksPaginateResponseSchema },
      `/partner-networks`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(PartnerNetworksModels.PartnerNetworksPaginateOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(PartnerNetworksModels.PartnerNetworkPaginationFilterDtoSchema.optional(), filter, {
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

  export const create = (data: PartnerNetworksModels.CreatePartnerNetworkRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
      `/partner-networks`,
      ZodExtended.parse(PartnerNetworksModels.CreatePartnerNetworkRequestDTOSchema, data),
      config,
    );
  };

  export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
      `/partner-networks/${id}`,
      config,
    );
  };

  export const update = (
    id: string,
    data: PartnerNetworksModels.UpdatePartnerNetworkRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
      `/partner-networks/${id}`,
      ZodExtended.parse(PartnerNetworksModels.UpdatePartnerNetworkRequestDTOSchema, data),
      config,
    );
  };

  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
      `/partner-networks/${id}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema },
      `/partner-networks/${id}/unarchive`,
      undefined,
      config,
    );
  };
}
