import axios from "axios";
import { QueryClient, useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BusinessPartnersAcl } from "./businessPartners.acl";
import { OpenApiQueryConfig, type AppQueryOptions, type AppInfiniteQueryOptions, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnersModels } from "./businessPartners.models";
import { BusinessPartnersApi } from "./businessPartners.api";

export namespace BusinessPartnersQueries {
export const moduleName = QueryModule.BusinessPartners;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners", "infinite", officeId, limit, order, filter, cursor] as const,
    paginateLabels: (officeId: string, limit?: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/paginate/labels", officeId, limit, order, filter, page, cursor] as const,
    paginateLabelsInfinite: (officeId: string, limit?: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/business-partners/paginate/labels", "infinite", officeId, limit, order, filter, cursor] as const,
    getById: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/business-partners/:id", officeId, id] as const,
    getRemarks: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/business-partners/:id/remarks", officeId, id] as const,
    getBasicInfo: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/business-partners/:id/basic", officeId, id] as const,
    getCargoAgentInfo: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/business-partners/:id/cargo-agent", officeId, id] as const,
    getCarrierInformation: (officeId: string, id: string) => [...keys.all, "/offices/:officeId/business-partners/:id/carrier", officeId, id] as const,
};

const paginateQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
  queryFn: () => BusinessPartnersApi.paginate(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary Paginate business partners
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnersPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
      return paginateQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginate = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const paginateInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => BusinessPartnersApi.paginate(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate business partners
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BusinessPartnersModels.BusinessPartnersPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof BusinessPartnersApi.paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
      return paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create business partner
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { BusinessPartnersModels.CreateBusinessPartnerRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof BusinessPartnersApi.create, { officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreate({ officeId } ));
      return BusinessPartnersApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const paginateLabelsQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
  queryFn: () => BusinessPartnersApi.paginateLabels(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginateLabels`
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnersPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchPaginateLabels = (queryClient: QueryClient, { officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...paginateLabelsQueryOptions({ officeId, limit, order, filter, page, cursor }), ...options });
};

const paginateLabelsInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => BusinessPartnersApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BusinessPartnersModels.BusinessPartnersPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof BusinessPartnersApi.paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
      return paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchPaginateLabelsInfinite = (queryClient: QueryClient, { officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {
  void queryClient.prefetchInfiniteQuery({ ...paginateLabelsInfiniteQueryOptions({ officeId, limit, order, filter, cursor }), ...options });
};

const getByIdQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.getById(officeId, id),
  queryFn: () => BusinessPartnersApi.getById(officeId, id),
});

/** 
 * Query `useGetById`
 * @summary Get business partner by ID
 * @permission Requires `canUseGetById` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerDetailResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getByIdQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUseGetById({ officeId } ));
      return getByIdQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetById = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getByIdQueryOptions({ officeId, id }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update business partner
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerDetailResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof BusinessPartnersApi.update, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdate({ officeId } ));
      return BusinessPartnersApi.update(officeId, id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.getById(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive business partner
 * @permission Requires `canUseArchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof BusinessPartnersApi.archive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseArchive({ officeId } ));
      return BusinessPartnersApi.archive(officeId, id)
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
 * Mutation `useUnarchive`
 * @summary Unarchive business partner
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof BusinessPartnersApi.unarchive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseUnarchive({ officeId } ));
      return BusinessPartnersApi.unarchive(officeId, id)
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
 * Mutation `useLock`
 * @summary Lock business partner
 * @permission Requires `canUseLock` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useLock = (options?: AppMutationOptions<typeof BusinessPartnersApi.lock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseLock({ officeId } ));
      return BusinessPartnersApi.lock(officeId, id)
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
 * Mutation `useUnlock`
 * @summary Unlock business partner
 * @permission Requires `canUseUnlock` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnlock = (options?: AppMutationOptions<typeof BusinessPartnersApi.unlock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseUnlock({ officeId } ));
      return BusinessPartnersApi.unlock(officeId, id)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getRemarksQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.getRemarks(officeId, id),
  queryFn: () => BusinessPartnersApi.getRemarks(officeId, id),
});

/** 
 * Query `useGetRemarks`
 * @summary Get business partner remarks
 * @permission Requires `canUseGetRemarks` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.GetRemarksResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetRemarks = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getRemarks, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getRemarksQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUseGetRemarks({ officeId } ));
      return getRemarksQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetRemarks = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getRemarksQueryOptions({ officeId, id }), ...options });
};

/** 
 * Mutation `useCreateRemark`
 * @summary Create business partner remark
 * @permission Requires `canUseCreateRemark` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerRemarkResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.createRemark, { officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreateRemark({ officeId } ));
      return BusinessPartnersApi.createRemark(officeId, id, data)
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
 * Mutation `useUpdateRemark`
 * @permission Requires `canUseUpdateRemark` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { string } remarkId Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerRemarkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateRemark, { officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, remarkId, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateRemark({ officeId } ));
      return BusinessPartnersApi.updateRemark(officeId, id, remarkId, data)
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
 * Mutation `useDeleteRemark`
 * @summary Delete business partner remark
 * @permission Requires `canUseDeleteRemark` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { string } remarkId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.deleteRemark, { officeId: string, id: string, remarkId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, remarkId }) => { 
      checkAcl(BusinessPartnersAcl.canUseDeleteRemark({ officeId } ));
      return BusinessPartnersApi.deleteRemark(officeId, id, remarkId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getBasicInfoQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.getBasicInfo(officeId, id),
  queryFn: () => BusinessPartnersApi.getBasicInfo(officeId, id),
});

/** 
 * Query `useGetBasicInfo`
 * @summary Get business partner basic info
 * @permission Requires `canUseGetBasicInfo` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerBasicResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetBasicInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getBasicInfo, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getBasicInfoQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUseGetBasicInfo({ officeId } ));
      return getBasicInfoQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetBasicInfo = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getBasicInfoQueryOptions({ officeId, id }), ...options });
};

/** 
 * Mutation `useUpdateBasicInfo`
 * @summary Update business partner basic info
 * @permission Requires `canUseUpdateBasicInfo` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerBasicResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBasicInfo = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateBasicInfo, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateBasicInfo({ officeId } ));
      return BusinessPartnersApi.updateBasicInfo(officeId, id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.getBasicInfo(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCreateSignatureUploadInstructions`
 * @summary Create upload instructions for business partner signature
 * @permission Requires `canUseCreateSignatureUploadInstructions` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerSignatureUploadResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateSignatureUploadInstructions = (options?: AppMutationOptions<typeof BusinessPartnersApi.createSignatureUploadInstructions, { officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, id, data, file, abortController, onUploadProgress }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreateSignatureUploadInstructions({ officeId } ));
      const uploadInstructions = await BusinessPartnersApi.createSignatureUploadInstructions(officeId, id, data);
      
      if (file && uploadInstructions.url) {
        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";
        let dataToSend: File | FormData = file;
        if (method === "post") {
          dataToSend = new FormData();
          if (uploadInstructions.fields) {
            for (const [key, value] of uploadInstructions.fields) {
              dataToSend.append(key, value);
            }
          }
          dataToSend.append("file", file);
        }
        await axios[method](uploadInstructions.url, dataToSend, {
          headers: {
            "Content-Type": file.type,
          },
          signal: abortController?.signal,
          onUploadProgress: onUploadProgress
          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })
          : undefined,
        });
      }
      
      return uploadInstructions;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getCargoAgentInfoQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.getCargoAgentInfo(officeId, id),
  queryFn: () => BusinessPartnersApi.getCargoAgentInfo(officeId, id),
});

/** 
 * Query `useGetCargoAgentInfo`
 * @summary Get cargo agent information for business partner
 * @permission Requires `canUseGetCargoAgentInfo` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CargoAgentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoAgentInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getCargoAgentInfo, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getCargoAgentInfoQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUseGetCargoAgentInfo({ officeId } ));
      return getCargoAgentInfoQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCargoAgentInfo = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getCargoAgentInfoQueryOptions({ officeId, id }), ...options });
};

/** 
 * Mutation `useUpdateCargoAgent`
 * @summary Update cargo agent information for business partner
 * @permission Requires `canUseUpdateCargoAgent` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.UpdateCargoAgentDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.CargoAgentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargoAgent = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateCargoAgent, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateCargoAgent({ officeId } ));
      return BusinessPartnersApi.updateCargoAgent(officeId, id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.getCargoAgentInfo(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

const getCarrierInformationQueryOptions = ({ officeId, id }: { officeId: string, id: string }) => ({
  queryKey: keys.getCarrierInformation(officeId, id),
  queryFn: () => BusinessPartnersApi.getCarrierInformation(officeId, id),
});

/** 
 * Query `useGetCarrierInformation`
 * @summary Get carrier information for business partner
 * @permission Requires `canUseGetCarrierInformation` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CarrierResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCarrierInformation = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getCarrierInformation, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getCarrierInformationQueryOptions({ officeId, id }),
    queryFn: async () => {
    checkAcl(BusinessPartnersAcl.canUseGetCarrierInformation({ officeId } ));
      return getCarrierInformationQueryOptions({ officeId, id }).queryFn();
    },
    ...options,
  });
};

export const prefetchGetCarrierInformation = (queryClient: QueryClient, { officeId, id }: { officeId: string, id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getCarrierInformationQueryOptions({ officeId, id }), ...options });
};

/** 
 * Mutation `useUpdateCarrier`
 * @summary Update carrier information for business partner
 * @permission Requires `canUseUpdateCarrier` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { BusinessPartnersModels.UpdateCarrierDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.CarrierResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCarrier = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateCarrier, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateCarrier({ officeId } ));
      return BusinessPartnersApi.updateCarrier(officeId, id, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, id } = variables;
      const updateKeys = [keys.getCarrierInformation(officeId, id)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
