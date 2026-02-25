import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsBlInstructionsModels } from "./workingDocumentsBlInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsBlInstructionsApi {
export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions`,
        undefined,
        config
    )
};
export const getBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        config
    )
};
export const updateBlInstructionsData = (positionId: string, blInstructionsId: string, officeId: string, data: WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        ZodExtended.parse(WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentRequestDTOSchema, data),
        config
    )
};
export const deleteBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}`,
        undefined,
        config
    )
};
export const previewBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/preview`,
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
export const generateBlInstructions = (positionId: string, blInstructionsId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        config
    )
};
export const generateDocumentEml = (positionId: string, blInstructionsId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${blInstructionsId}/eml`,
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
