import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ChecklistItemsModels } from "./checklistItems.models";

export namespace ChecklistItemsApi {
export const create = (officeId: string, data: ChecklistItemsModels.CreateChecklistItemRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items`,
        ZodExtended.parse(ChecklistItemsModels.CreateChecklistItemRequestDTOSchema, data),
        config
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemsPaginateResponseSchema },
        `/offices/${officeId}/checklist-items`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemsPaginateLabelsResponseSchema },
        `/offices/${officeId}/checklist-items/labels/paginate`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items/${id}`,
        config
    )
};
export const update = (id: string, officeId: string, data: ChecklistItemsModels.UpdateChecklistItemRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items/${id}`,
        ZodExtended.parse(ChecklistItemsModels.UpdateChecklistItemRequestDTOSchema, data),
        config
    )
};
export const archive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-items/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (id: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-items/${id}/unarchive`,
        undefined,
        config
    )
};
}
