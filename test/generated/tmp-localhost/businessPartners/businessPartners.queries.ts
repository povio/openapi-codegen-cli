import axios, {  } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { BusinessPartnersAcl } from "./businessPartners.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
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

/** 
 * Query `usePaginate`
 * @summary Paginate business partners
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnersPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
    return BusinessPartnersApi.paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary Paginate business partners
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BusinessPartnersModels.BusinessPartnersPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof BusinessPartnersApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
    return BusinessPartnersApi.paginate(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create business partner
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { BusinessPartnersModels.CreateBusinessPartnerRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof BusinessPartnersApi.create, { officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `usePaginateLabels`
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerLabelsFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnersPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
    return BusinessPartnersApi.paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `usePaginateLabelsInfinite
 * @permission Requires `canUsePaginateLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): name, matchCode, createdAt, updatedAt, createdBy, updatedBy, vat, shortName, address, locked, currency, archived. Example: `name`
 * @param { BusinessPartnersModels.BusinessPartnerLabelsFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<BusinessPartnersModels.BusinessPartnersPaginateLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof BusinessPartnersApi.paginateLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
    return BusinessPartnersApi.paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useGetById`
 * @summary Get business partner by ID
 * @permission Requires `canUseGetById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerDetailResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getById(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetById({ officeId } ));
    return BusinessPartnersApi.getById(officeId, id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update business partner
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerDetailResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof BusinessPartnersApi.update, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof BusinessPartnersApi.archive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof BusinessPartnersApi.unarchive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useLock = (options?: AppMutationOptions<typeof BusinessPartnersApi.lock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnlock = (options?: AppMutationOptions<typeof BusinessPartnersApi.unlock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useGetRemarks`
 * @summary Get business partner remarks
 * @permission Requires `canUseGetRemarks` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.GetRemarksResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetRemarks = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getRemarks, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getRemarks(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetRemarks({ officeId } ));
    return BusinessPartnersApi.getRemarks(officeId, id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreateRemark`
 * @summary Create business partner remark
 * @permission Requires `canUseCreateRemark` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerRemarkResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.createRemark, { officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.remarkId Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerRemarkResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateRemark, { officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { string } mutation.remarkId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useDeleteRemark = (options?: AppMutationOptions<typeof BusinessPartnersApi.deleteRemark, { officeId: string, id: string, remarkId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useGetBasicInfo`
 * @summary Get business partner basic info
 * @permission Requires `canUseGetBasicInfo` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerBasicResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetBasicInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getBasicInfo, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBasicInfo(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetBasicInfo({ officeId } ));
    return BusinessPartnersApi.getBasicInfo(officeId, id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateBasicInfo`
 * @summary Update business partner basic info
 * @permission Requires `canUseUpdateBasicInfo` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerBasicResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateBasicInfo = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateBasicInfo, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerSignatureUploadResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateSignatureUploadInstructions = (options?: AppMutationOptions<typeof BusinessPartnersApi.createSignatureUploadInstructions, { officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useGetCargoAgentInfo`
 * @summary Get cargo agent information for business partner
 * @permission Requires `canUseGetCargoAgentInfo` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CargoAgentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoAgentInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getCargoAgentInfo, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoAgentInfo(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetCargoAgentInfo({ officeId } ));
    return BusinessPartnersApi.getCargoAgentInfo(officeId, id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateCargoAgent`
 * @summary Update cargo agent information for business partner
 * @permission Requires `canUseUpdateCargoAgent` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.UpdateCargoAgentDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.CargoAgentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargoAgent = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateCargoAgent, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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

/** 
 * Query `useGetCarrierInformation`
 * @summary Get carrier information for business partner
 * @permission Requires `canUseGetCarrierInformation` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CarrierResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCarrierInformation = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof BusinessPartnersApi.getCarrierInformation, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCarrierInformation(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetCarrierInformation({ officeId } ));
    return BusinessPartnersApi.getCarrierInformation(officeId, id) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateCarrier`
 * @summary Update carrier information for business partner
 * @permission Requires `canUseUpdateCarrier` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.id Path parameter
 * @param { BusinessPartnersModels.UpdateCarrierDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.CarrierResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCarrier = (options?: AppMutationOptions<typeof BusinessPartnersApi.updateCarrier, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

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
