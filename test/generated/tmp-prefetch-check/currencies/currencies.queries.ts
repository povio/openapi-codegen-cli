import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { CurrenciesAcl } from "./currencies.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CurrenciesModels } from "./currencies.models";
import { CurrenciesApi } from "./currencies.api";

export namespace CurrenciesQueries {
export const moduleName = QueryModule.Currencies;

export const keys = {
    all: [moduleName] as const,
    list: (limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/currencies", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string) => [...keys.all, "/currencies", "infinite", limit, order, filter, cursor] as const,
    paginateCurrencyLabels: (limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/currencies/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateCurrencyLabelsInfinite: (limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string) => [...keys.all, "/currencies/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    getCurrencyById: (isoCode: string) => [...keys.all, "/currencies/:isoCode", isoCode] as const,
    paginateCurrencyLabelsByOffice: (officeId: string, limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/currencies/labels/paginate", officeId, limit, order, filter, page, cursor] as const,
    paginateCurrencyLabelsByOfficeInfinite: (officeId: string, limit?: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/currencies/labels/paginate", "infinite", officeId, limit, order, filter, cursor] as const,
};

export const getListQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(limit, order, filter, page, cursor),
  queryFn: () => CurrenciesApi.list(limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List Currencies
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.CurrenciesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CurrenciesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getListQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CurrenciesAcl.canUseList());
      return getListQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getListQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const getListInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CurrenciesApi.list(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List Currencies
 * @permission Requires `canUseList` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CurrenciesModels.CurrenciesListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CurrenciesApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getListInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CurrenciesAcl.canUseList());
      return getListInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getListInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreateCurrency`
 * @summary Create Currency
 * @permission Requires `canUseCreateCurrency` ability 
 * @param { CurrenciesModels.CreateCurrencyRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CurrenciesModels.CurrencyResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateCurrency = (options?: AppMutationOptions<typeof CurrenciesApi.createCurrency, { data: CurrenciesModels.CreateCurrencyRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Currencies>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CurrenciesAcl.canUseCreateCurrency());
      return CurrenciesApi.createCurrency(data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getPaginateCurrencyLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateCurrencyLabels(limit, order, filter, page, cursor),
  queryFn: () => CurrenciesApi.paginateCurrencyLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateCurrencyLabels`
 * @summary Paginate Currency labels (id and name only)
 * @permission Requires `canUsePaginateCurrencyLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.PaginateCurrencyLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCurrencyLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CurrenciesApi.paginateCurrencyLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getPaginateCurrencyLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
      return getPaginateCurrencyLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateCurrencyLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getPaginateCurrencyLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const getPaginateCurrencyLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateCurrencyLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CurrenciesApi.paginateCurrencyLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateCurrencyLabelsInfinite
 * @summary Paginate Currency labels (id and name only)
 * @permission Requires `canUsePaginateCurrencyLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CurrenciesModels.PaginateCurrencyLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCurrencyLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CurrenciesApi.paginateCurrencyLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getPaginateCurrencyLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
      return getPaginateCurrencyLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateCurrencyLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getPaginateCurrencyLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

export const getGetCurrencyByIdQueryOptions = ({ isoCode }: { isoCode: string }) => ({
  queryKey: keys.getCurrencyById(isoCode),
  queryFn: () => CurrenciesApi.getCurrencyById(isoCode),
});

/** 
 * Query `useGetCurrencyById`
 * @summary Get Currency by iso code
 * @permission Requires `canUseGetCurrencyById` ability 
 * @param { string } isoCode Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.CurrencyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetCurrencyById = <TData>({ isoCode }: { isoCode: string }, options?: AppQueryOptions<typeof CurrenciesApi.getCurrencyById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getGetCurrencyByIdQueryOptions({ isoCode }),
    queryFn: async () => {
    checkAcl(CurrenciesAcl.canUseGetCurrencyById());
      return getGetCurrencyByIdQueryOptions({ isoCode }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCurrencyById = (queryClient: QueryClient, { isoCode }: { isoCode: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetCurrencyByIdQueryOptions({ isoCode }), ...options });
};

/** 
 * Mutation `useUpdateCurrency`
 * @summary Update Currency
 * @permission Requires `canUseUpdateCurrency` ability 
 * @param { string } isoCode Path parameter
 * @param { CurrenciesModels.UpdateCurrencyRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CurrenciesModels.CurrencyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCurrency = (options?: AppMutationOptions<typeof CurrenciesApi.updateCurrency, { isoCode: string, data: CurrenciesModels.UpdateCurrencyRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Currencies>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ isoCode, data }) => { 
      checkAcl(CurrenciesAcl.canUseUpdateCurrency());
      return CurrenciesApi.updateCurrency(isoCode, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { isoCode } = variables;
      const updateKeys = [keys.getCurrencyById(isoCode)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getPaginateCurrencyLabelsByOfficeQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor),
  queryFn: () => CurrenciesApi.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateCurrencyLabelsByOffice`
 * @summary Paginate office currency labels (id and name only)
 * @permission Requires `canUsePaginateCurrencyLabelsByOffice` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.PaginateCurrencyLabelsByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCurrencyLabelsByOffice = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CurrenciesApi.paginateCurrencyLabelsByOffice, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getPaginateCurrencyLabelsByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
      return getPaginateCurrencyLabelsByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateCurrencyLabelsByOffice = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getPaginateCurrencyLabelsByOfficeQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const getPaginateCurrencyLabelsByOfficeInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateCurrencyLabelsByOfficeInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CurrenciesApi.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateCurrencyLabelsByOfficeInfinite
 * @summary Paginate office currency labels (id and name only)
 * @permission Requires `canUsePaginateCurrencyLabelsByOffice` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CurrenciesModels.PaginateCurrencyLabelsByOfficeResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCurrencyLabelsByOfficeInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CurrenciesApi.paginateCurrencyLabelsByOffice, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getPaginateCurrencyLabelsByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
      return getPaginateCurrencyLabelsByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateCurrencyLabelsByOfficeInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getPaginateCurrencyLabelsByOfficeInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

}
