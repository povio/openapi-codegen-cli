import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CountriesAcl } from "./countries.acl";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { CountriesModels } from "./countries.models";
import { CountriesApi } from "./countries.api";

export namespace CountriesQueries {
export const moduleName = QueryModule.Countries;

export const keys = {
    all: [moduleName] as const,
    paginate: (limit?: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/countries/paginate", limit, order, filter, page, cursor] as const,
    paginateInfinite: (limit?: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string) => [...keys.all, "/countries/paginate", "infinite", limit, order, filter, cursor] as const,
    paginateCountryLabels: (limit?: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string) => [...keys.all, "/countries/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateCountryLabelsInfinite: (limit?: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string) => [...keys.all, "/countries/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    getCountryById: (id: string) => [...keys.all, "/countries/:id", id] as const,
};

/** 
 * Query `usePaginate`
 * @summary Paginate Countries
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.CountriesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CountriesApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUsePaginate());
    return CountriesApi.paginate(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Countries
 * @permission Requires `canUsePaginate` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CountriesModels.CountriesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CountriesApi.paginate, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CountriesAcl.canUsePaginate());
    return CountriesApi.paginate(limit, order, filter, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `usePaginateCountryLabels`
 * @summary Paginate country labels (id and name only)
 * @permission Requires `canUsePaginateCountryLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.PaginateCountryLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCountryLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CountriesApi.paginateCountryLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateCountryLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUsePaginateCountryLabels());
    return CountriesApi.paginateCountryLabels(limit, order, filter, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateCountryLabelsInfinite
 * @summary Paginate country labels (id and name only)
 * @permission Requires `canUsePaginateCountryLabels` ability 
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CountriesModels.PaginateCountryLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCountryLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CountriesApi.paginateCountryLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateCountryLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CountriesAcl.canUsePaginateCountryLabels());
    return CountriesApi.paginateCountryLabels(limit, order, filter, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useGetCountryById`
 * @summary Get country by ID with complete details
 * @permission Requires `canUseGetCountryById` ability 
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.CountryResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCountryById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof CountriesApi.getCountryById, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCountryById(id),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUseGetCountryById());
    return CountriesApi.getCountryById(id, config) },
    ...options,
  });
};

}
