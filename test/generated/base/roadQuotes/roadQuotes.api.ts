import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { RoadQuotesModels } from "./roadQuotes.models";

export namespace RoadQuotesApi {
  export const get = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: RoadQuotesModels.RoadQuoteResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/road-quote`,
      config,
    );
  };

  export const update = (
    officeId: string,
    quoteId: string,
    data: RoadQuotesModels.UpdateRoadQuoteRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: RoadQuotesModels.RoadQuoteResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/road-quote`,
      ZodExtended.parse(RoadQuotesModels.UpdateRoadQuoteRequestDTOSchema, data),
      config,
    );
  };
}
