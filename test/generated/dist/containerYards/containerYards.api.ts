import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ContainerYardsModels } from "./containerYards.models";
import { CommonModels } from "@/data/common/common.models";

export namespace ContainerYardsApi {
  export const paginate = (
    limit: number,
    order?: string,
    filter?: ContainerYardsModels.ContainerYardFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: ContainerYardsModels.ContainerYardsPaginateResponseSchema },
      `/container-yards`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(ContainerYardsModels.ContainerYardsPaginateOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(ContainerYardsModels.ContainerYardFilterDtoSchema.optional(), filter, {
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
  export const create = (data: ContainerYardsModels.CreateContainerYardRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
      `/container-yards`,
      ZodExtended.parse(ContainerYardsModels.CreateContainerYardRequestDTOSchema, data),
      config,
    );
  };
  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: ContainerYardsModels.ContainerYardLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: ContainerYardsModels.ContainerYardsPaginateLabelsResponseSchema },
      `/container-yards/paginate/labels`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(ContainerYardsModels.ContainerYardsPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(ContainerYardsModels.ContainerYardLabelFilterDtoSchema.optional(), filter, {
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
  export const getLabelById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: CommonModels.LabelResponseDTOSchema },
      `/container-yards/${id}/labels`,
      config,
    );
  };
  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
      `/container-yards/${id}/archive`,
      undefined,
      config,
    );
  };
  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
      `/container-yards/${id}/unarchive`,
      undefined,
      config,
    );
  };
  export const update = (
    id: string,
    data: ContainerYardsModels.UpdateContainerYardRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
      `/container-yards/${id}`,
      ZodExtended.parse(ContainerYardsModels.UpdateContainerYardRequestDTOSchema, data),
      config,
    );
  };
  export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
      `/container-yards/${id}`,
      config,
    );
  };
}
