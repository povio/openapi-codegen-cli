import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PackageTypesModels } from "./packageTypes.models";

export namespace PackageTypesApi {
export const paginate = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypePaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypesPaginateResponseSchema },
        `/package-types`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PackageTypesModels.PackageTypePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: PackageTypesModels.CreatePackageTypeRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types`,
        ZodExtended.parse(PackageTypesModels.CreatePackageTypeRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: PackageTypesModels.PackageTypeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypesPaginateLabelsResponseSchema },
        `/package-types/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PackageTypesModels.PackageTypesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PackageTypesModels.PackageTypeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}`,
        
    )
};
export const update = (id: string, data: PackageTypesModels.UpdatePackageTypeRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}`,
        ZodExtended.parse(PackageTypesModels.UpdatePackageTypeRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: PackageTypesModels.PackageTypeResponseDTOSchema },
        `/package-types/${id}/unarchive`,
        
    )
};
}
