import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BankAccountsModels } from "./bankAccounts.models";

export namespace BankAccountsApi {
  export const findAll = (search?: string, officeId?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: BankAccountsModels.BankAccountsFindAllResponseSchema },
      `/bank-accounts/labels`,
      {
        ...config,
        params: {
          search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
          officeId: ZodExtended.parse(z.string().nullish(), officeId, { type: "query", name: "officeId" }),
        },
      },
    );
  };
  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: BankAccountsModels.BankAccountFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: BankAccountsModels.BankAccountsPaginateLabelsResponseSchema },
      `/bank-accounts/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(BankAccountsModels.BankAccountsPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(BankAccountsModels.BankAccountFilterDtoSchema.optional(), filter, {
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
      },
    );
  };
}
