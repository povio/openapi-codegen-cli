import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionProfitChangeTrackingModels } from "./positionProfitChangeTracking.models";

export namespace PositionProfitChangeTrackingApi {
  export const findProfitChangeGroups = (
    officeId: string,
    positionId: string,
    limit: number,
    order?: string,
    filter?: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      {
        resSchema: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema,
      },
      `/offices/${officeId}/positions/${positionId}/account/profit-change-groups`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(
              PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema,
            ).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(
            PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDtoSchema.optional(),
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
  export const findProfitChangeGroupDetail = (
    groupId: string,
    officeId: string,
    positionId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDtoSchema },
      `/offices/${officeId}/positions/${positionId}/account/profit-change-groups/${groupId}`,
      config,
    );
  };
}
