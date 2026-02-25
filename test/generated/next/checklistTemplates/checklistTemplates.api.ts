import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ChecklistTemplatesModels } from "./checklistTemplates.models";

export namespace ChecklistTemplatesApi {
export const create = (officeId: string, data: ChecklistTemplatesModels.CreateChecklistTemplateRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates`,
        ZodExtended.parse(ChecklistTemplatesModels.CreateChecklistTemplateRequestDTOSchema, data),
        config
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ChecklistTemplatesModels.ChecklistTemplateFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplatesPaginateResponseSchema },
        `/offices/${officeId}/checklist-templates`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistTemplatesModels.ChecklistTemplatesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistTemplatesModels.ChecklistTemplateFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: ChecklistTemplatesModels.ChecklistTemplateLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplatesPaginateLabelsResponseSchema },
        `/offices/${officeId}/checklist-templates/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistTemplatesModels.ChecklistTemplatesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistTemplatesModels.ChecklistTemplateLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates/${id}`,
        ZodExtended.parse(ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-templates/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-templates/${id}/unarchive`,
        undefined,
        config
    )
};
}
