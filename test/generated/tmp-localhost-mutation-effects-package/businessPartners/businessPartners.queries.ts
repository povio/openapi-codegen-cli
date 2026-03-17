import axios, {  } from "axios";
import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { BusinessPartnersAcl } from "./businessPartners.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { BusinessPartnersModels } from "./businessPartners.models";

export namespace BusinessPartnersQueries {
const paginate = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.BusinessPartnersPaginateResponseSchema },
    `/offices/${officeId}/business-partners`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO) => {
  return AppRestClient.post(
    { resSchema: BusinessPartnersModels.BusinessPartnerResponseDTOSchema },
    `/offices/${officeId}/business-partners`,
    ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRequestDTOSchema, data),
    
  );
};

const paginateLabels = (officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.BusinessPartnersPaginateLabelsResponseSchema },
    `/offices/${officeId}/business-partners/paginate/labels`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(BusinessPartnersModels.BusinessPartnersPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(BusinessPartnersModels.BusinessPartnerLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const getById = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}`,
    
  );
};

const update = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}`,
    ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRequestDTOSchema, data),
    
  );
};

const archive = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${id}/archive`,
    
  );
};

const unarchive = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${id}/unarchive`,
    
  );
};

const lock = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${id}/lock`,
    
  );
};

const unlock = (officeId: string, id: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${id}/unlock`,
    
  );
};

const getRemarks = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.GetRemarksResponseSchema },
    `/offices/${officeId}/business-partners/${id}/remarks`,
    
  );
};

const createRemark = (officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO) => {
  return AppRestClient.post(
    { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/remarks`,
    ZodExtended.parse(BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTOSchema, data),
    
  );
};

const updateRemark = (officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnersModels.BusinessPartnerRemarkResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
    ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDtoSchema, data),
    
  );
};

const deleteRemark = (officeId: string, id: string, remarkId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/business-partners/${id}/remarks/${remarkId}`,
    
  );
};

const getBasicInfo = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/basic`,
    
  );
};

const updateBasicInfo = (officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnersModels.BusinessPartnerBasicResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/basic`,
    ZodExtended.parse(BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTOSchema, data),
    
  );
};

const createSignatureUploadInstructions = (officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO) => {
  return AppRestClient.post(
    { resSchema: BusinessPartnersModels.BusinessPartnerSignatureUploadResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/basic/signature-upload`,
    ZodExtended.parse(BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTOSchema, data),
    
  );
};

const getCargoAgentInfo = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/cargo-agent`,
    
  );
};

const updateCargoAgent = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnersModels.CargoAgentResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/cargo-agent`,
    ZodExtended.parse(BusinessPartnersModels.UpdateCargoAgentDTOSchema, data),
    
  );
};

const getCarrierInformation = (officeId: string, id: string) => {
  return AppRestClient.get(
    { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/carrier`,
    
  );
};

