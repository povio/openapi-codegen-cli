import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { InttraOfficeIntegrationModels } from "./inttraOfficeIntegration.models";

export namespace InttraOfficeIntegrationApi {
  export const get = (officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: InttraOfficeIntegrationModels.OfficeInttraCredentialsResponseDtoSchema },
      `/offices/${officeId}/inttra/credentials`,
      config,
    );
  };

  export const generate = (officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: InttraOfficeIntegrationModels.GenerateInttraCredentialsResponseDtoSchema },
      `/offices/${officeId}/inttra/credentials`,
      undefined,
      config,
    );
  };

  export const update = (
    officeId: string,
    data: InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: InttraOfficeIntegrationModels.UpdateInttraCredentialsResponseDtoSchema },
      `/offices/${officeId}/inttra/credentials`,
      ZodExtended.parse(InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDtoSchema, data),
      config,
    );
  };
}
