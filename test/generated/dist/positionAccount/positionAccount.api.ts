import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { PositionAccountModels } from "./positionAccount.models";

export namespace PositionAccountApi {
  export const get = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PositionAccountModels.PositionAccountResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/account`,
      config,
    );
  };
}
