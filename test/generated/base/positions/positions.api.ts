import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionsModels } from "./positions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionsApi {
  export const findAll = (
    officeId: string,
    limit: number,
    filter?: PositionsModels.PositionLabelsFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.PositionsFindAllResponseSchema },
      `/offices/${officeId}/positions/labels`,
      {
        ...config,
        params: {
          filter: ZodExtended.parse(PositionsModels.PositionLabelsFilterDtoSchema.optional(), filter, {
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
    officeId: string,
    limit: number,
    order?: string,
    filter?: PositionsModels.PositionFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.PositionsPaginateResponseSchema },
      `/offices/${officeId}/positions`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(PositionsModels.PositionsPaginateOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(PositionsModels.PositionFilterDtoSchema.optional(), filter, {
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
    data: PositionsModels.CreatePositionRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions`,
      ZodExtended.parse(PositionsModels.CreatePositionRequestDtoSchema, data),
      config,
    );
  };

  export const totalProfit = (officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.TotalProfitResponseSchema },
      `/offices/${officeId}/positions/fake-total-profit`,
      config,
    );
  };

  export const listAvailablePartnersFor = (
    officeId: string,
    positionId: string,
    search?: string,
    useCase?: CommonModels.PositionAvailablePartnersUseCase,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.PositionsListAvailablePartnersForResponseSchema },
      `/offices/${officeId}/positions/${positionId}/available-partners`,
      {
        ...config,
        params: {
          search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
          useCase: ZodExtended.parse(CommonModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, {
            type: "query",
            name: "useCase",
          }),
        },
      },
    );
  };

  export const exportPositions = (
    officeId: string,
    data: PositionsModels.PositionExportRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/exports`,
      ZodExtended.parse(PositionsModels.PositionExportRequestDtoSchema, data),
      {
        ...config,
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };

  export const get = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}`,
      config,
    );
  };

  export const update = (
    officeId: string,
    positionId: string,
    data: PositionsModels.UpdatePositionDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}`,
      ZodExtended.parse(PositionsModels.UpdatePositionDtoSchema, data),
      config,
    );
  };

  export const listRouteLabels = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.ListRouteLabelsResponseSchema },
      `/offices/${officeId}/positions/${positionId}/routes/labels`,
      config,
    );
  };

  export const getDuplicateDefaultParameters = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.DuplicatePositionDefaultParametersResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/duplicate/default-parameters`,
      config,
    );
  };

  export const duplicate = (
    officeId: string,
    positionId: string,
    data: PositionsModels.DuplicatePositionRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/duplicate`,
      ZodExtended.parse(PositionsModels.DuplicatePositionRequestDtoSchema, data),
      config,
    );
  };

  export const cancel = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/cancel`,
      undefined,
      config,
    );
  };

  export const revertCancel = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCoreResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/uncancel`,
      undefined,
      config,
    );
  };

  export const linkChild = (
    officeId: string,
    positionId: string,
    data: PositionsModels.LinkChildPositionsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/children`,
      ZodExtended.parse(PositionsModels.LinkChildPositionsRequestDtoSchema, data),
      config,
    );
  };

  export const unlinkChild = (
    officeId: string,
    positionId: string,
    data: PositionsModels.UnlinkChildPositionsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/children`,
      ZodExtended.parse(PositionsModels.UnlinkChildPositionsRequestDtoSchema, data),
      config,
    );
  };

  export const listChild = (
    officeId: string,
    positionId: string,
    limit: number,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PositionsModels.ListChildResponseSchema },
      `/offices/${officeId}/positions/${positionId}/children`,
      {
        ...config,
        params: {
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
}
