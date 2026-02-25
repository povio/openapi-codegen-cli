import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsTemplatedDocumentModels } from "./workingDocumentsTemplatedDocument.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsTemplatedDocumentApi {
export const create = (positionId: string, officeId: string, data: WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.CreateTemplatedDocumentRequestDtoSchema, data),
        config
    )
};
export const getTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        config
    )
};
export const updateTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.UpdateTemplatedDocumentRequestDtoSchema, data),
        config
    )
};
export const deleteTemplatedDocument = (positionId: string, templatedDocumentId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}`,
        undefined,
        config
    )
};
export const previewTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/preview`,
        ZodExtended.parse(WorkingDocumentsTemplatedDocumentModels.GenerateWorkingDocumentPreviewRequestDtoSchema, data),
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
export const issueTemplatedDocument = (officeId: string, positionId: string, templatedDocumentId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/issue`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        config
    )
};
export const generateDocumentEml = (officeId: string, positionId: string, templatedDocumentId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/templated-documents/${templatedDocumentId}/eml`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        {
            ...config,
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
}
