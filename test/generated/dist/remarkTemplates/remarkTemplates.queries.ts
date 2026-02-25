import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { RemarkTemplatesAcl } from "./remarkTemplates.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { RemarkTemplatesModels } from "./remarkTemplates.models";
import { RemarkTemplatesApi } from "./remarkTemplates.api";

export namespace RemarkTemplatesQueries {
  export const moduleName = QueryModule.RemarkTemplates;

  export const keys = {
    all: [moduleName] as const,
    paginateLabels: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto,
      page?: number,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/remark-templates/paginate/labels",
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
      filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto,
      cursor?: string,
    ) =>
      [
        ...keys.all,
        "/offices/:officeId/remark-templates/paginate/labels",
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
      filter?: RemarkTemplatesModels.RemarkTemplateFilterDto,
      page?: number,
      cursor?: string,
    ) => [...keys.all, "/offices/:officeId/remark-templates", officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (
      officeId: string,
      limit?: number,
      order?: string,
      filter?: RemarkTemplatesModels.RemarkTemplateFilterDto,
      cursor?: string,
    ) =>
      [...keys.all, "/offices/:officeId/remark-templates", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (id: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/remark-templates/:id", id, officeId] as const,
  };

  /**
   * Query `usePaginateLabels`
   * @summary Paginate remark template labels for office
   * @permission Requires `canUsePaginateLabels` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { RemarkTemplatesModels.RemarkTemplateLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RemarkTemplatesModels.RemarkTemplatesPaginateLabelsResponse> }
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
      filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof RemarkTemplatesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(RemarkTemplatesAcl.canUsePaginateLabels({ officeId }));
        return RemarkTemplatesApi.paginateLabels(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `usePaginateLabelsInfinite
   * @summary Paginate remark template labels for office
   * @permission Requires `canUsePaginateLabels` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { RemarkTemplatesModels.RemarkTemplateLabelFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<RemarkTemplatesModels.RemarkTemplatesPaginateLabelsResponse> }
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
      filter?: RemarkTemplatesModels.RemarkTemplateLabelFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof RemarkTemplatesApi.paginateLabels, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(RemarkTemplatesAcl.canUsePaginateLabels({ officeId }));
        return RemarkTemplatesApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor, config);
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
   * @summary List remark templates
   * @permission Requires `canUseList` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { RemarkTemplatesModels.RemarkTemplateFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RemarkTemplatesModels.RemarkTemplatesListResponse> }
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
      filter?: RemarkTemplatesModels.RemarkTemplateFilterDto;
      page?: number;
      cursor?: string;
    },
    options?: AppQueryOptions<typeof RemarkTemplatesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.list(officeId, limit, order, filter, page, cursor),
      queryFn: () => {
        checkAcl(RemarkTemplatesAcl.canUseList({ officeId }));
        return RemarkTemplatesApi.list(officeId, limit, order, filter, page, cursor, config);
      },
      ...options,
    });
  };

  /**
   * Infinite query `useListInfinite
   * @summary List remark templates
   * @permission Requires `canUseList` ability
   * @param { string } object.officeId Path parameter
   * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
   * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, createdAt, updatedAt, createdBy, updatedBy. Example: `name`
   * @param { RemarkTemplatesModels.RemarkTemplateFilterDto } object.filter Query parameter
   * @param { number } object.page Query parameter. 1-indexed page number to begin from
   * @param { string } object.cursor Query parameter. ID of item to start after
   * @param { AppInfiniteQueryOptions } options Infinite query options
   * @returns { UseInfiniteQueryResult<RemarkTemplatesModels.RemarkTemplatesListResponse> }
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
      filter?: RemarkTemplatesModels.RemarkTemplateFilterDto;
      cursor?: string;
    },
    options?: AppInfiniteQueryOptions<typeof RemarkTemplatesApi.list, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useInfiniteQuery({
      queryKey: keys.listInfinite(officeId, limit, order, filter, cursor),
      queryFn: ({ pageParam }) => {
        checkAcl(RemarkTemplatesAcl.canUseList({ officeId }));
        return RemarkTemplatesApi.list(officeId, limit, order, filter, pageParam, cursor, config);
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
   * @summary Create a new remark template
   * @permission Requires `canUseCreate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { RemarkTemplatesModels.CreateRemarkTemplateRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<RemarkTemplatesModels.RemarkTemplateResponseDTO> }
   * @statusCodes [201, 401, 409]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof RemarkTemplatesApi.create,
      { officeId: string; data: RemarkTemplatesModels.CreateRemarkTemplateRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, data }) => {
        checkAcl(RemarkTemplatesAcl.canUseCreate({ officeId }));
        return RemarkTemplatesApi.create(officeId, data, config);
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
   * @summary Get remark template by ID
   * @permission Requires `canUseFindById` ability
   * @param { string } object.id Path parameter
   * @param { string } object.officeId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RemarkTemplatesModels.RemarkTemplateResponseDTO> }
   * @statusCodes [200, 401, 404]
   */
  export const useFindById = <TData>(
    { id, officeId }: { id: string; officeId: string },
    options?: AppQueryOptions<typeof RemarkTemplatesApi.findById, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.findById(id, officeId),
      queryFn: () => {
        checkAcl(RemarkTemplatesAcl.canUseFindById({ officeId }));
        return RemarkTemplatesApi.findById(id, officeId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update remark template by ID
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { RemarkTemplatesModels.UpdateRemarkTemplateRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<RemarkTemplatesModels.RemarkTemplateResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof RemarkTemplatesApi.update,
      { id: string; officeId: string; data: RemarkTemplatesModels.UpdateRemarkTemplateRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId, data }) => {
        checkAcl(RemarkTemplatesAcl.canUseUpdate({ officeId }));
        return RemarkTemplatesApi.update(id, officeId, data, config);
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
   * @summary Archive remark template
   * @permission Requires `canUseArchive` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<RemarkTemplatesModels.RemarkTemplateResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useArchive = (
    options?: AppMutationOptions<typeof RemarkTemplatesApi.archive, { id: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId }) => {
        checkAcl(RemarkTemplatesAcl.canUseArchive({ officeId }));
        return RemarkTemplatesApi.archive(id, officeId, config);
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
   * @summary Unarchive remark template
   * @permission Requires `canUseUnarchive` ability
   * @param { string } mutation.id Path parameter
   * @param { string } mutation.officeId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<RemarkTemplatesModels.RemarkTemplateResponseDTO> }
   * @statusCodes [200, 401, 404, 409]
   */
  export const useUnarchive = (
    options?: AppMutationOptions<typeof RemarkTemplatesApi.unarchive, { id: string; officeId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ id, officeId }) => {
        checkAcl(RemarkTemplatesAcl.canUseUnarchive({ officeId }));
        return RemarkTemplatesApi.unarchive(id, officeId, config);
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
