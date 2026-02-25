import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { DunningManagementAcl } from "./dunningManagement.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningManagementModels } from "./dunningManagement.models";
import { DunningManagementApi } from "./dunningManagement.api";

export namespace DunningManagementQueries {
  export const moduleName = QueryModule.DunningManagement;

  export const keys = {
    all: [moduleName] as const,
    listDunnings: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningManagementModels.DunningFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/offices/:officeId/dunnings", officeId, limit, order, filter, page, cursor] as const,
    listDunningsInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningManagementModels.DunningFilterDto,
      cursor?: string,
    ) => [...keys.all, "/offices/:officeId/dunnings", "infinite", officeId, limit, order, filter, cursor] as const,
    dataGenFake: () => [...keys.all, "/data-gen-fake"] as const,
    getDunningEml: (officeId: string, dunningId: string) =>
      [...keys.all, "/offices/:officeId/dunnings/:dunningId/eml", officeId, dunningId] as const,
  };

  /**
   * Query `useListDunnings`
   * @summary List dunnings for an office
   * @permission Requires `canUseListDunnings` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, level, outstandingAmount, statusChangedOn. Example: `createdAt`
   * @param { DunningManagementModels.DunningFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningManagementModels.ListDunningsResponse> }
   * @statusCodes [200, 401]
   */
  export const useListDunnings = <TData>(
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
      filter?: DunningManagementModels.DunningFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof DunningManagementApi.listDunnings, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.listDunnings(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(DunningManagementAcl.canUseListDunnings({ officeId }));
        return DunningManagementApi.listDunnings(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListDunningsInfinite
   * @summary List dunnings for an office
   * @permission Requires `canUseListDunnings` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, level, outstandingAmount, statusChangedOn. Example: `createdAt`
   * @param { DunningManagementModels.DunningFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<DunningManagementModels.ListDunningsResponse> }
   * @statusCodes [200, 401]
   */
  export const useListDunningsInfinite = <TData>(
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
      filter?: DunningManagementModels.DunningFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof DunningManagementApi.listDunnings, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listDunningsInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(DunningManagementAcl.canUseListDunnings({ officeId }));
        return DunningManagementApi.listDunnings(officeId, limit, order, filter, pageParam, cursor, config);
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
   * Mutation `useCreateDunningWithInvoices`
   * @summary Create a dunning with outstanding invoices
   * @permission Requires `canUseCreateDunningWithInvoices` ability
   * @param { string } mutation.partnerId Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { DunningManagementModels.CreateDunningWithInvoicesRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningManagementModels.DunningResponseDto> }
   * @statusCodes [201, 401]
   */
  export const useCreateDunningWithInvoices = (
    options?: AppMutationOptions<
      typeof DunningManagementApi.createDunningWithInvoices,
      { partnerId: string; officeId: string; data: DunningManagementModels.CreateDunningWithInvoicesRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ partnerId, officeId, data }) => {
        checkAcl(DunningManagementAcl.canUseCreateDunningWithInvoices({ officeId }));
        return DunningManagementApi.createDunningWithInvoices(partnerId, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useDataGenFake`
   * @summary Expose dunning PDF payload DTO for model generation
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningManagementModels.DunningPdfPayloadDTO> }
   * @statusCodes [200, 401]
   */
  export const useDataGenFake = <TData>(
    options?: AppQueryOptions<typeof DunningManagementApi.dataGenFake, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.dataGenFake(),
      queryFn: () => DunningManagementApi.dataGenFake(config),
      ...options,
    });
  };

  /**
   * Query `useGetDunningEml` - recommended when file should be cached
   * @summary Get dunning as EML file with PDF attachment
   * @permission Requires `canUseGetDunningEml` ability
   * @param { string } object.officeId Path parameter
   * @param { string } object.dunningId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const useGetDunningEml = <TData>(
    { officeId, dunningId }: { officeId: string; dunningId: string },
    options?: AppQueryOptions<typeof DunningManagementApi.getDunningEml, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getDunningEml(officeId, dunningId),
      queryFn: () => {
        checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId }));
        return DunningManagementApi.getDunningEml(officeId, dunningId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useGetDunningEmlMutation` - recommended when file should not be cached
   * @summary Get dunning as EML file with PDF attachment
   * @permission Requires `canUseGetDunningEml` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.dunningId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> }
   * @statusCodes [200, 401]
   */
  export const useGetDunningEmlMutation = (
    options?: AppMutationOptions<typeof DunningManagementApi.getDunningEml, { officeId: string; dunningId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, dunningId }) => {
        checkAcl(DunningManagementAcl.canUseGetDunningEml({ officeId }));
        return DunningManagementApi.getDunningEml(officeId, dunningId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { officeId, dunningId } = variables;
        const updateKeys = [keys.getDunningEml(officeId, dunningId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
