import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { WorkingDocumentsBlInstructionsModels } from "./workingDocumentsBlInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsBlInstructionsApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions`,
        
    )
};
export const getBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        
    )
};
export const updateBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        ZodExtended.parse(WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTOSchema, data),
        
    )
};
export const deleteBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        
    )
};
export const previewBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/generate`,
        ZodExtended.parse(WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
export const generateDocumentEml = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/eml`,
        ZodExtended.parse(WorkingDocumentsBlInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
}
