import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { AWBStocksAcl } from "./aWBStocks.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { AWBStocksModels } from "./aWBStocks.models";

export namespace AWBStocksQueries {
const paginate = (officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: AWBStocksModels.AWBStocksPaginateResponseSchema },
    `/offices/${officeId}/awb-stocks`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(AWBStocksModels.AWBStocksPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(AWBStocksModels.AWBStockFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const create = (officeId: string, data: AWBStocksModels.CreateAWBStockRequestDTO) => {
  return AppRestClient.post(
    { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
    `/offices/${officeId}/awb-stocks`,
    ZodExtended.parse(AWBStocksModels.CreateAWBStockRequestDTOSchema, data),
    
  );
};

const findById = (stockId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
    `/offices/${officeId}/awb-stocks/${stockId}`,
    
  );
};

const update = (stockId: string, officeId: string, data: AWBStocksModels.UpdateAWBStockRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
    `/offices/${officeId}/awb-stocks/${stockId}`,
    ZodExtended.parse(AWBStocksModels.UpdateAWBStockRequestDTOSchema, data),
    
  );
};

const archive = (stockId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
    `/offices/${officeId}/awb-stocks/${stockId}/archive`,
    
  );
};

const unarchive = (stockId: string, officeId: string) => {
  return AppRestClient.post(
    { resSchema: AWBStocksModels.AWBStockResponseDTOSchema },
    `/offices/${officeId}/awb-stocks/${stockId}/unarchive`,
    
  );
};

const generateNextNumber = (officeId: string, data: AWBStocksModels.GenerateAWBNumberRequestDTO) => {
  return AppRestClient.post(
    { resSchema: AWBStocksModels.GenerateAWBNumberResponseDTOSchema },
    `/offices/${officeId}/awb-stocks/generate-number`,
    ZodExtended.parse(AWBStocksModels.GenerateAWBNumberRequestDTOSchema, data),
    
  );
};


export const moduleName = QueryModule.AWBStocks;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/awb-stocks", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/awb-stocks", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (stockId: string, officeId: string) => [...keys.all, "/offices/:officeId/awb-stocks/:stockId", stockId, officeId] as const,
};

/** 
 * Query `usePaginate`
 * @summary List AWB stocks
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, updatedAt, createdBy, updatedBy, carrierName, startNumber, priority. Example: `createdAt`
 * @param { AWBStocksModels.AWBStockFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AWBStocksModels.AWBStocksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(AWBStocksAcl.canUsePaginate({ officeId } ));
    return paginate(officeId, limit, order, filter, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `usePaginateInfinite
 * @summary List AWB stocks
 * @permission Requires `canUsePaginate` ability 
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, updatedAt, createdBy, updatedBy, carrierName, startNumber, priority. Example: `createdAt`
 * @param { AWBStocksModels.AWBStockFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<AWBStocksModels.AWBStocksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(AWBStocksAcl.canUsePaginate({ officeId } ));
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
 * @summary Create AWB stock
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { AWBStocksModels.CreateAWBStockRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: AWBStocksModels.CreateAWBStockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
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
 * @summary Get AWB stock details
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.stockId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ stockId, officeId }: { stockId: string, officeId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(stockId, officeId),
    queryFn: () => { 
    checkAcl(AWBStocksAcl.canUseFindById({ officeId } ));
    return findById(stockId, officeId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update AWB stock comments
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.stockId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AWBStocksModels.UpdateAWBStockRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { stockId: string, officeId: string, data: AWBStocksModels.UpdateAWBStockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseUpdate({ officeId } ));
      return update(stockId, officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { stockId, officeId } = variables;
      const updateKeys = [keys.findById(stockId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive AWB stock
 * @permission Requires `canUseArchive` ability 
 * @param { string } mutation.stockId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { stockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId }) => { 
      checkAcl(AWBStocksAcl.canUseArchive({ officeId } ));
      return archive(stockId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { stockId, officeId } = variables;
      const updateKeys = [keys.findById(stockId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive AWB stock
 * @permission Requires `canUseUnarchive` ability 
 * @param { string } mutation.stockId Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { stockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId }) => { 
      checkAcl(AWBStocksAcl.canUseUnarchive({ officeId } ));
      return unarchive(stockId, officeId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { stockId, officeId } = variables;
      const updateKeys = [keys.findById(stockId, officeId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateNextNumber`
 * @summary Generate next AWB number for carrier
 * @permission Requires `canUseGenerateNextNumber` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { AWBStocksModels.GenerateAWBNumberRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.GenerateAWBNumberResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useGenerateNextNumber = (options?: AppMutationOptions<typeof generateNextNumber, { officeId: string, data: AWBStocksModels.GenerateAWBNumberRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseGenerateNextNumber({ officeId } ));
      return generateNextNumber(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
