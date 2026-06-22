import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { DunningManagementAcl } from "./dunningManagement.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningManagementModels } from "./dunningManagement.models";
import { DunningManagementApi } from "./dunningManagement.api";

export namespace DunningManagementQueries {
export const moduleName = QueryModule.DunningManagement;

export const keys = {
    all: [moduleName] as const,
    listDunnings: (officeId: string, limit?: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/dunnings", officeId, limit, order, filter, page, cursor] as const,
    listDunningsInfinite: (officeId: string, limit?: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/dunnings", "infinite", officeId, limit, order, filter, cursor] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake", ] as const,
    getDunningEml: (officeId: string, dunningId: string) => [...keys.all, "/offices/:officeId/dunnings/:dunningId/eml", officeId, dunningId] as const,
};

const listDunningsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.listDunnings(officeId, limit, order, filter, page, cursor),
  queryFn: () => DunningManagementApi.listDunnings(officeId, limit, order, filter, page, cursor),
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
export const useListDunnings = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof DunningManagementApi.listDunnings, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(DunningManagementAcl.canUseListDunnings({ officeId } ));
      return listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchListDunnings = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listDunningsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const listDunningsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }) => ({
  queryKey: keys.listDunningsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => DunningManagementApi.listDunnings(officeId, limit, order, filter, pageParam, cursor),
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
export const useListDunningsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof DunningManagementApi.listDunnings, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(DunningManagementAcl.canUseListDunnings({ officeId } ));
      return listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListDunningsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...listDunningsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
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
export const useCreateDunningWithInvoices = (options?: AppMutationOptions<typeof DunningManagementApi.createDunningWithInvoices, { partnerId: string, officeId: string, data: DunningManagementModels.CreateDunningWithInvoicesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningManagement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ partnerId, officeId, data }) => { 
      checkAcl(DunningManagementAcl.canUseCreateDunningWithInvoices({ officeId } ));
      return DunningManagementApi.createDunningWithInvoices(partnerId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const dataGenFakeQueryOptions = () => ({
  queryKey: keys.dataGenFake(),
  queryFn: () => DunningManagementApi.dataGenFake(),
});

/** 
 * Query `useDataGenFake`
 * @summary Expose dunning PDF payload DTO for model generation
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<DunningManagementModels.DunningPdfPayloadDTO> } 
 * @statusCodes [200, 401]
 */
export const useDataGenFake = <TData>(options?: AppQueryOptions<typeof DunningManagementApi.dataGenFake, TData>) => {
  
  return useQuery({
    ...dataGenFakeQueryOptions(),
    ...options,
  });
};

export const prefetchDataGenFake = (queryClient: QueryClient, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...dataGenFakeQueryOptions(), ...options });
};

const getDunningEmlQueryOptions = ({ officeId, dunningId }: { officeId: string, dunningId: string }) => ({
  queryKey: keys.getDunningEml(officeId, dunningId),
  queryFn: () => DunningManagementApi.getDunningEml(officeId, dunningId),
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
export const useGetDunningEml = <TData>({ officeId, dunningId }: { officeId: string, dunningId: string }, options?: AppQueryOptions<typeof DunningManagementApi.getDunningEml, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getDunningEmlQueryOptions({ officeId, dunningId }),
    queryFn: async () => {
    checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId } ));
      return getDunningEmlQueryOptions({ officeId, dunningId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetDunningEml = (queryClient: QueryClient, { officeId, dunningId }: { officeId: string, dunningId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getDunningEmlQueryOptions({ officeId, dunningId }), ...options });
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
export const useGetDunningEmlMutation = (options?: AppMutationOptions<typeof DunningManagementApi.getDunningEml, { officeId: string, dunningId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.DunningManagement>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, dunningId }) => { 
      checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId } ));
      return DunningManagementApi.getDunningEml(officeId, dunningId)
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
