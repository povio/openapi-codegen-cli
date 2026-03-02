import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FoldersModels } from "./folders.models";

export namespace FoldersQueries {
const getTree = (officeId: string, folderId: string) => {
  return AppRestClient.get(
    { resSchema: FoldersModels.FolderTreeResponseDTOSchema },
    `/offices/${officeId}/folders/${folderId}/tree`,
    
  );
};

const getContent = (officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string) => {
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
  );
};

const rename = (officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: FoldersModels.FolderResponseDTOSchema },
    `/offices/${officeId}/folders/${folderId}`,
    ZodExtended.parse(FoldersModels.RenameFolderRequestDTOSchema, data),
    
  );
};

const deleteFolder = (officeId: string, folderId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/folders/${folderId}`,
    
  );
};

const create = (officeId: string, data: FoldersModels.CreateFolderRequestDTO) => {
  return AppRestClient.post(
    { resSchema: FoldersModels.FolderResponseDTOSchema },
    `/offices/${officeId}/folders`,
    ZodExtended.parse(FoldersModels.CreateFolderRequestDTOSchema, data),
    
  );
};

const move = (officeId: string, data: FoldersModels.MoveFoldersRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/folders/move`,
    ZodExtended.parse(FoldersModels.MoveFoldersRequestDTOSchema, data),
    
  );
};


export const moduleName = QueryModule.Folders;

export const keys = {
    all: [moduleName] as const,
    getTree: (officeId: string, folderId: string) => [...keys.all, "/offices/:officeId/folders/:folderId/tree", officeId, folderId] as const,
    getContent: (officeId: string, folderId: string, limit?: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/folders/:folderId", officeId, folderId, limit, order, filter, page, cursor] as const,
    getContentInfinite: (officeId: string, folderId: string, limit?: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/folders/:folderId", "infinite", officeId, folderId, limit, order, filter, cursor] as const,
};

/** 
 * Query `useGetTree`
 * @summary Get folder tree
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FoldersModels.FolderTreeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetTree = <TData>({ officeId, folderId }: { officeId: string, folderId: string }, options?: AppQueryOptions<typeof getTree, TData>) => {
  
  return useQuery({
    queryKey: keys.getTree(officeId, folderId),
    queryFn: () => 
    getTree(officeId, folderId),
    ...options,
  });
};

/** 
 * Query `useGetContent`
 * @summary Get folder content
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { FoldersModels.GetContentOrderParam } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt. Example: `name`
 * @param { FoldersModels.FolderContentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetContent = <TData>({ officeId, folderId, limit, order, filter, page, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof getContent, TData>) => {
  
  return useQuery({
    queryKey: keys.getContent(officeId, folderId, limit, order, filter, page, cursor),
    queryFn: () => 
    getContent(officeId, folderId, limit, order, filter, page, cursor),
    ...options,
  });
};

/** 
 * Infinite query `useGetContentInfinite
 * @summary Get folder content
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { FoldersModels.GetContentOrderParam } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt. Example: `name`
 * @param { FoldersModels.FolderContentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetContentInfinite = <TData>({ officeId, folderId, limit, order, filter, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof getContent, TData>) => {

  return useInfiniteQuery({
    queryKey: keys.getContentInfinite(officeId, folderId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    getContent(officeId, folderId, limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useRename`
 * @summary Rename folder
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { FoldersModels.RenameFolderRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useRename = (options?: AppMutationOptions<typeof rename, { officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, folderId, data }) => 
      rename(officeId, folderId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteFolder`
 * @summary Delete folder
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteFolder = (options?: AppMutationOptions<typeof deleteFolder, { officeId: string, folderId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, folderId }) => 
      deleteFolder(officeId, folderId)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create folder
 * @param { string } officeId Path parameter
 * @param { FoldersModels.CreateFolderRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: FoldersModels.CreateFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      create(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useMove`
 * @summary Move folders
 * @param { string } officeId Path parameter
 * @param { FoldersModels.MoveFoldersRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMove = (options?: AppMutationOptions<typeof move, { officeId: string, data: FoldersModels.MoveFoldersRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      move(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
