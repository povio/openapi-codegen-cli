import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { DunningLevelsAcl } from "./dunningLevels.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { DunningLevelsModels } from "./dunningLevels.models";
import { DunningLevelsApi } from "./dunningLevels.api";

export namespace DunningLevelsQueries {
  export const moduleName = QueryModule.DunningLevels;

  export const keys = {
    all: [moduleName] as const,
    paginateLabels: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningLevelsModels.DunningLevelLabelFilterDto,
      page?: number,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/dunning-levels/paginate/labels",
        officeId,
        limit,
        order,
        filter,
        page,
        cursor,
      ] as const,
    paginateLabelsInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningLevelsModels.DunningLevelLabelFilterDto,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/dunning-levels/paginate/labels",
        "infinite",
        officeId,
        limit,
        order,
        filter,
        cursor,
      ] as const,
    list: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningLevelsModels.DunningLevelFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/offices/:officeId/dunning-levels", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: DunningLevelsModels.DunningLevelFilterDto,
      cursor?: string,
    ) =>
      [...keys.all, "/offices/:officeId/dunning-levels", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/dunning-levels/:id", id, officeId] as const,
  };

  /**
   * Query `usePaginateLabels`
   * @summary Paginate dunning level labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
   * @param { DunningLevelsModels.DunningLevelLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningLevelsModels.DunningLevelsPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabels = <TData>(
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
      filter?: DunningLevelsModels.DunningLevelLabelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof DunningLevelsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId }));
        return DunningLevelsApi.paginateLabels(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate dunning level labels
   * @permission Requires `canUsePaginateLabels` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
   * @param { DunningLevelsModels.DunningLevelLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<DunningLevelsModels.DunningLevelsPaginateLabelsResponse> }
   * @statusCodes [200, 401]
   */
  export const usePaginateLabelsInfinite = <TData>(
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
      filter?: DunningLevelsModels.DunningLevelLabelFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof DunningLevelsApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(DunningLevelsAcl.canUsePaginateLabels({ officeId }));
        return DunningLevelsApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor, config);
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
   * @summary List dunning levels
   * @permission Requires `canUseList` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
   * @param { DunningLevelsModels.DunningLevelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningLevelsModels.DunningLevelsListResponse> }
   * @statusCodes [200, 401]
   */
  export const useList = <TData>(
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
      filter?: DunningLevelsModels.DunningLevelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof DunningLevelsApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.list(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(DunningLevelsAcl.canUseList({ officeId }));
        return DunningLevelsApi.list(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListInfinite
   * @summary List dunning levels
   * @permission Requires `canUseList` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): level, daysOverdue, dunningFee, createdAt, updatedAt, createdBy, updatedBy. Example: `level`
   * @param { DunningLevelsModels.DunningLevelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<DunningLevelsModels.DunningLevelsListResponse> }
   * @statusCodes [200, 401]
   */
  export const useListInfinite = <TData>(
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
      filter?: DunningLevelsModels.DunningLevelFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof DunningLevelsApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(DunningLevelsAcl.canUseList({ officeId }));
        return DunningLevelsApi.list(officeId, limit, order, filter, pageParam, cursor, config);
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
   * @summary Create dunning level
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { DunningLevelsModels.CreateDunningLevelRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> }
   * @statusCodes [201, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof DunningLevelsApi.create,
      { officeId: string; data: DunningLevelsModels.CreateDunningLevelRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, data }) => {
        checkAcl(DunningLevelsAcl.canUseCreate({ officeId }));
        return DunningLevelsApi.create(officeId, data, config);
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
   * @summary Get dunning level by ID
   * @permission Requires `canUseFindById` ability
   * @param { string } object.id Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<DunningLevelsModels.DunningLevelResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useFindById = <TData>(
    { id, officeId }: { id: string; officeId: string },
    options?: AppQueryOptions<typeof DunningLevelsApi.findById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findById(id, officeId),
      queryFn: () => {
        checkAcl(DunningLevelsAcl.canUseFindById({ officeId }));
        return DunningLevelsApi.findById(id, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update dunning level
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { DunningLevelsModels.UpdateDunningLevelRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof DunningLevelsApi.update,
      { id: string; officeId: string; data: DunningLevelsModels.UpdateDunningLevelRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId, data }) => {
        checkAcl(DunningLevelsAcl.canUseUpdate({ officeId }));
        return DunningLevelsApi.update(id, officeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id, officeId } = variables;
        const updateKeys = [keys.findById(id, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useArchive`
   * @summary Archive a dunning level
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof DunningLevelsApi.archive, { id: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId }) => {
        checkAcl(DunningLevelsAcl.canUseArchive({ officeId }));
        return DunningLevelsApi.archive(id, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id, officeId } = variables;
        const updateKeys = [keys.findById(id, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };

  /**
   * Mutation `useUnarchive`
   * @summary Unarchive a dunning level
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<DunningLevelsModels.DunningLevelResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof DunningLevelsApi.unarchive, { id: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId }) => {
        checkAcl(DunningLevelsAcl.canUseUnarchive({ officeId }));
        return DunningLevelsApi.unarchive(id, officeId, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { id, officeId } = variables;
        const updateKeys = [keys.findById(id, officeId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
