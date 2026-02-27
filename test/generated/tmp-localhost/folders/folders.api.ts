import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { FoldersModels } from "./folders.models";

export namespace FoldersApi {
export const getTree = (officeId: string, folderId: string, ) => {
    return AppRestClient.get(
        { resSchema: FoldersModels.FolderTreeResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}/tree`,
        
    )
};
export const getContent = (officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}`,
        {
            params: {
                order: ZodExtended.parse(FoldersModels.GetContentOrderParamSchema.optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(FoldersModels.FolderContentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const rename = (officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}`,
        ZodExtended.parse(FoldersModels.RenameFolderRequestDTOSchema, data),
        
    )
};
export const deleteFolder = (officeId: string, folderId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/folders/${folderId}`,
        
    )
};
export const create = (officeId: string, data: FoldersModels.CreateFolderRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders`,
        ZodExtended.parse(FoldersModels.CreateFolderRequestDTOSchema, data),
        
    )
};
export const move = (officeId: string, data: FoldersModels.MoveFoldersRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/folders/move`,
        ZodExtended.parse(FoldersModels.MoveFoldersRequestDTOSchema, data),
        
    )
};
}
