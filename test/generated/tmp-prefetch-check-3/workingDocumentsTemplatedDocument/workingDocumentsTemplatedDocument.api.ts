import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { WorkingDocumentsTemplatedDocumentModels } from "./workingDocumentsTemplatedDocument.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsTemplatedDocumentApi {
export const create = (positionId: string, officeId: string, data: WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDtoSchema, data),
        
    )
};
export const getTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        
    )
};
export const updateTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDtoSchema, data),
        
    )
};
export const deleteTemplatedDocument = (positionId: string, templatedDocumentId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        
    )
};
export const previewTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/preview`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const issueTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/issue`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
export const generateDocumentEml = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/eml`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentRequestDtoSchema, data),
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
