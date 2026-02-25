import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { AirPositionsModels } from "./airPositions.models";

export namespace AirPositionsApi {
  export const get = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: AirPositionsModels.AirPositionResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/air-position`,
      config,
    );
  };

  export const update = (
    officeId: string,
    positionId: string,
    data: AirPositionsModels.UpdateAirPositionRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: AirPositionsModels.AirPositionResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/air-position`,
      ZodExtended.parse(AirPositionsModels.UpdateAirPositionRequestDTOSchema, data),
      config,
    );
  };
}
