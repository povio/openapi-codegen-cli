import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ProjectLiteModels } from "./projectLite.models";

export namespace ProjectLiteApi {
export const create = (officeId: string, data: ProjectLiteModels.CreateProjectLiteRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite`,
        ZodExtended.parse(ProjectLiteModels.CreateProjectLiteRequestDTOSchema, data),
        
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.ProjectLitePaginateResponseSchema },
        `/offices/${officeId}/project-lite`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.ProjectLitePaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateProjectLabels = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.PaginateProjectLabelsResponseSchema },
        `/offices/${officeId}/project-lite/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.PaginateProjectLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: ProjectLiteModels.UpdateProjectLiteRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite/${id}`,
        ZodExtended.parse(ProjectLiteModels.UpdateProjectLiteRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/project-lite/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/project-lite/${id}/unarchive`,
        
    )
};
}
