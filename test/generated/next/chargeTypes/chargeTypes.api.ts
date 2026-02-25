import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ChargeTypesModels } from "./chargeTypes.models";

export namespace ChargeTypesApi {
export const findAll = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypeLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypesFindAllResponseSchema },
        `/charge-types/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChargeTypesModels.ChargeTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (limit: number, order?: string, filter?: ChargeTypesModels.ChargeTypePaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypesPaginateResponseSchema },
        `/charge-types`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChargeTypesModels.ChargeTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChargeTypesModels.ChargeTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: ChargeTypesModels.CreateChargeTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types`,
        ZodExtended.parse(ChargeTypesModels.CreateChargeTypeRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}`,
        config
    )
};
export const update = (id: string, data: ChargeTypesModels.UpdateChargeTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}`,
        ZodExtended.parse(ChargeTypesModels.UpdateChargeTypeRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ChargeTypesModels.ChargeTypeResponseDTOSchema },
        `/charge-types/${id}/unarchive`,
        undefined,
        config
    )
};
}
