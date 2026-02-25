import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerSearchModels } from "./controlTowerSearch.models";

export namespace ControlTowerSearchApi {
  export const search = (
    data: ControlTowerSearchModels.SearchRequestDto,
    type?: ControlTowerSearchModels.SearchItemTypeEnum,
    limit?: number,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: ControlTowerSearchModels.SearchResponseDtoSchema },
      `/search`,
      ZodExtended.parse(ControlTowerSearchModels.SearchRequestDtoSchema, data),
      {
        ...config,
        params: {
          type: ZodExtended.parse(ControlTowerSearchModels.SearchItemTypeEnumSchema.optional(), type, {
            type: "query",
            name: "type",
          }),
          limit: ZodExtended.parse(z.number().gte(1).nullish(), limit, { type: "query", name: "limit" }),
        },
      },
    );
  };
}
