import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { TerminalsAcl } from "./terminals.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { TerminalsModels } from "./terminals.models";
import { TerminalsApi } from "./terminals.api";

export namespace TerminalsQueries {
  export const moduleName = QueryModule.Terminals;

  export const keys = {
    all: [moduleName] as const,
    paginate: (
      limit?: number,
      order?: string,
      filter?: TerminalsModels.TerminalPaginationFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/terminals", limit, order, filter, page, cursor] as const,
    paginateInfinite: (
      limit?: number,
      order?: string,
      filter?: TerminalsModels.TerminalPaginationFilterDto,
      cursor?: string,
    ) => [...keys.all, "/terminals", "infinite", limit, order, filter, cursor] as const,
    paginateLabels: (
      limit?: number,
      order?: string,
      filter?: TerminalsModels.TerminalLabelFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/terminals/paginate/labels", limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (
      limit?: number,
      order?: string,
      filter?: TerminalsModels.TerminalLabelFilterDto,
      cursor?: string,
    ) => [...keys.all, "/terminals/paginate/labels", "infinite", limit, order, filter, cursor] as const,
    getById: (id: string) => [...keys.all, "/terminals/:id", id] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a new terminal
   * @permission Requires `canUseCreate` ability
   * @param { TerminalsModels.CreateTerminalRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<TerminalsModels.TerminalResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof TerminalsApi.create, { data: TerminalsModels.CreateTerminalRequestDTO }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => {
        checkAcl(TerminalsAcl.canUseCreate());
        return TerminalsApi.create(data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Query `usePaginate`
   * @summary Paginate Terminals
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { TerminalsModels.TerminalPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TerminalsModels.TerminalsPaginateResponse> }
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
      filter?: TerminalsModels.TerminalPaginationFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof TerminalsApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginate(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(TerminalsAcl.canUsePaginate());
        return TerminalsApi.paginate(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateInfinite
   * @summary Paginate Terminals
   * @permission Requires `canUsePaginate` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { TerminalsModels.TerminalPaginationFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<TerminalsModels.TerminalsPaginateResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: TerminalsModels.TerminalPaginationFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof TerminalsApi.paginate, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(TerminalsAcl.canUsePaginate());
        return TerminalsApi.paginate(limit, order, filter, pageParam, cursor, config);
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
   * Query `usePaginateLabels`
   * @summary Paginate terminals with only their labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { TerminalsModels.TerminalLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TerminalsModels.TerminalsPaginateLabelsResponse> }
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
      filter?: TerminalsModels.TerminalLabelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof TerminalsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(TerminalsAcl.canUsePaginateLabels());
        return TerminalsApi.paginateLabels(limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate terminals with only their labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, shortName, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { TerminalsModels.TerminalLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<TerminalsModels.TerminalsPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabelsInfinite = <TData>(
    {
      limit,
      order,
      filter,
      cursor,
    }: { limit: number; order?: string; filter?: TerminalsModels.TerminalLabelFilterDto; cursor?: string },
    options?: AppInfiniteQueryOptions<typeof TerminalsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(TerminalsAcl.canUsePaginateLabels());
        return TerminalsApi.paginateLabels(limit, order, filter, pageParam, cursor, config);
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
   * Query `useGetById`
   * @summary Get terminal details by ID
   * @permission Requires `canUseGetById` ability
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TerminalsModels.TerminalResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetById = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof TerminalsApi.getById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.getById(id),
      queryFn: () => {
        checkAcl(TerminalsAcl.canUseGetById());
        return TerminalsApi.getById(id, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update terminal details
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { TerminalsModels.UpdateTerminalRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<TerminalsModels.TerminalResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof TerminalsApi.update,
      { id: string; data: TerminalsModels.UpdateTerminalRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, data }) => {
        checkAcl(TerminalsAcl.canUseUpdate());
        return TerminalsApi.update(id, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id } = variables;
        const updateKeys = [keys.getById(id)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useArchive`
   * @summary Archive a terminal
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [200, 401]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof TerminalsApi.archive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(TerminalsAcl.canUseArchive());
        return TerminalsApi.archive(id, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useUnarchive`
   * @summary Unarchive a terminal
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [200, 401]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof TerminalsApi.unarchive, { id: string }> & MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id }) => {
        checkAcl(TerminalsAcl.canUseUnarchive());
        return TerminalsApi.unarchive(id, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
