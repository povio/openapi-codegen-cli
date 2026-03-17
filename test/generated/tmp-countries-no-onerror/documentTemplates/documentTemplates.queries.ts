import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DocumentTemplatesAcl } from "./documentTemplates.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DocumentTemplatesModels } from "./documentTemplates.models";
import { DocumentTemplatesApi } from "./documentTemplates.api";

export namespace DocumentTemplatesQueries {
export const moduleName = QueryModule.DocumentTemplates;

export const keys = {
    all: [moduleName] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/document-templates/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/document-templates/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    list: (officeId: string, limit?: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/document-templates", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (officeId: string, limit?: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/document-templates", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (documentTemplateId: string, officeId: string) => [...keys.all, "/offices/:officeId/document-templates/:documentTemplateId", documentTemplateId, officeId] as const,
};

export const paginateLabelsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
  queryFn: () => DocumentTemplatesApi.paginateLabels(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate document template labels for office
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplatesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DocumentTemplatesAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const paginateLabelsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DocumentTemplatesApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate document template labels for office
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DocumentTemplatesModels.DocumentTemplatesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DocumentTemplatesApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DocumentTemplatesAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

export const listQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(officeId, limit, order, filter, page, cursor),
  queryFn: () => DocumentTemplatesApi.list(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List document templates
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplatesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DocumentTemplatesAcl.canUseList({ officeId } ));
      return listQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DocumentTemplatesApi.list(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List document templates
 * @permission Requires `canUseList` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DocumentTemplatesModels.DocumentTemplatesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DocumentTemplatesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DocumentTemplatesAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create a new document template
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { DocumentTemplatesModels.CreateDocumentTemplateRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [201, 401, 409]
 */
export const useCreate = (options?: AppMutationOptions<typeof DocumentTemplatesApi.create, { officeId: string, data: DocumentTemplatesModels.CreateDocumentTemplateRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(DocumentTemplatesAcl.canUseCreate({ officeId } ));
      return DocumentTemplatesApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const findByIdQueryOptions = ({ documentTemplateId, officeId }: { documentTemplateId: string, officeId: string }) => ({
  queryKey: keys.findById(documentTemplateId, officeId),
  queryFn: () => DocumentTemplatesApi.findById(documentTemplateId, officeId),
});

/** 
 * Query `useFindById`
 * @summary Get document template by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ documentTemplateId, officeId }: { documentTemplateId: string, officeId: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ documentTemplateId, officeId }),
    queryFn: async () => {
    checkAcl(DocumentTemplatesAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ documentTemplateId, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { documentTemplateId, officeId }: { documentTemplateId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findByIdQueryOptions({ documentTemplateId, officeId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update document template by ID
 * @permission Requires `canUseUpdate` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } officeId Path parameter
 * @param { DocumentTemplatesModels.UpdateDocumentTemplateRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUpdate = (options?: AppMutationOptions<typeof DocumentTemplatesApi.update, { documentTemplateId: string, officeId: string, data: DocumentTemplatesModels.UpdateDocumentTemplateRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ documentTemplateId, officeId, data }) => { 
      checkAcl(DocumentTemplatesAcl.canUseUpdate({ officeId } ));
      return DocumentTemplatesApi.update(documentTemplateId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { documentTemplateId, officeId } = variables;
      const updateKeys = [keys.findById(documentTemplateId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useAddRemarkBlock`
 * @summary Add a remark block to a document template
 * @permission Requires `canUseAddRemarkBlock` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } officeId Path parameter
 * @param { DocumentTemplatesModels.CreateRemarkBlockRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useAddRemarkBlock = (options?: AppMutationOptions<typeof DocumentTemplatesApi.addRemarkBlock, { documentTemplateId: string, officeId: string, data: DocumentTemplatesModels.CreateRemarkBlockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ documentTemplateId, officeId, data }) => { 
      checkAcl(DocumentTemplatesAcl.canUseAddRemarkBlock({ officeId } ));
      return DocumentTemplatesApi.addRemarkBlock(documentTemplateId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { documentTemplateId, officeId } = variables;
      const updateKeys = [keys.findById(documentTemplateId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteRemarkBlock`
 * @summary Delete a remark block from a document template
 * @permission Requires `canUseDeleteRemarkBlock` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } remarkBlockId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useDeleteRemarkBlock = (options?: AppMutationOptions<typeof DocumentTemplatesApi.deleteRemarkBlock, { documentTemplateId: string, remarkBlockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ documentTemplateId, remarkBlockId, officeId }) => { 
      checkAcl(DocumentTemplatesAcl.canUseDeleteRemarkBlock({ officeId } ));
      return DocumentTemplatesApi.deleteRemarkBlock(documentTemplateId, remarkBlockId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { documentTemplateId, officeId } = variables;
      const updateKeys = [keys.findById(documentTemplateId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive document template
 * @permission Requires `canUseArchive` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useArchive = (options?: AppMutationOptions<typeof DocumentTemplatesApi.archive, { documentTemplateId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ documentTemplateId, officeId }) => { 
      checkAcl(DocumentTemplatesAcl.canUseArchive({ officeId } ));
      return DocumentTemplatesApi.archive(documentTemplateId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { documentTemplateId, officeId } = variables;
      const updateKeys = [keys.findById(documentTemplateId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive document template
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } documentTemplateId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof DocumentTemplatesApi.unarchive, { documentTemplateId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DocumentTemplates>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ documentTemplateId, officeId }) => { 
      checkAcl(DocumentTemplatesAcl.canUseUnarchive({ officeId } ));
      return DocumentTemplatesApi.unarchive(documentTemplateId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { documentTemplateId, officeId } = variables;
      const updateKeys = [keys.findById(documentTemplateId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
