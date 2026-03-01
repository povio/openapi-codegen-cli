import axios, {  } from "axios";
import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { OfficesAcl } from "./offices.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { OfficesModels } from "./offices.models";

export namespace OfficesQueries {
const paginate = (limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: OfficesModels.OfficesPaginateResponseSchema },
    `/offices`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(OfficesModels.OfficesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(OfficesModels.OfficeFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (data: OfficesModels.CreateOfficeRequest) => {
  return AppRestClient.post(
    { resSchema: OfficesModels.OfficeResponseDtoSchema },
    `/offices`,
    ZodExtended.parse(OfficesModels.CreateOfficeRequestSchema, data),
    
  );
};

const findAllLabels = (search?: string) => {
  return AppRestClient.get(
    { resSchema: OfficesModels.FindAllLabelsResponseSchema },
    `/offices/labels`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
      },
    }
  );
};

const paginateLabels = (limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: OfficesModels.OfficesPaginateLabelsResponseSchema },
    `/offices/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(OfficesModels.OfficesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(OfficesModels.OfficeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const get = (id: string) => {
  return AppRestClient.get(
    { resSchema: OfficesModels.OfficeDetailResponseDtoSchema },
    `/offices/${id}`,
    
  );
};

const update = (id: string, data: OfficesModels.UpdateOfficeRequest) => {
  return AppRestClient.put(
    { resSchema: OfficesModels.OfficeResponseDtoSchema },
    `/offices/${id}`,
    ZodExtended.parse(OfficesModels.UpdateOfficeRequestSchema, data),
    
  );
};

const uploadDocumentImage = (officeId: string, data: OfficesModels.UploadOfficeDocumentRequestDto) => {
  return AppRestClient.post(
    { resSchema: OfficesModels.DocumentImageUploadInstructionsDtoSchema },
    `/offices/${officeId}/document-image`,
    ZodExtended.parse(OfficesModels.UploadOfficeDocumentRequestDtoSchema, data),
    
  );
};

const createBankAccount = (officeId: string, data: OfficesModels.CreateOfficeBankAccountDto) => {
  return AppRestClient.post(
    { resSchema: OfficesModels.OfficeBankAccountResponseDtoSchema },
    `/offices/${officeId}/bank-accounts`,
    ZodExtended.parse(OfficesModels.CreateOfficeBankAccountDtoSchema, data),
    
  );
};

const updateBankAccount = (accountId: string, officeId: string, data: OfficesModels.UpdateOfficeBankAccountDto) => {
  return AppRestClient.patch(
    { resSchema: OfficesModels.OfficeBankAccountResponseDtoSchema },
    `/offices/${officeId}/bank-accounts/${accountId}`,
    ZodExtended.parse(OfficesModels.UpdateOfficeBankAccountDtoSchema, data),
    
  );
};

const deleteBankAccount = (accountId: string, officeId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/bank-accounts/${accountId}`,
    
  );
};

const uploadBankAccountFooter = (accountId: string, officeId: string, data: OfficesModels.UploadOfficeBankAccountFooterRequestDto) => {
  return AppRestClient.post(
    { resSchema: OfficesModels.DocumentImageUploadInstructionsDtoSchema },
    `/offices/${officeId}/bank-accounts/${accountId}/footer`,
    ZodExtended.parse(OfficesModels.UploadOfficeBankAccountFooterRequestDtoSchema, data),
    
  );
};


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

/** 
 * Query `usePaginate`
 * @summary Paginate offices
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => 
    paginate(limit, order, filter, page, cursor),
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate offices
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<OfficesModels.OfficesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    paginate(limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create new office
 * @permission Requires `canUseCreate` ability 
 * @param { OfficesModels.CreateOfficeRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { data: OfficesModels.CreateOfficeRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(OfficesAcl.canUseCreate());
      return create(data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useFindAllLabels`
 * @summary List all offices with only their labels
 * @param { string } object.search Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.FindAllLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllLabels = <TData>({ search }: { search?: string }, options?: AppQueryOptions<typeof findAllLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findAllLabels(search),
    queryFn: () => 
    findAllLabels(search),
    ...options,
  });
};

/** 
 * Query `usePaginateLabels`
 * @summary Paginate offices with only their labels
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => 
    paginateLabels(limit, order, filter, page, cursor),
    ...options,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate offices with only their labels
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name. Example: `name`
 * @param { OfficesModels.OfficeLabelFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<OfficesModels.OfficesPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    paginateLabels(limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useGet`
 * @summary Get office by id
 * @permission Requires `canUseGet` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<OfficesModels.OfficeDetailResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => { 
    checkAcl(OfficesAcl.canUseGet());
    return get(id) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update office
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.id Path parameter
 * @param { OfficesModels.UpdateOfficeRequest } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { id: string, data: OfficesModels.UpdateOfficeRequest }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ id, data }) => { 
      checkAcl(OfficesAcl.canUseUpdate());
      return update(id, data)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { OfficesModels.UploadOfficeDocumentRequestDto } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.DocumentImageUploadInstructionsDto> } 
 * @statusCodes [201, 401]
 */
export const useUploadDocumentImage = (options?: AppMutationOptions<typeof uploadDocumentImage, { officeId: string, data: OfficesModels.UploadOfficeDocumentRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(OfficesAcl.canUseUploadDocumentImage({ officeId } ));
      const uploadInstructions = await uploadDocumentImage(officeId, data);
      
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
 * @param { string } mutation.officeId Path parameter
 * @param { OfficesModels.CreateOfficeBankAccountDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeBankAccountResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateBankAccount = (options?: AppMutationOptions<typeof createBankAccount, { officeId: string, data: OfficesModels.CreateOfficeBankAccountDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(OfficesAcl.canUseCreateBankAccount({ officeId } ));
      return createBankAccount(officeId, data)
    },
    ...options,
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
 * @param { string } mutation.accountId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { OfficesModels.UpdateOfficeBankAccountDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.OfficeBankAccountResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBankAccount = (options?: AppMutationOptions<typeof updateBankAccount, { accountId: string, officeId: string, data: OfficesModels.UpdateOfficeBankAccountDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ accountId, officeId, data }) => { 
      checkAcl(OfficesAcl.canUseUpdateBankAccount({ officeId } ));
      return updateBankAccount(accountId, officeId, data)
    },
    ...options,
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
 * @param { string } mutation.accountId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteBankAccount = (options?: AppMutationOptions<typeof deleteBankAccount, { accountId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ accountId, officeId }) => { 
      checkAcl(OfficesAcl.canUseDeleteBankAccount({ officeId } ));
      return deleteBankAccount(accountId, officeId)
    },
    ...options,
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
 * @param { string } mutation.accountId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { OfficesModels.UploadOfficeBankAccountFooterRequestDto } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<OfficesModels.DocumentImageUploadInstructionsDto> } 
 * @statusCodes [201, 401]
 */
export const useUploadBankAccountFooter = (options?: AppMutationOptions<typeof uploadBankAccountFooter, { accountId: string, officeId: string, data: OfficesModels.UploadOfficeBankAccountFooterRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ accountId, officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(OfficesAcl.canUseUploadBankAccountFooter({ officeId } ));
      const uploadInstructions = await uploadBankAccountFooter(accountId, officeId, data);
      
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
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
