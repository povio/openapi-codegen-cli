import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BankAccountsAcl } from "./bankAccounts.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { BankAccountsModels } from "./bankAccounts.models";

export namespace BankAccountsQueries {
const findAll = (search?: string, officeId?: string) => {
  return AppRestClient.get(
    { resSchema: BankAccountsModels.BankAccountsFindAllResponseSchema },
    `/bank-accounts/labels`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        officeId: ZodExtended.parse(z.string().nullish(), officeId, { type: "query", name: "officeId" }),
      },
    }
  );
};

const paginateLabels = (limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BankAccountsModels.BankAccountsPaginateLabelsResponseSchema },
    `/bank-accounts/labels/paginate`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BankAccountsModels.BankAccountsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BankAccountsModels.BankAccountFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


export const moduleName = QueryModule.BankAccounts;

export const keys = {
    all: [moduleName] as const,
    findAll: (search?: string, officeId?: string) => [...keys.all, "/bank-accounts/labels", search, officeId] as const,
    paginateLabels: (limit?: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string) => [...keys.all, "/bank-accounts/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (limit?: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, cursor?: string) => [...keys.all, "/bank-accounts/labels/paginate", "infinite", limit, order, filter, cursor] as const,
};

export const findAllQueryOptions = ({ search, officeId }: { search?: string, officeId?: string }) => ({
  queryKey: keys.findAll(search, officeId),
  queryFn: () => findAll(search, officeId),
});

/** 
 * Query `useFindAll`
 * @summary List all bank accounts with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } search Query parameter
 * @param { string } officeId Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BankAccountsModels.BankAccountsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ search, officeId }: { search?: string, officeId?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findAllQueryOptions({ search, officeId }),
    queryFn: async () => {
    checkAcl(BankAccountsAcl.canUseFindAll());
      return findAllQueryOptions({ search, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { search, officeId }: { search?: string, officeId?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findAllQueryOptions({ search, officeId }), ...options });
};

export const paginateLabelsQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
  queryFn: () => paginateLabels(limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @summary Paginate bank account labels (id and name only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, bankName, createdAt, updatedAt. Example: `name`
 * @param { BankAccountsModels.BankAccountFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BankAccountsModels.BankAccountsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(BankAccountsAcl.canUsePaginateLabels());
      return paginateLabelsQueryOptions({ limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const paginateLabelsInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => paginateLabels(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @summary Paginate bank account labels (id and name only)
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, bankName, createdAt, updatedAt. Example: `name`
 * @param { BankAccountsModels.BankAccountFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BankAccountsModels.BankAccountsPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(BankAccountsAcl.canUsePaginateLabels());
      return paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

}
