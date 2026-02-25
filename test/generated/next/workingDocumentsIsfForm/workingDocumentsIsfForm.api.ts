import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsIsfFormModels } from "./workingDocumentsIsfForm.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsIsfFormApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/isfs`,
        
    )
};
export const getIsfData = (positionId: string, isfId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
        
    )
};
export const updateIsfData = (positionId: string, isfId: string, officeId: string, data: WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsIsfFormModels.IsfDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
        ZodExtended.parse(WorkingDocumentsIsfFormModels.UpdateIsfDocumentRequestDTOSchema, data),
        
    )
};
export const deleteIsf = (positionId: string, isfId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/isfs/${isfId}`,
        
    )
};
export const previewIsf = (positionId: string, isfId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/isfs/${isfId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateIsf = (positionId: string, isfId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/isfs/${isfId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
