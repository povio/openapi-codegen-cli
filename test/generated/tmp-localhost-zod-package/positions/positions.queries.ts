import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionsAcl } from "./positions.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionsModels } from "./positions.models";

export namespace PositionsQueries {
const findAll = (officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.PositionsFindAllResponseSchema },
    `/offices/${officeId}/positions/labels`,
    {
      params: {
        filter: ZodExtended.parse(PositionsModels.PositionLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const paginate = (officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.PositionsPaginateResponseSchema },
    `/offices/${officeId}/positions`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(PositionsModels.PositionsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(PositionsModels.PositionFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: PositionsModels.CreatePositionRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions`,
    ZodExtended.parse(PositionsModels.CreatePositionRequestDtoSchema, data),
    
  );
};

const totalProfit = (officeId: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.TotalProfitResponseSchema },
    `/offices/${officeId}/positions/fake-total-profit`,
    
  );
};

const listAvailablePartnersFor = (officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.PositionsListAvailablePartnersForResponseSchema },
    `/offices/${officeId}/positions/${positionId}/available-partners`,
    {
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        useCase: ZodExtended.parse(PositionsModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
      },
    }
  );
};

const exportPositions = (officeId: string, data: PositionsModels.PositionExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/positions/exports`,
    ZodExtended.parse(PositionsModels.PositionExportRequestDtoSchema, data),
    {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const get = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}`,
    
  );
};

const update = (officeId: string, positionId: string, data: PositionsModels.UpdatePositionDto) => {
  return AppRestClient.patch(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}`,
    ZodExtended.parse(PositionsModels.UpdatePositionDtoSchema, data),
    
  );
};

const listRouteLabels = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.ListRouteLabelsResponseSchema },
    `/offices/${officeId}/positions/${positionId}/routes/labels`,
    
  );
};

const getDuplicateDefaultParameters = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.DuplicatePositionDefaultParametersResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/duplicate/default-parameters`,
    
  );
};

const duplicate = (officeId: string, positionId: string, data: PositionsModels.DuplicatePositionRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/duplicate`,
    ZodExtended.parse(PositionsModels.DuplicatePositionRequestDtoSchema, data),
    
  );
};

const cancel = (officeId: string, positionId: string) => {
  return AppRestClient.post(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/cancel`,
    
  );
};

const revertCancel = (officeId: string, positionId: string) => {
  return AppRestClient.post(
    { resSchema: PositionsModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/uncancel`,
    
  );
};

const linkChild = (officeId: string, positionId: string, data: PositionsModels.LinkChildPositionsRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/children`,
    ZodExtended.parse(PositionsModels.LinkChildPositionsRequestDtoSchema, data),
    
  );
};

const unlinkChild = (officeId: string, positionId: string, data: PositionsModels.UnlinkChildPositionsRequestDto) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/children`,
    ZodExtended.parse(PositionsModels.UnlinkChildPositionsRequestDtoSchema, data),
    
  );
};

const listChild = (officeId: string, positionId: string, limit: number, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PositionsModels.ListChildResponseSchema },
    `/offices/${officeId}/positions/${positionId}/children`,
    {
      params: {
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};


export const moduleName = QueryModule.Positions;

export const keys = {
    all: [moduleName] as const,
    findAll: (officeId: string, limit?: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/labels", officeId, limit, filter, page, cursor] as const,
    findAllInfinite: (officeId: string, limit?: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/labels", "infinite", officeId, limit, filter, cursor] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions", "infinite", officeId, limit, order, filter, cursor] as const,
    totalProfit: (officeId: string) => [...keys.all, "/offices/:officeId/positions/fake-total-profit", officeId] as const,
    listAvailablePartnersFor: (officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase) => [...keys.all, "/offices/:officeId/positions/:positionId/available-partners", officeId, positionId, search, useCase] as const,
    get: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId", officeId, positionId] as const,
    listRouteLabels: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/routes/labels", officeId, positionId] as const,
    getDuplicateDefaultParameters: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/duplicate/default-parameters", officeId, positionId] as const,
    listChild: (officeId: string, positionId: string, limit?: number, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/children", officeId, positionId, limit, page, cursor] as const,
    listChildInfinite: (officeId: string, positionId: string, limit?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/children", "infinite", officeId, positionId, limit, cursor] as const,
};

/** 
 * Query `useFindAll`
 * @summary List all positions with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionsModels.PositionLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ officeId, limit, filter, page, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findAll(officeId, limit, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseFindAll({ officeId } ));
    return findAll(officeId, limit, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @summary List all positions with only their labels
 * @permission Requires `canUseFindAll` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionsModels.PositionLabelsFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.PositionsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ officeId, limit, filter, cursor }: { officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findAll, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.findAllInfinite(officeId, limit, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionsAcl.canUseFindAll({ officeId } ));
    return findAll(officeId, limit, filter, pageParam, cursor) },
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
 * @summary List positions
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number`
 * @param { PositionsModels.PositionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary List positions
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number`
 * @param { PositionsModels.PositionFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.PositionsPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionsAcl.canUsePaginate({ officeId } ));
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
 * @summary Create position
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { PositionsModels.CreatePositionRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position created successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: PositionsModels.CreatePositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PositionsAcl.canUseCreate({ officeId } ));
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
 * Query `useTotalProfit`
 * @summary List positions
 * @permission Requires `canUseTotalProfit` ability 
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.TotalProfitResponse> } 
 * @statusCodes [200, 401]
 */
export const useTotalProfit = <TData>({ officeId }: { officeId: string }, options?: AppQueryOptions<typeof totalProfit, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.totalProfit(officeId),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseTotalProfit({ officeId } ));
    return totalProfit(officeId) },
    ...options,
  });
};

