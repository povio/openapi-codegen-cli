import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { RemarkTemplatesModels } from "./remarkTemplates.models";

export namespace RemarkTemplatesApi {
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplatesPaginateLabelsResponseSchema },
        `/offices/${officeId}/remark-templates/paginate/labels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(RemarkTemplatesModels.RemarkTemplatesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(RemarkTemplatesModels.RemarkTemplateLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const list = (officeId: string, limit: number, order?: string, filter?: RemarkTemplatesModels.RemarkTemplateFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplatesListResponseSchema },
        `/offices/${officeId}/remark-templates`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(RemarkTemplatesModels.RemarkTemplatesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(RemarkTemplatesModels.RemarkTemplateFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: RemarkTemplatesModels.CreateRemarkTemplateRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates`,
        ZodExtended.parse(RemarkTemplatesModels.CreateRemarkTemplateRequestDTOSchema, data),
        config
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: RemarkTemplatesModels.UpdateRemarkTemplateRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}`,
        ZodExtended.parse(RemarkTemplatesModels.UpdateRemarkTemplateRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema },
        `/offices/${officeId}/remark-templates/${id}/unarchive`,
        undefined,
        config
    )
};
}
