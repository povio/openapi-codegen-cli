import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ChargeTypesModels } from "./chargeTypes.models";

export namespace ChargeTypesApi {
export const findAll = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypesFindAllResponseSchema },
        `/charge-types/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChargeTypesModels.ChargeTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypesPaginateResponseSchema },
        `/charge-types`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChargeTypesModels.ChargeTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: ChargeTypesModels.CreateChargeTypeRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types`,
        ZodExtended.parse(ChargeTypesModels.CreateChargeTypeRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}`,
        
    )
};
export const update = (id: string, data: ChargeTypesModels.UpdateChargeTypeRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}`,
        ZodExtended.parse(ChargeTypesModels.UpdateChargeTypeRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}/unarchive`,
        
    )
};
}
