import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { MasterDataModels } from "./masterData.models";

export namespace MasterDataApi {
export const findAll = (officeId: string, types: MasterDataModels.MasterDataFindAllTypesParam, search?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: MasterDataModels.MasterDataItemsResponseDTOSchema },
        `/offices/${officeId}/master-data/autocomplete`,
        {
            ...config,
            params: {
                types: ZodExtended.parse(MasterDataModels.MasterDataFindAllTypesParamSchema, types, { type: "query", name: "types" }),
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
            },
        }
    )
};
export const paginate = (officeId: string, types: MasterDataModels.MasterDataPaginateTypesParam, limit: number, search?: string, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: MasterDataModels.MasterDataPaginateResponseSchema },
        `/offices/${officeId}/master-data/labels/paginated`,
        {
            ...config,
            params: {
                types: ZodExtended.parse(MasterDataModels.MasterDataPaginateTypesParamSchema, types, { type: "query", name: "types" }),
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
