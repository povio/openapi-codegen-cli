import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningSystemsModels } from "./dunningSystems.models";

export namespace DunningSystemsApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: DunningSystemsModels.DunningSystemLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemsPaginateLabelsResponseSchema },
        `/offices/${officeId}/dunning-systems/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningSystemsModels.DunningSystemsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningSystemsModels.DunningSystemLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: DunningSystemsModels.DunningSystemFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemsPaginateResponseSchema },
        `/offices/${officeId}/dunning-systems`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningSystemsModels.DunningSystemsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningSystemsModels.DunningSystemFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: DunningSystemsModels.CreateDunningSystemRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems`,
        ZodExtended.parse(DunningSystemsModels.CreateDunningSystemRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: DunningSystemsModels.UpdateDunningSystemRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}`,
        ZodExtended.parse(DunningSystemsModels.UpdateDunningSystemRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningSystemsModels.DunningSystemResponseDTOSchema },
        `/offices/${officeId}/dunning-systems/${id}/unarchive`,
        undefined,
        config
    )
};
}
