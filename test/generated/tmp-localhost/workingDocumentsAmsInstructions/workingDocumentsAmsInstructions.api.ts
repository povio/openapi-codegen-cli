import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsAmsInstructionsModels } from "./workingDocumentsAmsInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsAmsInstructionsApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/ams-instructions`,
        
    )
};
export const getAMSInstructionsData = (positionId: string, amsInstructionsId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
        
    )
};
export const updateAMSInstructionsData = (positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
        ZodExtended.parse(WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTOSchema, data),
        
    )
};
export const deleteAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
        
    )
};
export const previewAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateAMSInstructions = (positionId: string, amsInstructionsId: string, officeId: string, data: WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/generate`,
        ZodExtended.parse(WorkingDocumentsAmsInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
