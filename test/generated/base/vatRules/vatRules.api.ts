import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { VatRulesModels } from "./vatRules.models";

export namespace VatRulesApi {
  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: VatRulesModels.VatRuleFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: VatRulesModels.VatRulesPaginateLabelsResponseSchema },
      `/vat-rules/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(VatRulesModels.VatRulesPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, {
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

  export const list = (
    limit: number,
    order?: string,
    filter?: VatRulesModels.VatRuleFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: VatRulesModels.VatRulesListResponseSchema }, `/vat-rules`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(VatRulesModels.VatRulesListOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, {
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

  export const create = (data: VatRulesModels.CreateVatRuleRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
      `/vat-rules`,
      ZodExtended.parse(VatRulesModels.CreateVatRuleRequestDTOSchema, data),
      config,
    );
  };

  export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get({ resSchema: VatRulesModels.VatRuleResponseDTOSchema }, `/vat-rules/${id}`, config);
  };

  export const update = (id: string, data: VatRulesModels.UpdateVatRuleRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
      { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
      `/vat-rules/${id}`,
      ZodExtended.parse(VatRulesModels.UpdateVatRuleRequestDTOSchema, data),
      config,
    );
  };

  export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
      `/vat-rules/${id}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
      `/vat-rules/${id}/unarchive`,
      undefined,
      config,
    );
  };
}
