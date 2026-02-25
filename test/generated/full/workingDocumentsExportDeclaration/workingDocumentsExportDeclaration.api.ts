import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsExportDeclarationModels } from "./workingDocumentsExportDeclaration.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsExportDeclarationApi {
export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations`,
        undefined,
        config
    )
};
export const getExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        config
    )
};
export const updateExportDeclarationData = (officeId: string, positionId: string, exportDeclarationId: string, data: WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        ZodExtended.parse(WorkingDocumentsExportDeclarationModels.UpdateExportDeclarationDocumentRequestDTOSchema, data),
        config
    )
};
export const deleteExportDeclaration = (positionId: string, exportDeclarationId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}`,
        undefined,
        config
    )
};
export const previewExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/preview`,
        {
            ...config,
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateExportDeclaration = (officeId: string, positionId: string, exportDeclarationId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/export-declarations/${exportDeclarationId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        config
    )
};
}
