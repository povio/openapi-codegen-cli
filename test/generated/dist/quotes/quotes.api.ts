import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { QuotesModels } from "./quotes.models";
import { CommonModels } from "@/data/common/common.models";

export namespace QuotesApi {
  export const paginate = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: QuotesModels.QuoteFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: QuotesModels.QuotesPaginateResponseSchema }, `/offices/${officeId}/quotes`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(QuotesModels.QuotesPaginateOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(QuotesModels.QuoteFilterDtoSchema.optional(), filter, {
          type: "query",
          name: "filter",
        }),
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
    });
  };
  export const create = (officeId: string, data: QuotesModels.CreateQuoteRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
      `/offices/${officeId}/quotes`,
      ZodExtended.parse(QuotesModels.CreateQuoteRequestDTOSchema, data),
      config,
    );
  };
  export const listAvailablePartnersFor = (
    officeId: string,
    quoteId: string,
    search?: string,
    useCase?: CommonModels.PositionAvailablePartnersUseCase,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: QuotesModels.QuotesListAvailablePartnersForResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/available-partners`,
      {
        ...config,
        params: {
          search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
          useCase: ZodExtended.parse(CommonModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, {
            type: "query",
            name: "useCase",
          }),
        },
      },
    );
  };
  export const exportQuotes = (
    officeId: string,
    data: QuotesModels.QuoteExportRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/quotes/exports`,
      ZodExtended.parse(QuotesModels.QuoteExportRequestDtoSchema, data),
      {
        ...config,
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
  export const getById = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}`,
      config,
    );
  };
  export const update = (
    officeId: string,
    quoteId: string,
    data: QuotesModels.UpdateQuoteRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}`,
      ZodExtended.parse(QuotesModels.UpdateQuoteRequestDTOSchema, data),
      config,
    );
  };
  export const cancel = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/cancel`,
      undefined,
      config,
    );
  };
  export const duplicate = (
    officeId: string,
    quoteId: string,
    data: QuotesModels.DuplicateQuoteRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: QuotesModels.QuoteCoreResponseDTOSchema },
      `/offices/${officeId}/quotes/${quoteId}/duplicate`,
      ZodExtended.parse(QuotesModels.DuplicateQuoteRequestDtoSchema, data),
      config,
    );
  };
  export const getInvolvedParties = (officeId: string, quoteId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: QuotesModels.GetInvolvedPartiesResponseSchema },
      `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
      config,
    );
  };
  export const createInvolvedParty = (
    officeId: string,
    quoteId: string,
    data: CommonModels.CreateInvolvedPartyRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
      `/offices/${officeId}/quotes/${quoteId}/involved-parties`,
      ZodExtended.parse(CommonModels.CreateInvolvedPartyRequestDtoSchema, data),
      config,
    );
  };
  export const updateInvolvedParty = (
    officeId: string,
    quoteId: string,
    partyId: string,
    data: CommonModels.UpdateInvolvedPartyDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
      `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
      ZodExtended.parse(CommonModels.UpdateInvolvedPartyDtoSchema, data),
      config,
    );
  };
  export const deleteInvolvedParty = (
    officeId: string,
    quoteId: string,
    partyId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/quotes/${quoteId}/involved-parties/${partyId}`,
      undefined,
      config,
    );
  };
}
