import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { SeaQuotesModels } from "./seaQuotes.models";

export namespace SeaQuotesApi {
  export const get = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: SeaQuotesModels.SeaQuoteResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/sea-quote`,
      config,
    );
  };

  export const update = (
    officeId: string,
    quoteId: string,
    data: SeaQuotesModels.UpdateSeaQuoteRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: SeaQuotesModels.SeaQuoteResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/sea-quote`,
      ZodExtended.parse(SeaQuotesModels.UpdateSeaQuoteRequestDTOSchema, data),
      config,
    );
  };
}
