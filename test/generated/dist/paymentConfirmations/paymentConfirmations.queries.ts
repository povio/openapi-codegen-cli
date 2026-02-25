import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PaymentConfirmationsAcl } from "./paymentConfirmations.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PaymentConfirmationsModels } from "./paymentConfirmations.models";
import { PaymentConfirmationsApi } from "./paymentConfirmations.api";

export namespace PaymentConfirmationsQueries {
  export const moduleName = QueryModule.PaymentConfirmations;

  export const keys = {
    all: [moduleName] as const,
    get: (
      officeId: string,
      filter?: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto,
      limit?: number,
      order?: string,
      page?: number,
      cursor?: string,
    ) =>
      [...keys.all, "/offices/:officeId/payment-confirmations", officeId, filter, limit, order, page, cursor] as const,
    getInfinite: (
      officeId: string,
      filter?: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto,
      limit?: number,
      order?: string,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/payment-confirmations",
        "infinite",
        officeId,
        filter,
        limit,
        order,
        cursor,
      ] as const,
  };

  /**
   * Query `useGet`
   * @summary Get payment confirmation items
   * @permission Requires `canUseGet` ability
   * @param { string } object.officeId Path parameter
   * @param { PaymentConfirmationsModels.PaymentConfirmationItemFilterDto } object.filter Query parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, invoiceNumber, amount. Example: `paymentDate`
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<PaymentConfirmationsModels.PaymentConfirmationsGetResponse> }
   * @statusCodes [200, 401]
   */
  export const useGet = <TData>(
    {
      officeId,
      filter,
      limit,
      order,
      page,
      cursor,
    }: {
      officeId: string;
      filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto;
      limit: number;
      order?: string;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof PaymentConfirmationsApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(officeId, filter, limit, order, page, cursor),
      queryFn: () => {
        checkAcl(PaymentConfirmationsAcl.canUseGet({ officeId }));
        return PaymentConfirmationsApi.get(officeId, filter, limit, order, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useGetInfinite
   * @summary Get payment confirmation items
   * @permission Requires `canUseGet` ability
   * @param { string } object.officeId Path parameter
   * @param { PaymentConfirmationsModels.PaymentConfirmationItemFilterDto } object.filter Query parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, invoiceNumber, amount. Example: `paymentDate`
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<PaymentConfirmationsModels.PaymentConfirmationsGetResponse> }
   * @statusCodes [200, 401]
   */
  export const useGetInfinite = <TData>(
    {
      officeId,
      filter,
      limit,
      order,
      cursor,
    }: {
      officeId: string;
      filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto;
      limit: number;
      order?: string;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof PaymentConfirmationsApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.getInfinite(officeId, filter, limit, order, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(PaymentConfirmationsAcl.canUseGet({ officeId }));
        return PaymentConfirmationsApi.get(officeId, filter, limit, order, pageParam, cursor, config);
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
   * Mutation `useGenerate` - recommended when file should not be cached
   * @summary Generate payment confirmation PDF
   * @permission Requires `canUseGenerate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 201, 401]
   */
  export const useGenerate = (
    options?: AppMutationOptions<
      typeof PaymentConfirmationsApi.generate,
      { officeId: string; data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, data }) => {
        checkAcl(PaymentConfirmationsAcl.canUseGenerate({ officeId }));
        return PaymentConfirmationsApi.generate(officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useGetEml` - recommended when file should not be cached
   * @summary Get payment confirmation as EML file with PDF attachment
   * @permission Requires `canUseGetEml` ability
   * @param { string } mutation.officeId Path parameter
   * @param { PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 201, 401]
   */
  export const useGetEml = (
    options?: AppMutationOptions<
      typeof PaymentConfirmationsApi.getEml,
      { officeId: string; data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, data }) => {
        checkAcl(PaymentConfirmationsAcl.canUseGetEml({ officeId }));
        return PaymentConfirmationsApi.getEml(officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
