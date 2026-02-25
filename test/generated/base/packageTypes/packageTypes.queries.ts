import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PackageTypesAcl } from "./packageTypes.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PackageTypesModels } from "./packageTypes.models";
import { PackageTypesApi } from "./packageTypes.api";

export namespace PackageTypesQueries {
  export const moduleName = QueryModule.PackageTypes;

  export const keys = {
    all: [moduleName] as const,
    paginate: (
      limit?: number,
      order?: string,
      filter?: PackageTypesModels.PackageTypePaginationFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/package-types", limit, order, filter, page, cursor] as const,
    paginateInfinite: (
      limit?: number,
      order?: string,
      filter?: PackageTypesModels.PackageTypePaginationFilterDto,
      cursor?: string,
    ) => [...keys.all, "/package-types", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (
      limit?: number,
      order?: string,
      filter?: PackageTypesModels.PackageTypeLabelFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/package-types/paginate/labels", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: PackageTypesModels.PackageTypeLabelFilterDto,
      cursor?: string,
    ) => [...keys.all, "/package-types/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/package-types/:id", id] as const,
  };

  /**
   * Query `usePaginate`
   * @summary Paginate Package Types
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
   * @param { PackageTypesModels.PackageTypePaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<PackageTypesModels.PackageTypesPaginateResponse> }
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
      filter?: PackageTypesModels.PackageTypePaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof PackageTypesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginate(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(PackageTypesAcl.canUsePaginate());
        return PackageTypesApi.paginate(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateInfinite
   * @summary Paginate Package Types
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
   * @param { PackageTypesModels.PackageTypePaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<PackageTypesModels.PackageTypesPaginateResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: PackageTypesModels.PackageTypePaginationFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof PackageTypesApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(PackageTypesAcl.canUsePaginate());
        return PackageTypesApi.paginate(limit, order, filter, pageParam, cursor, config);
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
   * @summary Create a new Package Type
   * @permission Requires `canUseCreate` ability
   * @param { PackageTypesModels.CreatePackageTypeRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof PackageTypesApi.create,
      { data: PackageTypesModels.CreatePackageTypeRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(PackageTypesAcl.canUseCreate());
        return PackageTypesApi.create(data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePaginateLabels`
   * @summary Paginate package type labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
   * @param { PackageTypesModels.PackageTypeLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<PackageTypesModels.PackageTypesPaginateLabelsResponse> }
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
      filter?: PackageTypesModels.PackageTypeLabelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof PackageTypesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(PackageTypesAcl.canUsePaginateLabels());
        return PackageTypesApi.paginateLabels(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate package type labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): matchCode, description, length, width, height, unit, name, createdAt, updatedAt, createdBy, updatedBy. Example: `matchCode`
   * @param { PackageTypesModels.PackageTypeLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<PackageTypesModels.PackageTypesPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: PackageTypesModels.PackageTypeLabelFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof PackageTypesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(PackageTypesAcl.canUsePaginateLabels());
        return PackageTypesApi.paginateLabels(limit, order, filter, pageParam, cursor, config);
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
   * Query `useFindById`
   * @summary Get Package Type by id
   * @permission Requires `canUseFindById` ability
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<PackageTypesModels.PackageTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useFindById = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof PackageTypesApi.findById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findById(id),
      queryFn: () => {
        checkAcl(PackageTypesAcl.canUseFindById());
        return PackageTypesApi.findById(id, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update Package Type
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { PackageTypesModels.UpdatePackageTypeRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof PackageTypesApi.update,
      { id: string; data: PackageTypesModels.UpdatePackageTypeRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, data }) => {
        checkAcl(PackageTypesAcl.canUseUpdate());
        return PackageTypesApi.update(id, data, config);
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
   * @summary Archive Package Type
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof PackageTypesApi.archive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(PackageTypesAcl.canUseArchive());
        return PackageTypesApi.archive(id, config);
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
   * @summary Unarchive Package Type
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<PackageTypesModels.PackageTypeResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof PackageTypesApi.unarchive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(PackageTypesAcl.canUseUnarchive());
        return PackageTypesApi.unarchive(id, config);
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
