import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { VatRulesModels } from "./vatRules.models";

export namespace VatRulesApi {
export const paginateLabels = (limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: VatRulesModels.VatRulesPaginateLabelsResponseSchema },
        `/vat-rules/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(VatRulesModels.VatRulesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const list = (limit: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: VatRulesModels.VatRulesListResponseSchema },
        `/vat-rules`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(VatRulesModels.VatRulesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(VatRulesModels.VatRuleFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: VatRulesModels.CreateVatRuleRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
        `/vat-rules`,
        ZodExtended.parse(VatRulesModels.CreateVatRuleRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
        `/vat-rules/${id}`,
        
    )
};
export const update = (id: string, data: VatRulesModels.UpdateVatRuleRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
        `/vat-rules/${id}`,
        ZodExtended.parse(VatRulesModels.UpdateVatRuleRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
        `/vat-rules/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: VatRulesModels.VatRuleResponseDTOSchema },
        `/vat-rules/${id}/unarchive`,
        
    )
};
}