const updateCarrier = (officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO) => {
  return AppRestClient.patch(
    { resSchema: BusinessPartnersModels.CarrierResponseDTOSchema },
    `/offices/${officeId}/business-partners/${id}/carrier`,
    ZodExtended.parse(BusinessPartnersModels.UpdateCarrierDTOSchema, data),
    
  );
};


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
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BusinessPartnersAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Create business partner
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { BusinessPartnersModels.CreateBusinessPartnerRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<BusinessPartnersModels.BusinessPartnerResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: BusinessPartnersModels.CreateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
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
export const usePaginateLabels = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginateLabels(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

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
export const usePaginateLabelsInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: BusinessPartnersModels.BusinessPartnerLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginateLabels, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateLabelsInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(BusinessPartnersAcl.canUsePaginateLabels({ officeId } ));
    return paginateLabels(officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Get business partner by ID
 * @permission Requires `canUseGetById` ability 
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerDetailResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetById = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof getById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getById(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetById({ officeId } ));
    return getById(officeId, id) },
    ...options,
  });
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
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdate({ officeId } ));
      return update(officeId, id, data)
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
export const useArchive = (options?: AppMutationOptions<typeof archive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseArchive({ officeId } ));
      return archive(officeId, id)
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
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseUnarchive({ officeId } ));
      return unarchive(officeId, id)
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
export const useLock = (options?: AppMutationOptions<typeof lock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseLock({ officeId } ));
      return lock(officeId, id)
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
export const useUnlock = (options?: AppMutationOptions<typeof unlock, { officeId: string, id: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id }) => { 
      checkAcl(BusinessPartnersAcl.canUseUnlock({ officeId } ));
      return unlock(officeId, id)
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
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.GetRemarksResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetRemarks = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof getRemarks, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getRemarks(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetRemarks({ officeId } ));
    return getRemarks(officeId, id) },
    ...options,
  });
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
export const useCreateRemark = (options?: AppMutationOptions<typeof createRemark, { officeId: string, id: string, data: BusinessPartnersModels.CreateBusinessPartnerRemarkRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreateRemark({ officeId } ));
      return createRemark(officeId, id, data)
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
export const useUpdateRemark = (options?: AppMutationOptions<typeof updateRemark, { officeId: string, id: string, remarkId: string, data: BusinessPartnersModels.UpdateBusinessPartnerRemarkRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, remarkId, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateRemark({ officeId } ));
      return updateRemark(officeId, id, remarkId, data)
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
export const useDeleteRemark = (options?: AppMutationOptions<typeof deleteRemark, { officeId: string, id: string, remarkId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, remarkId }) => { 
      checkAcl(BusinessPartnersAcl.canUseDeleteRemark({ officeId } ));
      return deleteRemark(officeId, id, remarkId)
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
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.BusinessPartnerBasicResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetBasicInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof getBasicInfo, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBasicInfo(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetBasicInfo({ officeId } ));
    return getBasicInfo(officeId, id) },
    ...options,
  });
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
export const useUpdateBasicInfo = (options?: AppMutationOptions<typeof updateBasicInfo, { officeId: string, id: string, data: BusinessPartnersModels.UpdateBusinessPartnerBasicRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateBasicInfo({ officeId } ));
      return updateBasicInfo(officeId, id, data)
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
export const useCreateSignatureUploadInstructions = (options?: AppMutationOptions<typeof createSignatureUploadInstructions, { officeId: string, id: string, data: BusinessPartnersModels.BusinessPartnerSignatureUploadRequestDTO, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, id, data, file, abortController, onUploadProgress }) => { 
      checkAcl(BusinessPartnersAcl.canUseCreateSignatureUploadInstructions({ officeId } ));
      const uploadInstructions = await createSignatureUploadInstructions(officeId, id, data);
      
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
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CargoAgentResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoAgentInfo = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof getCargoAgentInfo, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoAgentInfo(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetCargoAgentInfo({ officeId } ));
    return getCargoAgentInfo(officeId, id) },
    ...options,
  });
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
export const useUpdateCargoAgent = (options?: AppMutationOptions<typeof updateCargoAgent, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCargoAgentDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateCargoAgent({ officeId } ));
      return updateCargoAgent(officeId, id, data)
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
 * @param { string } officeId Path parameter
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<BusinessPartnersModels.CarrierResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCarrierInformation = <TData>({ officeId, id }: { officeId: string, id: string }, options?: AppQueryOptions<typeof getCarrierInformation, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCarrierInformation(officeId, id),
    queryFn: () => { 
    checkAcl(BusinessPartnersAcl.canUseGetCarrierInformation({ officeId } ));
    return getCarrierInformation(officeId, id) },
    ...options,
  });
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
export const useUpdateCarrier = (options?: AppMutationOptions<typeof updateCarrier, { officeId: string, id: string, data: BusinessPartnersModels.UpdateCarrierDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.BusinessPartners>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, id, data }) => { 
      checkAcl(BusinessPartnersAcl.canUseUpdateCarrier({ officeId } ));
      return updateCarrier(officeId, id, data)
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
