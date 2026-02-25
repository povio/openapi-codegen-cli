import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { FoldersModels } from "./folders.models";

export namespace FoldersApi {
export const getTree = (officeId: string, folderId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: FoldersModels.FolderTreeResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}/tree`,
        config
    )
};
export const getContent = (officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(FoldersModels.GetContentOrderParamSchema.optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(FoldersModels.FolderContentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const rename = (officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders/${folderId}`,
        ZodExtended.parse(FoldersModels.RenameFolderRequestDTOSchema, data),
        config
    )
};
export const deleteFolder = (officeId: string, folderId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/folders/${folderId}`,
        undefined,
        config
    )
};
export const create = (officeId: string, data: FoldersModels.CreateFolderRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: FoldersModels.FolderResponseDTOSchema },
        `/offices/${officeId}/folders`,
        ZodExtended.parse(FoldersModels.CreateFolderRequestDTOSchema, data),
        config
    )
};
export const move = (officeId: string, data: FoldersModels.MoveFoldersRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/folders/move`,
        ZodExtended.parse(FoldersModels.MoveFoldersRequestDTOSchema, data),
        config
    )
};
}
