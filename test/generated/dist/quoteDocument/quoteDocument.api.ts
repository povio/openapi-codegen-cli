import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuoteDocumentModels } from "./quoteDocument.models";

export namespace QuoteDocumentApi {
  export const get = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: QuoteDocumentModels.QuoteDocumentResponseDtoSchema },
      `/offices/${officeId}/quotes/${quoteId}/document`,
      config,
    );
  };
  export const update = (
    officeId: string,
    quoteId: string,
    data: QuoteDocumentModels.UpdateQuoteDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: z.void() },
      `/offices/${officeId}/quotes/${quoteId}/document`,
      ZodExtended.parse(QuoteDocumentModels.UpdateQuoteDocumentRequestDtoSchema, data),
      config,
    );
  };
  export const getPreview = (
    officeId: string,
    quoteId: string,
    data: QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/quotes/${quoteId}/document/preview`,
      ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDtoSchema, data),
      {
        ...config,
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
  export const generate = (
    officeId: string,
    quoteId: string,
    data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/quotes/${quoteId}/document/generate`,
      ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentRequestDtoSchema, data),
      config,
    );
  };
  export const generateEml = (
    officeId: string,
    quoteId: string,
    data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/quotes/${quoteId}/document/eml`,
      ZodExtended.parse(QuoteDocumentModels.GenerateQuoteDocumentRequestDtoSchema, data),
      {
        ...config,
        headers: {
          Accept: "application/octet-stream",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
}
