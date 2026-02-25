import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ProjectLiteModels } from "./projectLite.models";

export namespace ProjectLiteApi {
export const create = (officeId: string, data: ProjectLiteModels.CreateProjectLiteRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite`,
        ZodExtended.parse(ProjectLiteModels.CreateProjectLiteRequestDTOSchema, data),
        config
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.ProjectLitePaginateResponseSchema },
        `/offices/${officeId}/project-lite`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.ProjectLitePaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateProjectLabels = (officeId: string, limit: number, order?: string, filter?: ProjectLiteModels.ProjectLiteFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.PaginateProjectLabelsResponseSchema },
        `/offices/${officeId}/project-lite/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ProjectLiteModels.PaginateProjectLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ProjectLiteModels.ProjectLiteFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: ProjectLiteModels.UpdateProjectLiteRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: ProjectLiteModels.ProjectLiteResponseDTOSchema },
        `/offices/${officeId}/project-lite/${id}`,
        ZodExtended.parse(ProjectLiteModels.UpdateProjectLiteRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/project-lite/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/project-lite/${id}/unarchive`,
        undefined,
        config
    )
};
}
