import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CargoTypesModels } from "./cargoTypes.models";

export namespace CargoTypesApi {
export const paginate = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypesPaginateResponseSchema },
        `/cargo-types`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CargoTypesModels.CargoTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: CargoTypesModels.CreateCargoTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types`,
        ZodExtended.parse(CargoTypesModels.CreateCargoTypeRequestDTOSchema, data),
        config
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypesPaginateLabelsResponseSchema },
        `/cargo-types/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CargoTypesModels.CargoTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}`,
        config
    )
};
export const update = (id: string, data: CargoTypesModels.UpdateCargoTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}`,
        ZodExtended.parse(CargoTypesModels.UpdateCargoTypeRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}/unarchive`,
        undefined,
        config
    )
};
}
