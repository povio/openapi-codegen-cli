import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CurrenciesAcl } from "./currencies.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CurrenciesModels } from "./currencies.models";
import { CurrenciesApi } from "./currencies.api";

export namespace CurrenciesQueries {
  export const moduleName = QueryModule.Currencies;

  export const keys = {
    all: [moduleName] as const,
    list: (
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/currencies", limit, order, filter, page, cursor] as const,
    listInfinite: (
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      cursor?: string,
    ) => [...keys.all, "/currencies", "infinite", limit, order, filter, cursor] as const,
    paginateCurrencyLabels: (
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/currencies/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateCurrencyLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      cursor?: string,
    ) => [...keys.all, "/currencies/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    getCurrencyById: (isoCode: string) => [...keys.all, "/currencies/:isoCode", isoCode] as const,
    paginateCurrencyLabelsByOffice: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      page?: number,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/currencies/labels/paginate",
        officeId,
        limit,
        order,
        filter,
        page,
        cursor,
      ] as const,
    paginateCurrencyLabelsByOfficeInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: CurrenciesModels.CurrencyPaginationFilterDto,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/currencies/labels/paginate",
        "infinite",
        officeId,
        limit,
        order,
        filter,
        cursor,
      ] as const,
  };

  /**
   * Query `useList`
   * @summary List Currencies
   * @permission Requires `canUseList` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CurrenciesModels.CurrenciesListResponse> }
   * @statusCodes [200, 401]
   */
  export const useList = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: CurrenciesModels.CurrencyPaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof CurrenciesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.list(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(CurrenciesAcl.canUseList());
        return CurrenciesApi.list(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListInfinite
   * @summary List Currencies
   * @permission Requires `canUseList` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<CurrenciesModels.CurrenciesListResponse> }
   * @statusCodes [200, 401]
   */
  export const useListInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: CurrenciesModels.CurrencyPaginationFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof CurrenciesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(CurrenciesAcl.canUseList());
        return CurrenciesApi.list(limit, order, filter, pageParam, cursor, config);
      },
      initialPageParam: 1,
      getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
        const pageParam = page ?? 1;
        return pageParam * limitParam < totalItems ? pageParam + 1 : null;
      },
      ...options,
    });
  };

  /**
   * Mutation `useCreateCurrency`
   * @summary Create Currency
   * @permission Requires `canUseCreateCurrency` ability
   * @param { CurrenciesModels.CreateCurrencyRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<CurrenciesModels.CurrencyResponseDto> }
   * @statusCodes [201, 401]
   */
  export const useCreateCurrency = (
    options?: AppMutationOptions<
      typeof CurrenciesApi.createCurrency,
      { data: CurrenciesModels.CreateCurrencyRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(CurrenciesAcl.canUseCreateCurrency());
        return CurrenciesApi.createCurrency(data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePaginateCurrencyLabels`
   * @summary Paginate Currency labels (id and name only)
   * @permission Requires `canUsePaginateCurrencyLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CurrenciesModels.PaginateCurrencyLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateCurrencyLabels = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: CurrenciesModels.CurrencyPaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof CurrenciesApi.paginateCurrencyLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateCurrencyLabels(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
        return CurrenciesApi.paginateCurrencyLabels(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateCurrencyLabelsInfinite
   * @summary Paginate Currency labels (id and name only)
   * @permission Requires `canUsePaginateCurrencyLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<CurrenciesModels.PaginateCurrencyLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateCurrencyLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: CurrenciesModels.CurrencyPaginationFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof CurrenciesApi.paginateCurrencyLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateCurrencyLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
        return CurrenciesApi.paginateCurrencyLabels(limit, order, filter, pageParam, cursor, config);
      },
      initialPageParam: 1,
      getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
        const pageParam = page ?? 1;
        return pageParam * limitParam < totalItems ? pageParam + 1 : null;
      },
      ...options,
    });
  };

  /**
   * Query `useGetCurrencyById`
   * @summary Get Currency by iso code
   * @permission Requires `canUseGetCurrencyById` ability
   * @param { string } object.isoCode Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CurrenciesModels.CurrencyResponseDto> }
   * @statusCodes [200, 401]
   */
  export const useGetCurrencyById = <TData>(
    { isoCode }: { isoCode: string },
    options?: AppQueryOptions<typeof CurrenciesApi.getCurrencyById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getCurrencyById(isoCode),
      queryFn: () => {
        checkAcl(CurrenciesAcl.canUseGetCurrencyById());
        return CurrenciesApi.getCurrencyById(isoCode, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdateCurrency`
   * @summary Update Currency
   * @permission Requires `canUseUpdateCurrency` ability
   * @param { string } mutation.isoCode Path parameter
   * @param { CurrenciesModels.UpdateCurrencyRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<CurrenciesModels.CurrencyResponseDto> }
   * @statusCodes [200, 401]
   */
  export const useUpdateCurrency = (
    options?: AppMutationOptions<
      typeof CurrenciesApi.updateCurrency,
      { isoCode: string; data: CurrenciesModels.UpdateCurrencyRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ isoCode, data }) => {
        checkAcl(CurrenciesAcl.canUseUpdateCurrency());
        return CurrenciesApi.updateCurrency(isoCode, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { isoCode } = variables;
        const updateKeys = [keys.getCurrencyById(isoCode)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePaginateCurrencyLabelsByOffice`
   * @summary Paginate office currency labels (id and name only)
   * @permission Requires `canUsePaginateCurrencyLabelsByOffice` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CurrenciesModels.PaginateCurrencyLabelsByOfficeResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateCurrencyLabelsByOffice = <TData>(
    {
      officeId,
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      officeId: string;
      limit: number;
      order?: string;
      filter?: CurrenciesModels.CurrencyPaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof CurrenciesApi.paginateCurrencyLabelsByOffice, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
        return CurrenciesApi.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateCurrencyLabelsByOfficeInfinite
   * @summary Paginate office currency labels (id and name only)
   * @permission Requires `canUsePaginateCurrencyLabelsByOffice` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
   * @param { CurrenciesModels.CurrencyPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<CurrenciesModels.PaginateCurrencyLabelsByOfficeResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateCurrencyLabelsByOfficeInfinite = <TData>(
    {
      officeId,
      limit,
      order,
      filter,
      cursor,
    }: {
      officeId: string;
      limit: number;
      order?: string;
      filter?: CurrenciesModels.CurrencyPaginationFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof CurrenciesApi.paginateCurrencyLabelsByOffice, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateCurrencyLabelsByOfficeInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
        return CurrenciesApi.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, pageParam, cursor, config);
      },
      initialPageParam: 1,
      getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
        const pageParam = page ?? 1;
        return pageParam * limitParam < totalItems ? pageParam + 1 : null;
      },
      ...options,
    });
  };
}
