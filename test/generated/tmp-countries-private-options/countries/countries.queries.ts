import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { CountriesAcl } from "./countries.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
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

const paginateQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(limit, order, filter, page, cursor),
  queryFn: () => CountriesApi.paginate(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate Countries
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.CountriesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CountriesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CountriesAcl.canUsePaginate());
      return paginateQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CountriesApi.paginate(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate Countries
 * @permission Requires `canUsePaginate` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CountriesModels.CountriesPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CountriesApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CountriesAcl.canUsePaginate());
      return paginateInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const paginateCountryLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateCountryLabels(limit, order, filter, page, cursor),
  queryFn: () => CountriesApi.paginateCountryLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateCountryLabels`
 * @summary Paginate country labels (id and name only)
 * @permission Requires `canUsePaginateCountryLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.PaginateCountryLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCountryLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof CountriesApi.paginateCountryLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateCountryLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(CountriesAcl.canUsePaginateCountryLabels());
      return paginateCountryLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateCountryLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateCountryLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

const paginateCountryLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateCountryLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => CountriesApi.paginateCountryLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateCountryLabelsInfinite
 * @summary Paginate country labels (id and name only)
 * @permission Requires `canUsePaginateCountryLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, isoCode2, isoCode3, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
 * @param { CountriesModels.CountryPaginationFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<CountriesModels.PaginateCountryLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateCountryLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof CountriesApi.paginateCountryLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateCountryLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(CountriesAcl.canUsePaginateCountryLabels());
      return paginateCountryLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateCountryLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateCountryLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

const getCountryByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.getCountryById(id),
  queryFn: () => CountriesApi.getCountryById(id),
});

/** 
 * Query `useGetCountryById`
 * @summary Get country by ID with complete details
 * @permission Requires `canUseGetCountryById` ability 
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CountriesModels.CountryResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCountryById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof CountriesApi.getCountryById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getCountryByIdQueryOptions({ id }),
    queryFn: async () => {
    checkAcl(CountriesAcl.canUseGetCountryById());
      return getCountryByIdQueryOptions({ id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCountryById = (queryClient: QueryClient, { id }: { id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getCountryByIdQueryOptions({ id }), ...options });
};

}
