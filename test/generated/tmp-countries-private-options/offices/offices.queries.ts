import axios, {  } from "axios";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { OfficesAcl } from "./offices.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { OfficesModels } from "./offices.models";
import { OfficesApi } from "./offices.api";

export namespace OfficesQueries {
export const moduleName = QueryModule.Offices;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string) => [...keys.all, "/offices", "infinite", limit, order, filter, cursor] as const,
    findAllLabels: (search?: string) => [...keys.all, "/offices/labels", search] as const,
    paginateLabels: (limit?: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, cursor?: string) => [...keys.all, "/offices/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    get: (id: string) => [...keys.all, "/offices/:id", id] as const,
};

const paginateQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, filter, page, cursor),
  queryFn: () => OfficesApi.paginate(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate offices
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof OfficesApi.paginate, TData>) => {
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, filter, page, cursor }),
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => OfficesApi.paginate(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate offices
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<OfficesModels.OfficesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof OfficesApi.paginate, TData>) => {

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }),
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create new office
 * @permission Requires `canUseCreate` ability 
 * @param { OfficesModels.CreateOfficeRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof OfficesApi.create, { data: OfficesModels.CreateOfficeRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(OfficesAcl.canUseCreate());
      return OfficesApi.create(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const findAllLabelsQueryOptions = ({ search }: { search?: string }) => ({
  queryKey: keys.findAllLabels(search),
  queryFn: () => OfficesApi.findAllLabels(search),
});

/** 
 * Query `useFindAllLabels`
 * @summary List all offices with only their labels
 * @param { string } search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.FindAllLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllLabels = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof OfficesApi.findAllLabels, TData>) => {
  
  return useQuery({
    ...findAllLabelsQueryOptions({ search }),
    ...options,
  });
};

export const prefetchFindAllLabels = (queryClient: QueryClient, { search }: { search?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...findAllLabelsQueryOptions({ search }), ...options });
};

const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => OfficesApi.paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate offices with only their labels
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof OfficesApi.paginateLabels, TData>) => {
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => OfficesApi.paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate offices with only their labels
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeLabelFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<OfficesModels.OfficesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof OfficesApi.paginateLabels, TData>) => {

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const getQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.get(id),
  queryFn: () => OfficesApi.get(id),
});

/** 
 * Query `useGet`
 * @summary Get office by id
 * @permission Requires `canUseGet` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficeDetailResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof OfficesApi.get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(OfficesAcl.canUseGet());
      return getQueryOptions({ id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGet = (queryClient: QueryClient, { id }: { id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getQueryOptions({ id }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update office
 * @permission Requires `canUseUpdate` ability 
 * @param { string } id Path parameter
 * @param { OfficesModels.UpdateOfficeRequest } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof OfficesApi.update, { id: string, data: OfficesModels.UpdateOfficeRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(OfficesAcl.canUseUpdate());
      return OfficesApi.update(id, data)
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
 * Mutation `useUploadDocumentImage`
 * @summary Upload document image for an office
 * @permission Requires `canUseUploadDocumentImage` ability 
 * @param { string } officeId Path parameter
 * @param { OfficesModels.UploadOfficeDocumentRequestDto } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.DocumentImageUploadInstructionsDto> } 
 * @statusCodes [201, 401]
 */
export const useUploadDocumentImage = (options?: AppMutationOptions<typeof OfficesApi.uploadDocumentImage, { officeId: string, data: OfficesModels.UploadOfficeDocumentRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(OfficesAcl.canUseUploadDocumentImage({ officeId } ));
      const uploadInstructions = await OfficesApi.uploadDocumentImage(officeId, data);
      
      if (file && uploadInstructions.url) {
        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";
        let dataToSend: File | FormData = file;
        if (method === "post") {
          dataToSend = new FormData();
          if (uploadInstructions.fields) {
            for (const [key, value] of uploadInstructions.fields) {
              dataToSend.append(key, value);
            }
          }
          dataToSend.append("file", file);
        }
        await axios[method](uploadInstructions.url, dataToSend, {
          headers: {
            "Content-Type": file.type,
          },
          signal: abortController?.signal,
          onUploadProgress: onUploadProgress
          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })
          : undefined,
        });
      }
      
      return uploadInstructions;
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
 * Mutation `useCreateBankAccount`
 * @summary Create office bank account
 * @permission Requires `canUseCreateBankAccount` ability 
 * @param { string } officeId Path parameter
 * @param { OfficesModels.CreateOfficeBankAccountDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeBankAccountResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateBankAccount = (options?: AppMutationOptions<typeof OfficesApi.createBankAccount, { officeId: string, data: OfficesModels.CreateOfficeBankAccountDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(OfficesAcl.canUseCreateBankAccount({ officeId } ));
      return OfficesApi.createBankAccount(officeId, data)
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
 * Mutation `useUpdateBankAccount`
 * @summary Update office bank account
 * @permission Requires `canUseUpdateBankAccount` ability 
 * @param { string } accountId Path parameter
 * @param { string } officeId Path parameter
 * @param { OfficesModels.UpdateOfficeBankAccountDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeBankAccountResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBankAccount = (options?: AppMutationOptions<typeof OfficesApi.updateBankAccount, { accountId: string, officeId: string, data: OfficesModels.UpdateOfficeBankAccountDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ accountId, officeId, data }) => { 
      checkAcl(OfficesAcl.canUseUpdateBankAccount({ officeId } ));
      return OfficesApi.updateBankAccount(accountId, officeId, data)
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
 * Mutation `useDeleteBankAccount`
 * @summary Delete office bank account
 * @permission Requires `canUseDeleteBankAccount` ability 
 * @param { string } accountId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteBankAccount = (options?: AppMutationOptions<typeof OfficesApi.deleteBankAccount, { accountId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ accountId, officeId }) => { 
      checkAcl(OfficesAcl.canUseDeleteBankAccount({ officeId } ));
      return OfficesApi.deleteBankAccount(accountId, officeId)
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
 * Mutation `useUploadBankAccountFooter`
 * @summary Upload office bank account footer
 * @permission Requires `canUseUploadBankAccountFooter` ability 
 * @param { string } accountId Path parameter
 * @param { string } officeId Path parameter
 * @param { OfficesModels.UploadOfficeBankAccountFooterRequestDto } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.DocumentImageUploadInstructionsDto> } 
 * @statusCodes [201, 401]
 */
export const useUploadBankAccountFooter = (options?: AppMutationOptions<typeof OfficesApi.uploadBankAccountFooter, { accountId: string, officeId: string, data: OfficesModels.UploadOfficeBankAccountFooterRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Offices>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ accountId, officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(OfficesAcl.canUseUploadBankAccountFooter({ officeId } ));
      const uploadInstructions = await OfficesApi.uploadBankAccountFooter(accountId, officeId, data);
      
      if (file && uploadInstructions.url) {
        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";
        let dataToSend: File | FormData = file;
        if (method === "post") {
          dataToSend = new FormData();
          if (uploadInstructions.fields) {
            for (const [key, value] of uploadInstructions.fields) {
              dataToSend.append(key, value);
            }
          }
          dataToSend.append("file", file);
        }
        await axios[method](uploadInstructions.url, dataToSend, {
          headers: {
            "Content-Type": file.type,
          },
          signal: abortController?.signal,
          onUploadProgress: onUploadProgress
          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })
          : undefined,
        });
      }
      
      return uploadInstructions;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