/** 
 * Query `useListAvailablePartnersFor`
 * @summary List available business partners for a position
 * @permission Requires `canUseListAvailablePartnersFor` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } search Query parameter
 * @param { PositionsModels.PositionAvailablePartnersUseCase } useCase Query parameter. When provided and office toggle is enabled, restrict available partners to finance relationships (customer/vendor).
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionsListAvailablePartnersForResponse> } 
 * @statusCodes [200, 401]
 */
export const useListAvailablePartnersFor = <TData>({ officeId, positionId, search, useCase }: { officeId: string, positionId: string, search?: string, useCase?: PositionsModels.PositionAvailablePartnersUseCase }, options?: AppQueryOptions<typeof listAvailablePartnersFor, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listAvailablePartnersFor(officeId, positionId, search, useCase),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseListAvailablePartnersFor({ officeId } ));
    return listAvailablePartnersFor(officeId, positionId, search, useCase) },
    ...options,
  });
};

/** 
 * Mutation `useExportPositions` - recommended when file should not be cached
 * @summary Export positions to Excel
 * @permission Requires `canUseExportPositions` ability 
 * @param { string } officeId Path parameter
 * @param { PositionsModels.PositionExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useExportPositions = (options?: AppMutationOptions<typeof exportPositions, { officeId: string, data: PositionsModels.PositionExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(PositionsAcl.canUseExportPositions({ officeId } ));
      return exportPositions(officeId, data)
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
 * Query `useGet`
 * @summary Get position by ID
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.PositionCoreResponseDto> } Position retrieved successfully
 * @statusCodes [200, 401, 403, 404]
 */
export const useGet = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseGet({ officeId } ));
    return get(officeId, positionId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update position
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.UpdatePositionDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position updated successfully
 * @statusCodes [200, 400, 401, 404]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, positionId: string, data: PositionsModels.UpdatePositionDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseUpdate({ officeId } ));
      return update(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useListRouteLabels`
 * @summary List all route labels for a position
 * @permission Requires `canUseListRouteLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.ListRouteLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListRouteLabels = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof listRouteLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRouteLabels(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseListRouteLabels({ officeId } ));
    return listRouteLabels(officeId, positionId) },
    ...options,
  });
};

/** 
 * Query `useGetDuplicateDefaultParameters`
 * @summary Get default duplication parameters for a position
 * @permission Requires `canUseGetDuplicateDefaultParameters` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.DuplicatePositionDefaultParametersResponseDto> } Default parameters and suggested estimated service date
 * @statusCodes [200, 401, 404]
 */
export const useGetDuplicateDefaultParameters = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof getDuplicateDefaultParameters, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getDuplicateDefaultParameters(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseGetDuplicateDefaultParameters({ officeId } ));
    return getDuplicateDefaultParameters(officeId, positionId) },
    ...options,
  });
};

/** 
 * Mutation `useDuplicate`
 * @summary Duplicate position
 * @permission Requires `canUseDuplicate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.DuplicatePositionRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position duplicated successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useDuplicate = (options?: AppMutationOptions<typeof duplicate, { officeId: string, positionId: string, data: PositionsModels.DuplicatePositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseDuplicate({ officeId } ));
      return duplicate(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCancel`
 * @summary Cancel position
 * @permission Requires `canUseCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position cancelled successfully
 * @statusCodes [200, 400, 401, 403, 404]
 */
export const useCancel = (options?: AppMutationOptions<typeof cancel, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionsAcl.canUseCancel({ officeId } ));
      return cancel(officeId, positionId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRevertCancel`
 * @summary Revert cancelled position (accounting)
 * @permission Requires `canUseRevertCancel` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionsModels.PositionCoreResponseDto> } Position reverted successfully
 * @statusCodes [200, 400, 401, 403, 404]
 */
export const useRevertCancel = (options?: AppMutationOptions<typeof revertCancel, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionsAcl.canUseRevertCancel({ officeId } ));
      return revertCancel(officeId, positionId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useLinkChild`
 * @summary Link child positions to parent
 * @permission Requires `canUseLinkChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.LinkChildPositionsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useLinkChild = (options?: AppMutationOptions<typeof linkChild, { officeId: string, positionId: string, data: PositionsModels.LinkChildPositionsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseLinkChild({ officeId } ));
      return linkChild(officeId, positionId, data)
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
 * Mutation `useUnlinkChild`
 * @summary Unlink child positions from parent
 * @permission Requires `canUseUnlinkChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionsModels.UnlinkChildPositionsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUnlinkChild = (options?: AppMutationOptions<typeof unlinkChild, { officeId: string, positionId: string, data: PositionsModels.UnlinkChildPositionsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionsAcl.canUseUnlinkChild({ officeId } ));
      return unlinkChild(officeId, positionId, data)
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
 * Query `useListChild`
 * @summary Get child positions for parent
 * @permission Requires `canUseListChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionsModels.ListChildResponse> } 
 * @statusCodes [200, 401]
 */
export const useListChild = <TData>({ officeId, positionId, limit, page, cursor }: { officeId: string, positionId: string, limit: number, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listChild, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listChild(officeId, positionId, limit, page, cursor),
    queryFn: () => { 
    checkAcl(PositionsAcl.canUseListChild({ officeId } ));
    return listChild(officeId, positionId, limit, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListChildInfinite
 * @summary Get child positions for parent
 * @permission Requires `canUseListChild` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionsModels.ListChildResponse> } 
 * @statusCodes [200, 401]
 */
export const useListChildInfinite = <TData>({ officeId, positionId, limit, cursor }: { officeId: string, positionId: string, limit: number, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listChild, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listChildInfinite(officeId, positionId, limit, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionsAcl.canUseListChild({ officeId } ));
    return listChild(officeId, positionId, limit, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

}
