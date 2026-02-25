import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { FactoringExportModels } from "./factoringExport.models";

export namespace FactoringExportApi {
  export const create = (
    officeId: string,
    data: FactoringExportModels.CreateFactoringExportRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
      `/offices/${officeId}/factoring-exports`,
      ZodExtended.parse(FactoringExportModels.CreateFactoringExportRequestDtoSchema, data),
      config,
    );
  };

  export const getBatch = (batchId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
      `/offices/${officeId}/factoring-exports/${batchId}`,
      config,
    );
  };
}
