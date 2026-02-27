import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FoldersModels } from "./folders.models";
import { FoldersApi } from "./folders.api";

export namespace FoldersQueries {
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
 * @param { string } object.officeId Path parameter
 * @param { string } object.folderId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FoldersModels.FolderTreeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetTree = <TData>({ officeId, folderId }: { officeId: string, folderId: string }, options?: AppQueryOptions<typeof FoldersApi.getTree, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getTree(officeId, folderId),
    queryFn: () => 
    FoldersApi.getTree(officeId, folderId),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useGetContent`
 * @summary Get folder content
 * @param { string } object.officeId Path parameter
 * @param { string } object.folderId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { FoldersModels.GetContentOrderParam } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt. Example: `name`
 * @param { FoldersModels.FolderContentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetContent = <TData>({ officeId, folderId, limit, order, filter, page, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof FoldersApi.getContent, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getContent(officeId, folderId, limit, order, filter, page, cursor),
    queryFn: () => 
    FoldersApi.getContent(officeId, folderId, limit, order, filter, page, cursor),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useGetContentInfinite
 * @summary Get folder content
 * @param { string } object.officeId Path parameter
 * @param { string } object.folderId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { FoldersModels.GetContentOrderParam } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt. Example: `name`
 * @param { FoldersModels.FolderContentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetContentInfinite = <TData>({ officeId, folderId, limit, order, filter, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof FoldersApi.getContent, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    queryKey: keys.getContentInfinite(officeId, folderId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    FoldersApi.getContent(officeId, folderId, limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useRename`
 * @summary Rename folder
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.folderId Path parameter
 * @param { FoldersModels.RenameFolderRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useRename = (options?: AppMutationOptions<typeof FoldersApi.rename, { officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, folderId, data }) => 
      FoldersApi.rename(officeId, folderId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.folderId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteFolder = (options?: AppMutationOptions<typeof FoldersApi.deleteFolder, { officeId: string, folderId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, folderId }) => 
      FoldersApi.deleteFolder(officeId, folderId)
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
 * @param { string } mutation.officeId Path parameter
 * @param { FoldersModels.CreateFolderRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof FoldersApi.create, { officeId: string, data: FoldersModels.CreateFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FoldersApi.create(officeId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { FoldersModels.MoveFoldersRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMove = (options?: AppMutationOptions<typeof FoldersApi.move, { officeId: string, data: FoldersModels.MoveFoldersRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FoldersApi.move(officeId, data)
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
