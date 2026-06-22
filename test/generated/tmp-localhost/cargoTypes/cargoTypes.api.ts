import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CargoTypesModels } from "./cargoTypes.models";

export namespace CargoTypesApi {
export const paginate = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypePaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypesPaginateResponseSchema },
        `/cargo-types`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CargoTypesModels.CargoTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: CargoTypesModels.CreateCargoTypeRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types`,
        ZodExtended.parse(CargoTypesModels.CreateCargoTypeRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: CargoTypesModels.CargoTypeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypesPaginateLabelsResponseSchema },
        `/cargo-types/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CargoTypesModels.CargoTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CargoTypesModels.CargoTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}`,
        
    )
};
export const update = (id: string, data: CargoTypesModels.UpdateCargoTypeRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}`,
        ZodExtended.parse(CargoTypesModels.UpdateCargoTypeRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: CargoTypesModels.CargoTypeResponseDTOSchema },
        `/cargo-types/${id}/unarchive`,
        
    )
};
}
