import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ChecklistTemplatesModels } from "./checklistTemplates.models";

export namespace ChecklistTemplatesApi {
export const create = (officeId: string, data: ChecklistTemplatesModels.CreateChecklistTemplateRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates`,
        ZodExtended.parse(ChecklistTemplatesModels.CreateChecklistTemplateRequestDTOSchema, data),
        
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ChecklistTemplatesModels.ChecklistTemplateFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplatesPaginateResponseSchema },
        `/offices/${officeId}/checklist-templates`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistTemplatesModels.ChecklistTemplatesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistTemplatesModels.ChecklistTemplateFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: ChecklistTemplatesModels.ChecklistTemplateLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplatesPaginateLabelsResponseSchema },
        `/offices/${officeId}/checklist-templates/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistTemplatesModels.ChecklistTemplatesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistTemplatesModels.ChecklistTemplateLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTO, ) => {
    return AppRestClient.put(
        { resSchema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema },
        `/offices/${officeId}/checklist-templates/${id}`,
        ZodExtended.parse(ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-templates/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-templates/${id}/unarchive`,
        
    )
};
}
