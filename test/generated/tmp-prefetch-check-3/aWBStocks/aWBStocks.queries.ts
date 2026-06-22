import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { AWBStocksAcl } from "./aWBStocks.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { AWBStocksModels } from "./aWBStocks.models";
import { AWBStocksApi } from "./aWBStocks.api";

export namespace AWBStocksQueries {
export const moduleName = QueryModule.AWBStocks;

export const keys = {
    all: [moduleName] as const,
    paginate: (officeId: string, limit?: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/awb-stocks", officeId, limit, order, filter, page, cursor] as const,
    paginateInfinite: (officeId: string, limit?: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/awb-stocks", "infinite", officeId, limit, order, filter, cursor] as const,
    findById: (stockId: string, officeId: string) => [...keys.all, "/offices/:officeId/awb-stocks/:stockId", stockId, officeId] as const,
};

export const paginateQueryOptions = ({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.paginate(officeId, limit, order, filter, page, cursor),
  queryFn: () => AWBStocksApi.paginate(officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `usePaginate`
 * @summary List AWB stocks
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, updatedAt, createdBy, updatedBy, carrierName, startNumber, priority. Example: `createdAt`
 * @param { AWBStocksModels.AWBStockFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AWBStocksModels.AWBStocksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginate = <TData>({ officeId, limit, order, filter, page, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof AWBStocksApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...paginateQueryOptions({ officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(AWBStocksAcl.canUsePaginate({ officeId } ));
      return paginateQueryOptions({ officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const paginateInfiniteQueryOptions = ({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, cursor?: string }) => ({
  queryKey: keys.paginateInfinite(officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => AWBStocksApi.paginate(officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `usePaginateInfinite
 * @summary List AWB stocks
 * @permission Requires `canUsePaginate` ability 
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): createdAt, updatedAt, createdBy, updatedBy, carrierName, startNumber, priority. Example: `createdAt`
 * @param { AWBStocksModels.AWBStockFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<AWBStocksModels.AWBStocksPaginateResponse> } 
 * @statusCodes [200, 401]
 */
export const usePaginateInfinite = <TData>({ officeId, limit, order, filter, cursor }: { officeId: string, limit: number, order?: string, filter?: AWBStocksModels.AWBStockFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof AWBStocksApi.paginate, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(AWBStocksAcl.canUsePaginate({ officeId } ));
      return paginateInfiniteQueryOptions({ officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreate`
 * @summary Create AWB stock
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { AWBStocksModels.CreateAWBStockRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof AWBStocksApi.create, { officeId: string, data: AWBStocksModels.CreateAWBStockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.AWBStocks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseCreate({ officeId } ));
      return AWBStocksApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const findByIdQueryOptions = ({ stockId, officeId }: { stockId: string, officeId: string }) => ({
  queryKey: keys.findById(stockId, officeId),
  queryFn: () => AWBStocksApi.findById(stockId, officeId),
});

/** 
 * Query `useFindById`
 * @summary Get AWB stock details
 * @permission Requires `canUseFindById` ability 
 * @param { string } stockId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ stockId, officeId }: { stockId: string, officeId: string }, options?: AppQueryOptions<typeof AWBStocksApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ stockId, officeId }),
    queryFn: async () => {
    checkAcl(AWBStocksAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ stockId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update AWB stock comments
 * @permission Requires `canUseUpdate` ability 
 * @param { string } stockId Path parameter
 * @param { string } officeId Path parameter
 * @param { AWBStocksModels.UpdateAWBStockRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof AWBStocksApi.update, { stockId: string, officeId: string, data: AWBStocksModels.UpdateAWBStockRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.AWBStocks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseUpdate({ officeId } ));
      return AWBStocksApi.update(stockId, officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } stockId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof AWBStocksApi.archive, { stockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.AWBStocks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId }) => { 
      checkAcl(AWBStocksAcl.canUseArchive({ officeId } ));
      return AWBStocksApi.archive(stockId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } stockId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.AWBStockResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof AWBStocksApi.unarchive, { stockId: string, officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.AWBStocks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ stockId, officeId }) => { 
      checkAcl(AWBStocksAcl.canUseUnarchive({ officeId } ));
      return AWBStocksApi.unarchive(stockId, officeId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } officeId Path parameter
 * @param { AWBStocksModels.GenerateAWBNumberRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AWBStocksModels.GenerateAWBNumberResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useGenerateNextNumber = (options?: AppMutationOptions<typeof AWBStocksApi.generateNextNumber, { officeId: string, data: AWBStocksModels.GenerateAWBNumberRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.AWBStocks>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(AWBStocksAcl.canUseGenerateNextNumber({ officeId } ));
      return AWBStocksApi.generateNextNumber(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
