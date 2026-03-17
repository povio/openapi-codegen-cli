import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { WorkingDocumentsMasterAwbModels } from "./workingDocumentsMasterAwb.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsMasterAwbApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/mawbs`,
        
    )
};
export const getMasterAwbData = (positionId: string, mawbId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
        
    )
};
export const updateMasterAwbData = (positionId: string, mawbId: string, officeId: string, data: WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
        ZodExtended.parse(WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTOSchema, data),
        
    )
};
export const deleteMasterAwb = (positionId: string, mawbId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
        
    )
};
export const previewMasterAwb = (positionId: string, mawbId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateMasterAwb = (positionId: string, mawbId: string, officeId: string, data: WorkingDocumentsMasterAwbModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/generate`,
        ZodExtended.parse(WorkingDocumentsMasterAwbModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
