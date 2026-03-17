import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsHouseBlModels } from "./workingDocumentsHouseBl.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseBlApi {
export const create = (positionId: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/house-bls`,
        
    )
};
export const getHouseBlData = (positionId: string, houseBlId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
        
    )
};
export const updateHouseBlData = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
        ZodExtended.parse(WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTOSchema, data),
        
    )
};
export const deleteHouseBl = (positionId: string, houseBlId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
        
    )
};
export const previewHouseBl = (positionId: string, houseBlId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const previewHouseBlEml = (positionId: string, houseBlId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview/eml`,
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generateHouseBl = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/generate`,
        ZodExtended.parse(WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
export const generateDocumentEml = (positionId: string, houseBlId: string, officeId: string, data: WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/eml`,
        ZodExtended.parse(WorkingDocumentsHouseBlModels.GenerateWorkingDocumentRequestDtoSchema, data),
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
