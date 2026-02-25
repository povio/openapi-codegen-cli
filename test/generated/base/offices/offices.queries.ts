import axios, { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { OfficesAcl } from "./offices.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { OfficesModels } from "./offices.models";
import { OfficesApi } from "./offices.api";

export namespace OfficesQueries {
  export const moduleName = QueryModule.Offices;

  export const keys = {
    all: [moduleName] as const,
    paginate: (
      limit?: number,
      order?: string,
      filter?: OfficesModels.OfficeFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/offices", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: OfficesModels.OfficeFilterDto, cursor?: string) =>
      [...keys.all, "/offices", "infinite", limit, order, filter, cursor] as const,
    findAllLabels: (search?: string) => [...keys.all, "/offices/labels", search] as const,
    paginateLabels: (
      limit?: number,
      order?: string,
      filter?: OfficesModels.OfficeLabelFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/offices/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: OfficesModels.OfficeLabelFilterDto,
      cursor?: string,
    ) => [...keys.all, "/offices/labels/paginate", "infinite", limit, order, filter, cursor] as const,
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
  export const usePaginate = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: { limit: number; order?: string; filter?: OfficesModels.OfficeFilterDto; page?: number; cursor?: string },
    options?: AppQueryOptions<typeof OfficesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.paginate(limit, order, filter, page, cursor),
      queryFn: () => OfficesApi.paginate(limit, order, filter, page, cursor, config),
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
  export const usePaginateInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: OfficesModels.OfficeFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof OfficesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useInfiniteQuery({
      queryKey: keys.paginateInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => OfficesApi.paginate(limit, order, filter, pageParam, cursor, config),
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
  export const useCreate = (
    options?: AppMutationOptions<typeof OfficesApi.create, { data: OfficesModels.CreateOfficeRequest }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(OfficesAcl.canUseCreate());
        return OfficesApi.create(data, config);
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
  export const useFindAllLabels = <TData>(
    { search }: { search?: string },
    options?: AppQueryOptions<typeof OfficesApi.findAllLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.findAllLabels(search),
      queryFn: () => OfficesApi.findAllLabels(search, config),
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
  export const usePaginateLabels = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: { limit: number; order?: string; filter?: OfficesModels.OfficeLabelFilterDto; page?: number; cursor?: string },
    options?: AppQueryOptions<typeof OfficesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
      queryFn: () => OfficesApi.paginateLabels(limit, order, filter, page, cursor, config),
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
  export const usePaginateLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: OfficesModels.OfficeLabelFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof OfficesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => OfficesApi.paginateLabels(limit, order, filter, pageParam, cursor, config),
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
  export const useGet = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof OfficesApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(id),
      queryFn: () => {
        checkAcl(OfficesAcl.canUseGet());
        return OfficesApi.get(id, config);
      },
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
  export const useUpdate = (
    options?: AppMutationOptions<typeof OfficesApi.update, { id: string; data: OfficesModels.UpdateOfficeRequest }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, data }) => {
        checkAcl(OfficesAcl.canUseUpdate());
        return OfficesApi.update(id, data, config);
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
  export const useUploadDocumentImage = (
    options?: AppMutationOptions<
      typeof OfficesApi.uploadDocumentImage,
      {
        officeId: string;
        data: OfficesModels.UploadOfficeDocumentRequestDto;
        file?: File;
        abortController?: AbortController;
        onUploadProgress?: (progress: { loaded: number; total: number }) => void;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: async ({ officeId, data, file, abortController, onUploadProgress }) => {
        checkAcl(OfficesAcl.canUseUploadDocumentImage({ officeId }));
        const uploadInstructions = await OfficesApi.uploadDocumentImage(officeId, data, config);

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
  export const useCreateBankAccount = (
    options?: AppMutationOptions<
      typeof OfficesApi.createBankAccount,
      { officeId: string; data: OfficesModels.CreateOfficeBankAccountDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, data }) => {
        checkAcl(OfficesAcl.canUseCreateBankAccount({ officeId }));
        return OfficesApi.createBankAccount(officeId, data, config);
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
  export const useUpdateBankAccount = (
    options?: AppMutationOptions<
      typeof OfficesApi.updateBankAccount,
      { accountId: string; officeId: string; data: OfficesModels.UpdateOfficeBankAccountDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ accountId, officeId, data }) => {
        checkAcl(OfficesAcl.canUseUpdateBankAccount({ officeId }));
        return OfficesApi.updateBankAccount(accountId, officeId, data, config);
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
  export const useDeleteBankAccount = (
    options?: AppMutationOptions<typeof OfficesApi.deleteBankAccount, { accountId: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ accountId, officeId }) => {
        checkAcl(OfficesAcl.canUseDeleteBankAccount({ officeId }));
        return OfficesApi.deleteBankAccount(accountId, officeId, config);
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
  export const useUploadBankAccountFooter = (
    options?: AppMutationOptions<
      typeof OfficesApi.uploadBankAccountFooter,
      {
        accountId: string;
        officeId: string;
        data: OfficesModels.UploadOfficeBankAccountFooterRequestDto;
        file?: File;
        abortController?: AbortController;
        onUploadProgress?: (progress: { loaded: number; total: number }) => void;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: async ({ accountId, officeId, data, file, abortController, onUploadProgress }) => {
        checkAcl(OfficesAcl.canUseUploadBankAccountFooter({ officeId }));
        const uploadInstructions = await OfficesApi.uploadBankAccountFooter(accountId, officeId, data, config);

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
