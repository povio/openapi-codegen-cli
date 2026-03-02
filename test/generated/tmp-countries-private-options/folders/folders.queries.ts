import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
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

const getTreeQueryOptions = ({ officeId, folderId }: { officeId: string, folderId: string }) => ({
  queryKey: keys.getTree(officeId, folderId),
  queryFn: () => FoldersApi.getTree(officeId, folderId),
});

/** 
 * Query `useGetTree`
 * @summary Get folder tree
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FoldersModels.FolderTreeResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetTree = <TData>({ officeId, folderId }: { officeId: string, folderId: string }, options?: AppQueryOptions<typeof FoldersApi.getTree, TData>) => {
  
  return useQuery({
    ...getTreeQueryOptions({ officeId, folderId }),
    ...options,
  });
};

export const prefetchGetTree = (queryClient: QueryClient, { officeId, folderId }: { officeId: string, folderId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getTreeQueryOptions({ officeId, folderId }), ...options });
};

const getContentQueryOptions = ({ officeId, folderId, limit, order, filter, page, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.getContent(officeId, folderId, limit, order, filter, page, cursor),
  queryFn: () => FoldersApi.getContent(officeId, folderId, limit, order, filter, page, cursor),
});

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
export const useGetContent = <TData>({ officeId, folderId, limit, order, filter, page, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof FoldersApi.getContent, TData>) => {
  
  return useQuery({
    ...getContentQueryOptions({ officeId, folderId, limit, order, filter, page, cursor }),
    ...options,
  });
};

export const prefetchGetContent = (queryClient: QueryClient, { officeId, folderId, limit, order, filter, page, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getContentQueryOptions({ officeId, folderId, limit, order, filter, page, cursor }), ...options });
};

const getContentInfiniteQueryOptions = ({ officeId, folderId, limit, order, filter, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string }) => ({
  queryKey: keys.getContentInfinite(officeId, folderId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => FoldersApi.getContent(officeId, folderId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const useGetContentInfinite = <TData>({ officeId, folderId, limit, order, filter, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof FoldersApi.getContent, TData>) => {

  return useInfiniteQuery({
    ...getContentInfiniteQueryOptions({ officeId, folderId, limit, order, filter, cursor }),
    ...options,
  });
};

export const prefetchGetContentInfinite = (queryClient: QueryClient, { officeId, folderId, limit, order, filter, cursor }: { officeId: string, folderId: string, limit: number, order?: FoldersModels.GetContentOrderParam, filter?: FoldersModels.FolderContentFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...getContentInfiniteQueryOptions({ officeId, folderId, limit, order, filter, cursor }), ...options });
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
export const useRename = (options?: AppMutationOptions<typeof FoldersApi.rename, { officeId: string, folderId: string, data: FoldersModels.RenameFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteFolder = (options?: AppMutationOptions<typeof FoldersApi.deleteFolder, { officeId: string, folderId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { FoldersModels.CreateFolderRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FoldersModels.FolderResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof FoldersApi.create, { officeId: string, data: FoldersModels.CreateFolderRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { FoldersModels.MoveFoldersRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMove = (options?: AppMutationOptions<typeof FoldersApi.move, { officeId: string, data: FoldersModels.MoveFoldersRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Folders>({ currentModule: moduleName });

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
