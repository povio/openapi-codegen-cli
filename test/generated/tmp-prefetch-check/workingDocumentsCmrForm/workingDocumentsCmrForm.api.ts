import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { WorkingDocumentsCmrFormModels } from "./workingDocumentsCmrForm.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsCmrFormApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs`,
        
    )
};
export const getCmrData = (positionId: string, cmrId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        
    )
};
export const updateCmrData = (positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        ZodExtended.parse(WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTOSchema, data),
        
    )
};
export const deleteCmr = (positionId: string, cmrId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        
    )
};
export const previewCmr = (positionId: string, cmrId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateCmr = (positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/generate`,
        ZodExtended.parse(WorkingDocumentsCmrFormModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
