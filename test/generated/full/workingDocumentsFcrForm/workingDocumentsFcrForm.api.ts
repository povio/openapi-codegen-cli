import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsFcrFormModels } from "./workingDocumentsFcrForm.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsFcrFormApi {
export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs`,
        undefined,
        config
    )
};
export const getFcrData = (positionId: string, fcrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        config
    )
};
export const updateFcrData = (positionId: string, fcrId: string, officeId: string, data: WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsFcrFormModels.FcrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        ZodExtended.parse(WorkingDocumentsFcrFormModels.UpdateFcrDocumentRequestDTOSchema, data),
        config
    )
};
export const deleteFcr = (positionId: string, fcrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}`,
        undefined,
        config
    )
};
export const previewFcr = (positionId: string, fcrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/preview`,
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
export const generateFcr = (positionId: string, fcrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/fcrs/${fcrId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        config
    )
};
}
