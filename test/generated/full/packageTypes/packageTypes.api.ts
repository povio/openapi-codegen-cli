import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PackageTypesModels } from "./packageTypes.models";

export namespace PackageTypesApi {
export const paginate = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypesPaginateResponseSchema },
        `/package-types`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PackageTypesModels.PackageTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: PackageTypesModels.CreatePackageTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types`,
        ZodExtended.parse(PackageTypesModels.CreatePackageTypeRequestDTOSchema, data),
        config
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypesPaginateLabelsResponseSchema },
        `/package-types/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PackageTypesModels.PackageTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}`,
        config
    )
};
export const update = (id: string, data: PackageTypesModels.UpdatePackageTypeRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}`,
        ZodExtended.parse(PackageTypesModels.UpdatePackageTypeRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}/unarchive`,
        undefined,
        config
    )
};
}
