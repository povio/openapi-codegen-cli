import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
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

/** 
 * Query `usePaginateLabels`
 * @summary Paginate document template labels for office
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplatesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DocumentTemplatesAcl.canUsePaginateLabels({ officeId } ));
    return DocumentTemplatesApi.paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate document template labels for office
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DocumentTemplatesModels.DocumentTemplatesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DocumentTemplatesApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DocumentTemplatesAcl.canUsePaginateLabels({ officeId } ));
    return DocumentTemplatesApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
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
 * Query `useList`
 * @summary List document templates
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplatesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(DocumentTemplatesAcl.canUseList({ officeId } ));
    return DocumentTemplatesApi.list(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List document templates
 * @permission Requires `canUseList` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { DocumentTemplatesModels.DocumentTemplateFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DocumentTemplatesModels.DocumentTemplatesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DocumentTemplatesModels.DocumentTemplateFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DocumentTemplatesApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(DocumentTemplatesAcl.canUseList({ officeId } ));
    return DocumentTemplatesApi.list(officeId, limit, order, filter, pageParam, cursor) },
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
 * Mutation `useCreate`
 * @summary Create a new document template
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { DocumentTemplatesModels.CreateDocumentTemplateRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [201, 401, 409]
 */
export const useCreate = (options?: AppMutationOptions<typeof DocumentTemplatesApi.create, { officeId: string, data: DocumentTemplatesModels.CreateDocumentTemplateRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useFindById`
 * @summary Get document template by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.documentTemplateId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ documentTemplateId, officeId }: { documentTemplateId: string, officeId: string }, options?: AppQueryOptions<typeof DocumentTemplatesApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(documentTemplateId, officeId),
    queryFn: () => { 
    checkAcl(DocumentTemplatesAcl.canUseFindById({ officeId } ));
    return DocumentTemplatesApi.findById(documentTemplateId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update document template by ID
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.documentTemplateId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { DocumentTemplatesModels.UpdateDocumentTemplateRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUpdate = (options?: AppMutationOptions<typeof DocumentTemplatesApi.update, { documentTemplateId: string, officeId: string, data: DocumentTemplatesModels.UpdateDocumentTemplateRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.documentTemplateId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { DocumentTemplatesModels.CreateRemarkBlockRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useAddRemarkBlock = (options?: AppMutationOptions<typeof DocumentTemplatesApi.addRemarkBlock, { documentTemplateId: string, officeId: string, data: DocumentTemplatesModels.CreateRemarkBlockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.documentTemplateId Path parameter
 * @param { string } mutation.remarkBlockId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useDeleteRemarkBlock = (options?: AppMutationOptions<typeof DocumentTemplatesApi.deleteRemarkBlock, { documentTemplateId: string, remarkBlockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.documentTemplateId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useArchive = (options?: AppMutationOptions<typeof DocumentTemplatesApi.archive, { documentTemplateId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.documentTemplateId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DocumentTemplatesModels.DocumentTemplateResponseDTO> } 
 * @statusCodes [200, 401, 404, 409]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof DocumentTemplatesApi.unarchive, { documentTemplateId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
