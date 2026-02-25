import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { DunningPartnerOutstandingInvoicesAcl } from "./dunningPartnerOutstandingInvoices.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningPartnerOutstandingInvoicesModels } from "./dunningPartnerOutstandingInvoices.models";
import { DunningPartnerOutstandingInvoicesApi } from "./dunningPartnerOutstandingInvoices.api";

export namespace DunningPartnerOutstandingInvoicesQueries {
  export const moduleName = QueryModule.DunningPartnerOutstandingInvoices;

  export const keys = {
    all: [moduleName] as const,
    listPartnerOutstandingInvoiceSummaries: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto,
      page?: number,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/partner-outstanding-invoices",
        officeId,
        limit,
        order,
        filter,
        page,
        cursor,
      ] as const,
    listPartnerOutstandingInvoiceSummariesInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/partner-outstanding-invoices",
        "infinite",
        officeId,
        limit,
        order,
        filter,
        cursor,
      ] as const,
    listPartnerOutstandingInvoices: (
      partnerId: string,
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto,
      page?: number,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/partners/:partnerId/outstanding-invoices",
        partnerId,
        officeId,
        limit,
        order,
        filter,
        page,
        cursor,
      ] as const,
    listPartnerOutstandingInvoicesInfinite: (
      partnerId: string,
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/partners/:partnerId/outstanding-invoices",
        "infinite",
        partnerId,
        officeId,
        limit,
        order,
        filter,
        cursor,
      ] as const,
  };

  /**
   * Query `useListPartnerOutstandingInvoiceSummaries`
   * @summary List office outstanding invoice summaries per partner
   * @permission Requires `canUseListPartnerOutstandingInvoiceSummaries` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): outstandingAmount, daysOverdue, lastDunningDate, invoiceCount, partnerCountry, partnerName, dunningSystemName. Example: `outstandingAmount`
   * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesResponse> }
   * @statusCodes [200, 401]
   */
  export const useListPartnerOutstandingInvoiceSummaries = <TData>(
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
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<
      typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries,
      TData
    >,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.listPartnerOutstandingInvoiceSummaries(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoiceSummaries({ officeId }));
        return DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries(
          officeId,
          limit,
          order,
          filter,
          page,
          cursor,
          config,
        );
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListPartnerOutstandingInvoiceSummariesInfinite
   * @summary List office outstanding invoice summaries per partner
   * @permission Requires `canUseListPartnerOutstandingInvoiceSummaries` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): outstandingAmount, daysOverdue, lastDunningDate, invoiceCount, partnerCountry, partnerName, dunningSystemName. Example: `outstandingAmount`
   * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesResponse> }
   * @statusCodes [200, 401]
   */
  export const useListPartnerOutstandingInvoiceSummariesInfinite = <TData>(
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
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<
      typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries,
      TData
    >,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listPartnerOutstandingInvoiceSummariesInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoiceSummaries({ officeId }));
        return DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoiceSummaries(
          officeId,
          limit,
          order,
          filter,
          pageParam,
          cursor,
          config,
        );
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
   * Query `useListPartnerOutstandingInvoices`
   * @summary List outstanding invoices for a specific partner
   * @permission Requires `canUseListPartnerOutstandingInvoices` ability
   * @param { string } object.partnerId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): dueDate, invoiceDate, owedAmount. Example: `dueDate`
   * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesResponse> }
   * @statusCodes [200, 401]
   */
  export const useListPartnerOutstandingInvoices = <TData>(
    {
      partnerId,
      officeId,
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      partnerId: string;
      officeId: string;
      limit: number;
      order?: string;
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.listPartnerOutstandingInvoices(partnerId, officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoices({ officeId }));
        return DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices(
          partnerId,
          officeId,
          limit,
          order,
          filter,
          page,
          cursor,
          config,
        );
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListPartnerOutstandingInvoicesInfinite
   * @summary List outstanding invoices for a specific partner
   * @permission Requires `canUseListPartnerOutstandingInvoices` ability
   * @param { string } object.partnerId Path parameter
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): dueDate, invoiceDate, owedAmount. Example: `dueDate`
   * @param { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesResponse> }
   * @statusCodes [200, 401]
   */
  export const useListPartnerOutstandingInvoicesInfinite = <TData>(
    {
      partnerId,
      officeId,
      limit,
      order,
      filter,
      cursor,
    }: {
      partnerId: string;
      officeId: string;
      limit: number;
      order?: string;
      filter?: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<
      typeof DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices,
      TData
    >,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listPartnerOutstandingInvoicesInfinite(partnerId, officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoices({ officeId }));
        return DunningPartnerOutstandingInvoicesApi.listPartnerOutstandingInvoices(
          partnerId,
          officeId,
          limit,
          order,
          filter,
          pageParam,
          cursor,
          config,
        );
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
   * Mutation `useListRecommendedDunningLevels`
   * @summary List recommended dunning levels for a partner
   * @permission Requires `canUseListRecommendedDunningLevels` ability
   * @param { string } mutation.partnerId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningPartnerOutstandingInvoicesModels.ListRecommendedDunningLevelsResponse> }
   * @statusCodes [200, 401]
   */
  export const useListRecommendedDunningLevels = (
    options?: AppMutationOptions<
      typeof DunningPartnerOutstandingInvoicesApi.listRecommendedDunningLevels,
      {
        partnerId: string;
        officeId: string;
        data: DunningPartnerOutstandingInvoicesModels.RecommendedDunningLevelsRequestDto;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ partnerId, officeId, data }) => {
        checkAcl(DunningPartnerOutstandingInvoicesAcl.canUseListRecommendedDunningLevels({ officeId }));
        return DunningPartnerOutstandingInvoicesApi.listRecommendedDunningLevels(partnerId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
