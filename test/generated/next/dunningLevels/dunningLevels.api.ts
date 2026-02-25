import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningLevelsModels } from "./dunningLevels.models";

export namespace DunningLevelsApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelsPaginateLabelsResponseSchema },
        `/offices/${officeId}/dunning-levels/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningLevelsModels.DunningLevelLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const list = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelsListResponseSchema },
        `/offices/${officeId}/dunning-levels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningLevelsModels.DunningLevelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: DunningLevelsModels.CreateDunningLevelRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels`,
        ZodExtended.parse(DunningLevelsModels.CreateDunningLevelRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: DunningLevelsModels.UpdateDunningLevelRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}`,
        ZodExtended.parse(DunningLevelsModels.UpdateDunningLevelRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}/unarchive`,
        undefined,
        config
    )
};
}
