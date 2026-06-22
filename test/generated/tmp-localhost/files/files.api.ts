import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { FilesModels } from "./files.models";
import { CommonModels } from "@/data/common/common.models";

export namespace FilesApi {
export const createUpload = (officeId: string, folderId: string, data: FilesModels.CreateFileRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: FilesModels.FileUploadResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}/files`,
        ZodExtended.parse(FilesModels.CreateFileRequestDTOSchema, data),
        
    )
};
export const getEml = (officeId: string, data: FilesModels.GetFilesEmlRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/files/eml`,
        ZodExtended.parse(FilesModels.GetFilesEmlRequestDTOSchema, data),
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const rename = (officeId: string, fileId: string, data: FilesModels.RenameFileRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: FilesModels.FileResponseDTOSchema },
        `/offices/${officeId}/files/${fileId}`,
        ZodExtended.parse(FilesModels.RenameFileRequestDTOSchema, data),
        
    )
};
export const move = (officeId: string, data: FilesModels.MoveFilesRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/files/move`,
        ZodExtended.parse(FilesModels.MoveFilesRequestDTOSchema, data),
        
    )
};
export const copy = (officeId: string, data: FilesModels.MoveFilesRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/files/copy`,
        ZodExtended.parse(FilesModels.MoveFilesRequestDTOSchema, data),
        
    )
};
export const archive = (officeId: string, data: FilesModels.SetFilesArchivedRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/files/archive`,
        ZodExtended.parse(FilesModels.SetFilesArchivedRequestDTOSchema, data),
        
    )
};
export const unarchive = (officeId: string, data: FilesModels.SetFilesArchivedRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/files/unarchive`,
        ZodExtended.parse(FilesModels.SetFilesArchivedRequestDTOSchema, data),
        
    )
};
}
