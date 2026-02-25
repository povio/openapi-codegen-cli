import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { BankAccountsAcl } from "./bankAccounts.acl";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { BankAccountsModels } from "./bankAccounts.models";
import { BankAccountsApi } from "./bankAccounts.api";

export namespace BankAccountsQueries {
  export const moduleName = QueryModule.BankAccounts;

  export const keys = {
    all: [moduleName] as const,
    findAll: (search?: string, officeId?: string) => [...keys.all, "/bank-accounts/labels", search, officeId] as const,
    paginateLabels: (
      limit?: number,
      order?: string,
      filter?: BankAccountsModels.BankAccountFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/bank-accounts/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: BankAccountsModels.BankAccountFilterDto,
      cursor?: string,
    ) => [...keys.all, "/bank-accounts/labels/paginate", "infinite", limit, order, filter, cursor] as const,
  };

  /**
   * Query `useFindAll`
   * @summary List all bank accounts with only their labels
   * @permission Requires `canUseFindAll` ability
   * @param { string } object.search Query parameter
   * @param { string } object.officeId Query parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<BankAccountsModels.BankAccountsFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(
    { search, officeId }: { search?: string; officeId?: string },
    options?: AppQueryOptions<typeof BankAccountsApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findAll(search, officeId),
      queryFn: () => {
        checkAcl(BankAccountsAcl.canUseFindAll());
        return BankAccountsApi.findAll(search, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Query `usePaginateLabels`
   * @summary Paginate bank account labels (id and name only)
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, bankName, createdAt, updatedAt. Example: `name`
   * @param { BankAccountsModels.BankAccountFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<BankAccountsModels.BankAccountsPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabels = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: BankAccountsModels.BankAccountFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof BankAccountsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(BankAccountsAcl.canUsePaginateLabels());
        return BankAccountsApi.paginateLabels(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate bank account labels (id and name only)
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, bankName, createdAt, updatedAt. Example: `name`
   * @param { BankAccountsModels.BankAccountFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<BankAccountsModels.BankAccountsPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: BankAccountsModels.BankAccountFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof BankAccountsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(BankAccountsAcl.canUsePaginateLabels());
        return BankAccountsApi.paginateLabels(limit, order, filter, pageParam, cursor, config);
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
