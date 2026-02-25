import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { VatRulesAcl } from "./vatRules.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { VatRulesModels } from "./vatRules.models";
import { VatRulesApi } from "./vatRules.api";

export namespace VatRulesQueries {
  export const moduleName = QueryModule.VatRules;

  export const keys = {
    all: [moduleName] as const,
    paginateLabels: (
      limit?: number,
      order?: string,
      filter?: VatRulesModels.VatRuleFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/vat-rules/labels/paginate", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: VatRulesModels.VatRuleFilterDto,
      cursor?: string,
    ) => [...keys.all, "/vat-rules/labels/paginate", "infinite", limit, order, filter, cursor] as const,
    list: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, page?: number, cursor?: string) =>
      [...keys.all, "/vat-rules", limit, order, filter, page, cursor] as const,
    listInfinite: (limit?: number, order?: string, filter?: VatRulesModels.VatRuleFilterDto, cursor?: string) =>
      [...keys.all, "/vat-rules", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/vat-rules/:id", id] as const,
  };

  /**
   * Query `usePaginateLabels`
   * @summary Paginate VAT rule labels (id and matchcode only)
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
   * @param { VatRulesModels.VatRuleFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabels = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: { limit: number; order?: string; filter?: VatRulesModels.VatRuleFilterDto; page?: number; cursor?: string },
    options?: AppQueryOptions<typeof VatRulesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(VatRulesAcl.canUsePaginateLabels());
        return VatRulesApi.paginateLabels(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate VAT rule labels (id and matchcode only)
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
   * @param { VatRulesModels.VatRuleFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: VatRulesModels.VatRuleFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof VatRulesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(VatRulesAcl.canUsePaginateLabels());
        return VatRulesApi.paginateLabels(limit, order, filter, pageParam, cursor, config);
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
   * Query `useList`
   * @summary List VAT rules
   * @permission Requires `canUseList` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
   * @param { VatRulesModels.VatRuleFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<VatRulesModels.VatRulesListResponse> }
   * @statusCodes [200, 401]
   */
  export const useList = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: { limit: number; order?: string; filter?: VatRulesModels.VatRuleFilterDto; page?: number; cursor?: string },
    options?: AppQueryOptions<typeof VatRulesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.list(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(VatRulesAcl.canUseList());
        return VatRulesApi.list(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListInfinite
   * @summary List VAT rules
   * @permission Requires `canUseList` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchcode, name, type, createdAt, updatedAt, createdBy, updatedBy. Example: `matchcode`
   * @param { VatRulesModels.VatRuleFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<VatRulesModels.VatRulesListResponse> }
   * @statusCodes [200, 401]
   */
  export const useListInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: VatRulesModels.VatRuleFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof VatRulesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(VatRulesAcl.canUseList());
        return VatRulesApi.list(limit, order, filter, pageParam, cursor, config);
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
   * Mutation `useCreate`
   * @summary Create a new VAT rule
   * @permission Requires `canUseCreate` ability
   * @param { VatRulesModels.CreateVatRuleRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> }
   * @statusCodes [201, 401, 409]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof VatRulesApi.create, { data: VatRulesModels.CreateVatRuleRequestDTO }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(VatRulesAcl.canUseCreate());
        return VatRulesApi.create(data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `useFindById`
   * @summary Get VAT rule by ID
   * @permission Requires `canUseFindById` ability
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<VatRulesModels.VatRuleResponseDTO> }
   * @statusCodes [200, 401, 404]
   */
  export const useFindById = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof VatRulesApi.findById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findById(id),
      queryFn: () => {
        checkAcl(VatRulesAcl.canUseFindById());
        return VatRulesApi.findById(id, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update VAT rule by ID
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { VatRulesModels.UpdateVatRuleRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof VatRulesApi.update,
      { id: string; data: VatRulesModels.UpdateVatRuleRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, data }) => {
        checkAcl(VatRulesAcl.canUseUpdate());
        return VatRulesApi.update(id, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id } = variables;
        const updateKeys = [keys.findById(id)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useArchive`
   * @summary Archive VAT rule
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof VatRulesApi.archive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(VatRulesAcl.canUseArchive());
        return VatRulesApi.archive(id, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id } = variables;
        const updateKeys = [keys.findById(id)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useUnarchive`
   * @summary Unarchive VAT rule
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<VatRulesModels.VatRuleResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof VatRulesApi.unarchive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(VatRulesAcl.canUseUnarchive());
        return VatRulesApi.unarchive(id, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id } = variables;
        const updateKeys = [keys.findById(id)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
