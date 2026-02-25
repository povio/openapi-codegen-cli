import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteCargoModels } from "./quoteCargo.models";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteCargoApi {
  export const listCargosByQuoteId = (
    officeId: string,
    quoteId: string,
    limit: number,
    order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: QuoteCargoModels.ListCargosByQuoteIdResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(QuoteCargoModels.ListCargosByQuoteIdOrderParamSchema.optional(), order, {
            type: "query",
            name: "order",
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

  export const listCargoLabels = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: QuoteCargoModels.QuoteCargoListCargoLabelsResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/labels`,
      config,
    );
  };

  export const getCargoSummary = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: QuoteCargoModels.QuoteCargoGetCargoSummaryResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/summary`,
      config,
    );
  };

  export const getCargoById = (officeId: string, quoteId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: CommonModels.PositionCargoResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
      config,
    );
  };

  export const updateCargo = (
    officeId: string,
    quoteId: string,
    cargoId: string,
    data: CommonModels.UpdatePositionCargoDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.PositionCargoResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
      ZodExtended.parse(CommonModels.UpdatePositionCargoDTOSchema, data),
      config,
    );
  };

  export const deleteCargo = (officeId: string, quoteId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
      undefined,
      config,
    );
  };

  export const createBulkCargos = (
    numberOfCargos: number,
    officeId: string,
    quoteId: string,
    data: CommonModels.CreatePositionCargoDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: QuoteCargoModels.QuoteCargoCreateBulkCargosResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/bulk/${numberOfCargos}`,
      ZodExtended.parse(CommonModels.CreatePositionCargoDTOSchema, data),
      config,
    );
  };

  export const duplicateCargo = (officeId: string, quoteId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCargoResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/duplicate`,
      undefined,
      config,
    );
  };
}
