import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { PositionChecklistModels } from "./positionChecklist.models";

export namespace PositionChecklistApi {
export const list = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PositionChecklistModels.PositionChecklistResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist`,
        config
    )
};
export const applyTemplates = (officeId: string, positionId: string, data: PositionChecklistModels.ApplyTemplatesRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.ApplyTemplatesResponseSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/apply-templates`,
        ZodExtended.parse(PositionChecklistModels.ApplyTemplatesRequestDtoSchema, data),
        config
    )
};
export const complete = (officeId: string, positionId: string, itemId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/complete`,
        undefined,
        config
    )
};
export const uncomplete = (officeId: string, positionId: string, itemId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}/uncomplete`,
        undefined,
        config
    )
};
export const updateNotes = (officeId: string, positionId: string, itemId: string, data: PositionChecklistModels.UpdatePositionChecklistItemDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: PositionChecklistModels.PositionChecklistItemResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/${itemId}`,
        ZodExtended.parse(PositionChecklistModels.UpdatePositionChecklistItemDtoSchema, data),
        config
    )
};
export const reorder = (officeId: string, positionId: string, data: PositionChecklistModels.ReorderPositionChecklistDto, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
        { resSchema: PositionChecklistModels.PositionChecklistReorderResponseSchema },
        `/offices/${officeId}/positions/${positionId}/checklist/reorder`,
        ZodExtended.parse(PositionChecklistModels.ReorderPositionChecklistDtoSchema, data),
        config
    )
};
}
