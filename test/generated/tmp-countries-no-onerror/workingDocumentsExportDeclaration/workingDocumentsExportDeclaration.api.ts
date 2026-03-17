import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { WorkingDocumentsExportDeclarationModels } from "./workingDocumentsExportDeclaration.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsExportDeclarationApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations`,
        
    )
};
export const getExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        
    )
};
export const updateExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        ZodExtended.parse(WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTOSchema, data),
        
    )
};
export const deleteExportDeclaration = (positionId: string, exportDeclarationId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        
    )
};
export const previewExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/generate`,
        ZodExtended.parse(WorkingDocumentsExportDeclarationModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
