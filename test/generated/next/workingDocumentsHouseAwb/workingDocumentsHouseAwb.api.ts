import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsHouseAwbModels } from "./workingDocumentsHouseAwb.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseAwbApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/hawbs`,
        
    )
};
export const getHouseAwbData = (positionId: string, hawbId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
        
    )
};
export const updateHouseAwbData = (positionId: string, hawbId: string, officeId: string, data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
        ZodExtended.parse(WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTOSchema, data),
        
    )
};
export const deleteHouseAwb = (positionId: string, hawbId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
        
    )
};
export const previewHouseAwb = (positionId: string, hawbId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateHouseAwb = (positionId: string, hawbId: string, officeId: string, data: CommonModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/generate`,
        ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
