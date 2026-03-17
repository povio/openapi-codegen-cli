import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningManagementAcl } from "./dunningManagement.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningManagementModels } from "./dunningManagement.models";

export namespace DunningManagementQueries {
const listDunnings = (officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: DunningManagementModels.ListDunningsResponseSchema },
    `/offices/${officeId}/dunnings`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(DunningManagementModels.ListDunningsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(DunningManagementModels.DunningFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const createDunningWithInvoices = (partnerId: string, officeId: string, data: DunningManagementModels.CreateDunningWithInvoicesRequestDTO) => {
  return AppRestClient.post(
    { resSchema: DunningManagementModels.DunningResponseDtoSchema },
    `/offices/${officeId}/partners/${partnerId}/dunnings`,
    ZodExtended.parse(DunningManagementModels.CreateDunningWithInvoicesRequestDTOSchema, data),
    
  );
};

const dataGenFake = () => {
  return AppRestClient.get(
    { resSchema: DunningManagementModels.DunningPdfPayloadDTOSchema },
    `/data-gen-fake`,
    
  );
};

const getDunningEml = (officeId: string, dunningId: string) => {
  return AppRestClient.get(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/dunnings/${dunningId}/eml`,
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};


export const moduleName = QueryModule.DunningManagement;

export const keys = {
    all: [moduleName] as const,
    listDunnings: (officeId: string, limit?: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/dunnings", officeId, limit, order, filter, page, cursor] as const,
    listDunningsInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/dunnings", "infinite", officeId, limit, order, filter, cursor] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake", ] as const,
    getDunningEml: (officeId: string, dunningId: string) => [...keys.all, "/offices/:officeId/dunnings/:dunningId/eml", officeId, dunningId] as const,
};

export const listDunningsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.listDunnings(officeId, limit, order, filter, page, cursor),
  queryFn: () => listDunnings(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useListDunnings`
 * @summary List dunnings for an office
 * @permission Requires `canUseListDunnings` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, level, outstandingAmount, statusChangedOn. Example: `createdAt`
 * @param { DunningManagementModels.DunningFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningManagementModels.ListDunningsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListDunnings = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listDunnings, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningManagementAcl.canUseListDunnings({ officeId } ));
      return listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListDunnings = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

export const listDunningsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }) => ({
  queryKey: keys.listDunningsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => listDunnings(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListDunningsInfinite
 * @summary List dunnings for an office
 * @permission Requires `canUseListDunnings` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, level, outstandingAmount, statusChangedOn. Example: `createdAt`
 * @param { DunningManagementModels.DunningFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<DunningManagementModels.ListDunningsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListDunningsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listDunnings, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningManagementAcl.canUseListDunnings({ officeId } ));
      return listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListDunningsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreateDunningWithInvoices`
 * @summary Create a dunning with outstanding invoices
 * @permission Requires `canUseCreateDunningWithInvoices` ability 
 * @param { string } partnerId Path parameter
 * @param { string } officeId Path parameter
 * @param { DunningManagementModels.CreateDunningWithInvoicesRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<DunningManagementModels.DunningResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateDunningWithInvoices = (options?: AppMutationOptions<typeof createDunningWithInvoices, { partnerId: string, officeId: string, data: DunningManagementModels.CreateDunningWithInvoicesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningManagement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ partnerId, officeId, data }) => { 
      checkAcl(DunningManagementAcl.canUseCreateDunningWithInvoices({ officeId } ));
      return createDunningWithInvoices(partnerId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const dataGenFakeQueryOptions = () => ({
  queryKey: keys.dataGenFake(),
  queryFn: () => dataGenFake(),
});

/** 
 * Query `useDataGenFake`
 * @summary Expose dunning PDF payload DTO for model generation
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningManagementModels.DunningPdfPayloadDTO> } 
 * @statusCodes [200, 401]
 */
export const useDataGenFake = <TData>(options?: AppQueryOptions<typeof dataGenFake, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...dataGenFakeQueryOptions(),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchDataGenFake = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...dataGenFakeQueryOptions(), ...options });
};

export const getDunningEmlQueryOptions = ({ officeId, dunningId }: { officeId: string, dunningId: string }) => ({
  queryKey: keys.getDunningEml(officeId, dunningId),
  queryFn: () => getDunningEml(officeId, dunningId),
});

/** 
 * Query `useGetDunningEml` - recommended when file should be cached
 * @summary Get dunning as EML file with PDF attachment
 * @permission Requires `canUseGetDunningEml` ability 
 * @param { string } officeId Path parameter
 * @param { string } dunningId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetDunningEml = <TData>({ officeId, dunningId }: { officeId: string, dunningId: string }, options?: AppQueryOptions<typeof getDunningEml, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getDunningEmlQueryOptions({ officeId, dunningId }),
    queryFn: async () => {
    checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId } ));
      return getDunningEmlQueryOptions({ officeId, dunningId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetDunningEml = (queryClient: QueryClient, { officeId, dunningId }: { officeId: string, dunningId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getDunningEmlQueryOptions({ officeId, dunningId }), ...options });
};

/** 
 * Mutation `useGetDunningEmlMutation` - recommended when file should not be cached
 * @summary Get dunning as EML file with PDF attachment
 * @permission Requires `canUseGetDunningEml` ability 
 * @param { string } officeId Path parameter
 * @param { string } dunningId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetDunningEmlMutation = (options?: AppMutationOptions<typeof getDunningEml, { officeId: string, dunningId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningManagement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, dunningId }) => { 
      checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId } ));
      return getDunningEml(officeId, dunningId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, dunningId } = variables;
      const updateKeys = [keys.getDunningEml(officeId, dunningId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
