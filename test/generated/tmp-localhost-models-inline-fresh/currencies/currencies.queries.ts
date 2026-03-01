import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CurrenciesAcl } from "./currencies.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CurrenciesModels } from "./currencies.models";

export namespace CurrenciesQueries {
const list = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CurrenciesModels.CurrenciesListResponseSchema },
    `/currencies`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.CurrenciesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const createCurrency = (data: CurrenciesModels.CreateCurrencyRequestDTO) => {
  return AppRestClient.post(
    { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
    `/currencies`,
    ZodExtended.parse(CurrenciesModels.CreateCurrencyRequestDTOSchema, data),
    
  );
};

const paginateCurrencyLabels = (limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CurrenciesModels.PaginateCurrencyLabelsResponseSchema },
    `/currencies/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const getCurrencyById = (isoCode: string) => {
  return AppRestClient.get(
    { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
    `/currencies/${isoCode}`,
    
  );
};

const updateCurrency = (isoCode: string, data: CurrenciesModels.UpdateCurrencyRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: CurrenciesModels.CurrencyResponseDtoSchema },
    `/currencies/${isoCode}`,
    ZodExtended.parse(CurrenciesModels.UpdateCurrencyRequestDTOSchema, data),
    
  );
};

const paginateCurrencyLabelsByOffice = (officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CurrenciesModels.PaginateCurrencyLabelsByOfficeResponseSchema },
    `/offices/${officeId}/currencies/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CurrenciesModels.PaginateCurrencyLabelsByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CurrenciesModels.CurrencyPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


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
export const useList = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CurrenciesAcl.canUseList());
    return list(limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const useListInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CurrenciesAcl.canUseList());
    return list(limit, order, filter, pageParam, cursor) },
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
 * @param { CurrenciesModels.CreateCurrencyRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CurrenciesModels.CurrencyResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateCurrency = (options?: AppMutationOptions<typeof createCurrency, { data: CurrenciesModels.CreateCurrencyRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => { 
      checkAcl(CurrenciesAcl.canUseCreateCurrency());
      return createCurrency(data)
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
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): isoCode, name, createdAt, updatedAt, createdBy, updatedBy. Example: `isoCode`
 * @param { CurrenciesModels.CurrencyPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.PaginateCurrencyLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCurrencyLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateCurrencyLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateCurrencyLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
    return paginateCurrencyLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateCurrencyLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateCurrencyLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateCurrencyLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabels());
    return paginateCurrencyLabels(limit, order, filter, pageParam, cursor) },
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
 * @param { string } isoCode Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CurrenciesModels.CurrencyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetCurrencyById = <TData>({ isoCode }: { isoCode: string }, options?: AppQueryOptions<typeof getCurrencyById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCurrencyById(isoCode),
    queryFn: () => { 
    checkAcl(CurrenciesAcl.canUseGetCurrencyById());
    return getCurrencyById(isoCode) },
    ...options,
  });
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
export const useUpdateCurrency = (options?: AppMutationOptions<typeof updateCurrency, { isoCode: string, data: CurrenciesModels.UpdateCurrencyRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ isoCode, data }) => { 
      checkAcl(CurrenciesAcl.canUseUpdateCurrency());
      return updateCurrency(isoCode, data)
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
export const usePaginateCurrencyLabelsByOffice = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateCurrencyLabelsByOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
    return paginateCurrencyLabelsByOffice(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateCurrencyLabelsByOfficeInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: CurrenciesModels.CurrencyPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateCurrencyLabelsByOffice, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateCurrencyLabelsByOfficeInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice());
    return paginateCurrencyLabelsByOffice(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
