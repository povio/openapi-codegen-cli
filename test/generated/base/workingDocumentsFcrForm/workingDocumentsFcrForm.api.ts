import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsFcrFormModels } from "./workingDocumentsFcrForm.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsFcrFormApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs`,
        
    )
};
export const getFcrData = (positionId: string, fcrId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        
    )
};
export const updateFcrData = (positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        ZodExtended.parse(WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTOSchema, data),
        
    )
};
export const deleteFcr = (positionId: string, fcrId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        
    )
};
export const previewFcr = (positionId: string, fcrId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateFcr = (positionId: string, fcrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
