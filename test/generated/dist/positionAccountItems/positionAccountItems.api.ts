import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionAccountItemsModels } from "./positionAccountItems.models";

export namespace PositionAccountItemsApi {
  export const create = (
    positionId: string,
    officeId: string,
    data: PositionAccountItemsModels.CreatePositionAccountItemsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: PositionAccountItemsModels.PositionAccountItemsCreateResponseSchema },
      `/offices/${officeId}/positions/${positionId}/account/items`,
      ZodExtended.parse(PositionAccountItemsModels.CreatePositionAccountItemsRequestDtoSchema, data),
      config,
    );
  };
  export const deletePositionAccountItems = (
    positionId: string,
    officeId: string,
    data: PositionAccountItemsModels.DeletePositionAccountItemsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/account/items`,
      ZodExtended.parse(PositionAccountItemsModels.DeletePositionAccountItemsRequestDtoSchema, data),
      config,
    );
  };
  export const update = (
    positionId: string,
    officeId: string,
    data: PositionAccountItemsModels.UpdatePositionAccountItemsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: PositionAccountItemsModels.PositionAccountItemsUpdateResponseSchema },
      `/offices/${officeId}/positions/${positionId}/account/items`,
      ZodExtended.parse(PositionAccountItemsModels.UpdatePositionAccountItemsRequestDtoSchema, data),
      config,
    );
  };
  export const duplicate = (
    positionId: string,
    officeId: string,
    data: PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: PositionAccountItemsModels.PositionAccountItemsDuplicateResponseSchema },
      `/offices/${officeId}/positions/${positionId}/account/items/duplicate`,
      ZodExtended.parse(PositionAccountItemsModels.DuplicatePositionAccountItemsRequestDtoSchema, data),
      config,
    );
  };
  export const reassign = (
    positionId: string,
    officeId: string,
    data: PositionAccountItemsModels.ReassignPositionAccountItemsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: PositionAccountItemsModels.ReassignResponseSchema },
      `/offices/${officeId}/positions/${positionId}/account/items/reassign`,
      ZodExtended.parse(PositionAccountItemsModels.ReassignPositionAccountItemsRequestDtoSchema, data),
      config,
    );
  };
  export const reorder = (
    positionId: string,
    itemId: string,
    officeId: string,
    data: PositionAccountItemsModels.ReorderPositionAccountItemRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/account/items/${itemId}/reorder`,
      ZodExtended.parse(PositionAccountItemsModels.ReorderPositionAccountItemRequestDtoSchema, data),
      config,
    );
  };
}
