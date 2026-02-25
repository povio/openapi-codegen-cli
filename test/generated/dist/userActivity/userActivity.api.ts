import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { UserActivityModels } from "./userActivity.models";

export namespace UserActivityApi {
  export const get = (
    officeId: string,
    entityType: string,
    entityId: string,
    activeThresholdMinutes?: number,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: UserActivityModels.UserActivityResponseDtoSchema },
      `/offices/${officeId}/${entityType}/${entityId}/activity`,
      {
        ...config,
        params: {
          activeThresholdMinutes: ZodExtended.parse(
            z.number().gte(1).describe("Active threshold in minutes").nullish(),
            activeThresholdMinutes,
            { type: "query", name: "activeThresholdMinutes" },
          ),
        },
      },
    );
  };
}
