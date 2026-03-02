import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { PositionChecklistModels } from "./positionChecklist.models";

export namespace PositionChecklistApi {
export const list = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionChecklistModels.PositionChecklistResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist`,
        
    )
};
export const applyTemplates = (officeId: string, positionId: string, data: PositionChecklistModels.ApplyTemplatesRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.ApplyTemplatesResponseSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/apply-templates`,
        ZodExtended.parse(PositionChecklistModels.ApplyTemplatesRequestDtoSchema, data),
        
    )
};
export const complete = (officeId: string, positionId: string, itemId: string, ) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/complete`,
        
    )
};
export const uncomplete = (officeId: string, positionId: string, itemId: string, ) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/uncomplete`,
        
    )
};
export const updateNotes = (officeId: string, positionId: string, itemId: string, data: PositionChecklistModels.UpdatePositionChecklistItemDto, ) => {
    return AppRestClient.patch(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}`,
        ZodExtended.parse(PositionChecklistModels.UpdatePositionChecklistItemDtoSchema, data),
        
    )
};
export const reorder = (officeId: string, positionId: string, data: PositionChecklistModels.ReorderPositionChecklistDto, ) => {
    return AppRestClient.put(
        { resSchema: PositionChecklistModels.PositionChecklistReorderResponseSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/reorder`,
        ZodExtended.parse(PositionChecklistModels.ReorderPositionChecklistDtoSchema, data),
        
    )
};
}
