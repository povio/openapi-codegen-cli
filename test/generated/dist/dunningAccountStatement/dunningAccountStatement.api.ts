import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningAccountStatementModels } from "./dunningAccountStatement.models";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningAccountStatementApi {
  export const dataGenFake = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: DunningAccountStatementModels.AccountStatementPdfPayloadDTOSchema },
      `/data-gen-fake/account-statement`,
      config,
    );
  };
  export const generateAccountStatement = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: CommonModels.OfficeInvoiceFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: z.instanceof(Blob) }, `/offices/${officeId}/invoices/account-statement`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(DunningAccountStatementModels.GenerateAccountStatementOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(CommonModels.OfficeInvoiceFilterDtoSchema.optional(), filter, {
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
      headers: {
        Accept: "application/pdf",
      },
      responseType: "blob",
      rawResponse: true,
    });
  };
  export const getAccountStatementEml = (
    officeId: string,
    data: DunningAccountStatementModels.OfficeInvoiceListQueryDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/invoices/account-statement/eml`,
      ZodExtended.parse(DunningAccountStatementModels.OfficeInvoiceListQueryDtoSchema, data),
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
