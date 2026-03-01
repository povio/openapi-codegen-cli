import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { CountriesAcl } from "./countries.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { CountriesModels } from "./countries.models";

export namespace CountriesQueries {
const paginate = (limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CountriesModels.CountriesPaginateResponseSchema },
    `/countries/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CountriesModels.CountriesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CountriesModels.CountryPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginateCountryLabels = (limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: CountriesModels.PaginateCountryLabelsResponseSchema },
    `/countries/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(CountriesModels.PaginateCountryLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(CountriesModels.CountryPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const getCountryById = (id: string) => {
  return AppRestClient.get(
    { resSchema: CountriesModels.CountryResponseDTOSchema },
    `/countries/${id}`,
    
  );
};


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
export const usePaginate = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUsePaginate());
    return paginate(limit, order, filter, page, cursor) },
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
export const usePaginateInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CountriesAcl.canUsePaginate());
    return paginate(limit, order, filter, pageParam, cursor) },
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
export const usePaginateCountryLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateCountryLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateCountryLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUsePaginateCountryLabels());
    return paginateCountryLabels(limit, order, filter, page, cursor) },
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
export const usePaginateCountryLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: CountriesModels.CountryPaginationFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateCountryLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateCountryLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(CountriesAcl.canUsePaginateCountryLabels());
    return paginateCountryLabels(limit, order, filter, pageParam, cursor) },
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
export const useGetCountryById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof getCountryById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCountryById(id),
    queryFn: () => { 
    checkAcl(CountriesAcl.canUseGetCountryById());
    return getCountryById(id) },
    ...options,
  });
};

}
