import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { ChargeTypesAcl } from "./chargeTypes.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ChargeTypesModels } from "./chargeTypes.models";
import { ChargeTypesApi } from "./chargeTypes.api";

export namespace ChargeTypesQueries {
  export const moduleName = QueryModule.ChargeTypes;

  export const keys = {
    all: [moduleName] as const,
    findAll: (
      limit?: number,
      order?: string,
      filter?: ChargeTypesModels.ChargeTypeLabelFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/charge-types/paginate/labels", limit, order, filter, page, cursor] as const,
    findAllInfinite: (
      limit?: number,
      order?: string,
      filter?: ChargeTypesModels.ChargeTypeLabelFilterDto,
      cursor?: string,
    ) => [...keys.all, "/charge-types/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    paginate: (
      limit?: number,
      order?: string,
      filter?: ChargeTypesModels.ChargeTypePaginationFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/charge-types", limit, order, filter, page, cursor] as const,
    paginateInfinite: (
      limit?: number,
      order?: string,
      filter?: ChargeTypesModels.ChargeTypePaginationFilterDto,
      cursor?: string,
    ) => [...keys.all, "/charge-types", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/charge-types/:id", id] as const,
  };

  /**
   * Query `useFindAll`
   * @summary Paginate charge types with only their labels
   * @permission Requires `canUseFindAll` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
   * @param { ChargeTypesModels.ChargeTypeLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ChargeTypesModels.ChargeTypesFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: ChargeTypesModels.ChargeTypeLabelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof ChargeTypesApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findAll(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(ChargeTypesAcl.canUseFindAll());
        return ChargeTypesApi.findAll(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useFindAllInfinite
   * @summary Paginate charge types with only their labels
   * @permission Requires `canUseFindAll` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
   * @param { ChargeTypesModels.ChargeTypeLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<ChargeTypesModels.ChargeTypesFindAllResponse> }
   * @statusCodes [200, 401]
   */
  export const useFindAllInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: ChargeTypesModels.ChargeTypeLabelFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof ChargeTypesApi.findAll, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.findAllInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(ChargeTypesAcl.canUseFindAll());
        return ChargeTypesApi.findAll(limit, order, filter, pageParam, cursor, config);
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
   * Query `usePaginate`
   * @summary Paginate Charge Types
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
   * @param { ChargeTypesModels.ChargeTypePaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ChargeTypesModels.ChargeTypesPaginateResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginate = <TData>(
    {
      limit,
      order,
      filter,
      page,
      cursor,
    }: {
      limit: number;
      order?: string;
      filter?: ChargeTypesModels.ChargeTypePaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof ChargeTypesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginate(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(ChargeTypesAcl.canUsePaginate());
        return ChargeTypesApi.paginate(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateInfinite
   * @summary Paginate Charge Types
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy, englishName. Example: `name`
   * @param { ChargeTypesModels.ChargeTypePaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<ChargeTypesModels.ChargeTypesPaginateResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: ChargeTypesModels.ChargeTypePaginationFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof ChargeTypesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(ChargeTypesAcl.canUsePaginate());
        return ChargeTypesApi.paginate(limit, order, filter, pageParam, cursor, config);
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
   * @summary Create a new Charge Type
   * @permission Requires `canUseCreate` ability
   * @param { ChargeTypesModels.CreateChargeTypeRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof ChargeTypesApi.create, { data: ChargeTypesModels.CreateChargeTypeRequestDTO }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(ChargeTypesAcl.canUseCreate());
        return ChargeTypesApi.create(data, config);
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
   * @summary Get Charge Type Details by id
   * @permission Requires `canUseFindById` ability
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ChargeTypesModels.ChargeTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useFindById = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof ChargeTypesApi.findById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findById(id),
      queryFn: () => {
        checkAcl(ChargeTypesAcl.canUseFindById());
        return ChargeTypesApi.findById(id, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update an existing Charge Type
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { ChargeTypesModels.UpdateChargeTypeRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof ChargeTypesApi.update,
      { id: string; data: ChargeTypesModels.UpdateChargeTypeRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, data }) => {
        checkAcl(ChargeTypesAcl.canUseUpdate());
        return ChargeTypesApi.update(id, data, config);
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
   * @summary Archive a Charge Type
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof ChargeTypesApi.archive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(ChargeTypesAcl.canUseArchive());
        return ChargeTypesApi.archive(id, config);
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
   * @summary Unarchive a Charge Type
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<ChargeTypesModels.ChargeTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof ChargeTypesApi.unarchive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(ChargeTypesAcl.canUseUnarchive());
        return ChargeTypesApi.unarchive(id, config);
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
