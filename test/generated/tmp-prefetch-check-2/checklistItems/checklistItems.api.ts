import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ChecklistItemsModels } from "./checklistItems.models";

export namespace ChecklistItemsApi {
export const create = (officeId: string, data: ChecklistItemsModels.CreateChecklistItemRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items`,
        ZodExtended.parse(ChecklistItemsModels.CreateChecklistItemRequestDTOSchema, data),
        
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemsPaginateResponseSchema },
        `/offices/${officeId}/checklist-items`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: ChecklistItemsModels.ChecklistItemLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemsPaginateLabelsResponseSchema },
        `/offices/${officeId}/checklist-items/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ChecklistItemsModels.ChecklistItemsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ChecklistItemsModels.ChecklistItemLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: ChecklistItemsModels.UpdateChecklistItemRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: ChecklistItemsModels.ChecklistItemResponseDTOSchema },
        `/offices/${officeId}/checklist-items/${id}`,
        ZodExtended.parse(ChecklistItemsModels.UpdateChecklistItemRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-items/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/checklist-items/${id}/unarchive`,
        
    )
};
}
