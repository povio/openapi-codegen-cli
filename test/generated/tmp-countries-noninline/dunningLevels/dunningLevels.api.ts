import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { DunningLevelsModels } from "./dunningLevels.models";

export namespace DunningLevelsApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelsPaginateLabelsResponseSchema },
        `/offices/${officeId}/dunning-levels/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningLevelsModels.DunningLevelLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const list = (officeId: string, limit: number, order?: string, filter?: DunningLevelsModels.DunningLevelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelsListResponseSchema },
        `/offices/${officeId}/dunning-levels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningLevelsModels.DunningLevelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningLevelsModels.DunningLevelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: DunningLevelsModels.CreateDunningLevelRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels`,
        ZodExtended.parse(DunningLevelsModels.CreateDunningLevelRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: DunningLevelsModels.UpdateDunningLevelRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}`,
        ZodExtended.parse(DunningLevelsModels.UpdateDunningLevelRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: DunningLevelsModels.DunningLevelResponseDTOSchema },
        `/offices/${officeId}/dunning-levels/${id}/unarchive`,
        
    )
};
}
