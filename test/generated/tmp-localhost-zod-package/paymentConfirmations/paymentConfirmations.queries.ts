import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PaymentConfirmationsAcl } from "./paymentConfirmations.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PaymentConfirmationsModels } from "./paymentConfirmations.models";

export namespace PaymentConfirmationsQueries {
const get = (officeId: string, filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit: number, order?: string, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PaymentConfirmationsModels.PaymentConfirmationsGetResponseSchema },
    `/offices/${officeId}/payment-confirmations`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PaymentConfirmationsModels.PaymentConfirmationsGetOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PaymentConfirmationsModels.PaymentConfirmationItemFilterDtoSchema, filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const generate = (officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/payment-confirmations/generate`,
    ZodExtended.parse(PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/pdf',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const getEml = (officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/payment-confirmations/eml`,
    ZodExtended.parse(PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.PaymentConfirmations;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, filter?: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit?: number, order?: string, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/payment-confirmations", officeId, filter, limit, order, page, cursor] as const,
    getInfinite: (officeId: string, filter?: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit?: number, order?: string, cursor?: string) => [...keys.all, "/offices/:officeId/payment-confirmations", "infinite", officeId, filter, limit, order, cursor] as const,
};

/** 
 * Query `useGet`
 * @summary Get payment confirmation items
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { PaymentConfirmationsModels.PaymentConfirmationItemFilterDto } filter Query parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, invoiceNumber, amount. Example: `paymentDate`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PaymentConfirmationsModels.PaymentConfirmationsGetResponse> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, filter, limit, order, page, cursor }: { officeId: string, filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit: number, order?: string, page?: number, cursor?: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, filter, limit, order, page, cursor),
    queryFn: () => { 
    checkAcl(PaymentConfirmationsAcl.canUseGet({ officeId } ));
    return get(officeId, filter, limit, order, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useGetInfinite
 * @summary Get payment confirmation items
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { PaymentConfirmationsModels.PaymentConfirmationItemFilterDto } filter Query parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): paymentDate, invoiceNumber, amount. Example: `paymentDate`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PaymentConfirmationsModels.PaymentConfirmationsGetResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetInfinite = <TData>({ officeId, filter, limit, order, cursor }: { officeId: string, filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit: number, order?: string, cursor?: string }, options?: AppInfiniteQueryOptions<typeof get, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.getInfinite(officeId, filter, limit, order, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PaymentConfirmationsAcl.canUseGet({ officeId } ));
    return get(officeId, filter, limit, order, pageParam, cursor) },
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
 * @param { string } officeId Path parameter
 * @param { PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof generate, { officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PaymentConfirmationsAcl.canUseGenerate({ officeId } ));
      return generate(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } officeId Path parameter
 * @param { PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGetEml = (options?: AppMutationOptions<typeof getEml, { officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PaymentConfirmationsAcl.canUseGetEml({ officeId } ));
      return getEml(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
