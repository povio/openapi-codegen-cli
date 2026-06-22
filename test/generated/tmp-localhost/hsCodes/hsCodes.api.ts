import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { HsCodesModels } from "./hsCodes.models";

export namespace HsCodesApi {
export const paginate = (limit: number, order?: string, filter?: HsCodesModels.HsCodePaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: HsCodesModels.HsCodesPaginateResponseSchema },
        `/hs-codes`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(HsCodesModels.HsCodesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(HsCodesModels.HsCodePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: HsCodesModels.CreateHsCodeRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
        `/hs-codes`,
        ZodExtended.parse(HsCodesModels.CreateHsCodeRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: HsCodesModels.HsCodeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: HsCodesModels.HsCodesPaginateLabelsResponseSchema },
        `/hs-codes/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(HsCodesModels.HsCodesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(HsCodesModels.HsCodeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
        `/hs-codes/${id}`,
        
    )
};
export const update = (id: string, data: HsCodesModels.UpdateHsCodeRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
        `/hs-codes/${id}`,
        ZodExtended.parse(HsCodesModels.UpdateHsCodeRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
        `/hs-codes/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: HsCodesModels.HsCodeResponseDTOSchema },
        `/hs-codes/${id}/unarchive`,
        
    )
};
}
