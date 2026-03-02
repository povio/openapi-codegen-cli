import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
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
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(search, officeId),
    queryFn: () => { 
    checkAcl(BankAccountsAcl.canUseFindAll());
    return findAll(search, officeId) },
    ...options,
  });
};

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
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BankAccountsAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, page, cursor) },
    ...options,
  });
};

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
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BankAccountsAcl.canUsePaginateLabels());
    return paginateLabels(limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
