import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsCmrFormModels } from "./workingDocumentsCmrForm.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsCmrFormApi {
export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs`,
        undefined,
        config
    )
};
export const getCmrData = (positionId: string, cmrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        config
    )
};
export const updateCmrData = (positionId: string, cmrId: string, officeId: string, data: WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsCmrFormModels.CmrDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        ZodExtended.parse(WorkingDocumentsCmrFormModels.UpdateCmrDocumentRequestDTOSchema, data),
        config
    )
};
export const deleteCmr = (positionId: string, cmrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}`,
        undefined,
        config
    )
};
export const previewCmr = (positionId: string, cmrId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/preview`,
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
export const generateCmr = (positionId: string, cmrId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cmrs/${cmrId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        config
    )
};
}
