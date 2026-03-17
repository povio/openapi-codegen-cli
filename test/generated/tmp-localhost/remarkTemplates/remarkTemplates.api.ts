import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { RemarkTemplatesModels } from "./remarkTemplates.models";

export namespace RemarkTemplatesApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplatesPaginateLabelsResponseSchema },
        `/offices/${officeId}/remark-templates/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(RemarkTemplatesModels.RemarkTemplatesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(RemarkTemplatesModels.RemarkTemplateLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const list = (officeId: string, limit: number, order?: string, filter?: RemarkTemplatesModels.RemarkTemplateFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplatesListResponseSchema },
        `/offices/${officeId}/remark-templates`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(RemarkTemplatesModels.RemarkTemplatesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(RemarkTemplatesModels.RemarkTemplateFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: RemarkTemplatesModels.CreateRemarkTemplateRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates`,
        ZodExtended.parse(RemarkTemplatesModels.CreateRemarkTemplateRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: RemarkTemplatesModels.UpdateRemarkTemplateRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}`,
        ZodExtended.parse(RemarkTemplatesModels.UpdateRemarkTemplateRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}/unarchive`,
        
    )
};
}
