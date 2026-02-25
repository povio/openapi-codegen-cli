import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteCargoAcl } from "./quoteCargo.acl";
import { AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteCargoModels } from "./quoteCargo.models";
import { CommonModels } from "@/data/common/common.models";
import { QuoteCargoApi } from "./quoteCargo.api";

export namespace QuoteCargoQueries {
export const moduleName = QueryModule.QuoteCargo;

export const keys = {
    all: [moduleName] as const,
    listCargosByQuoteId: (officeId: string, quoteId: string, limit?: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos", officeId, quoteId, limit, order, page, cursor] as const,
    listCargosByQuoteIdInfinite: (officeId: string, quoteId: string, limit?: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos", "infinite", officeId, quoteId, limit, order, cursor] as const,
    listCargoLabels: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/labels", officeId, quoteId] as const,
    getCargoSummary: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/summary", officeId, quoteId] as const,
    getCargoById: (officeId: string, quoteId: string, cargoId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/cargos/:cargoId", officeId, quoteId, cargoId] as const,
};

/** 
 * Query `useListCargosByQuoteId`
 * @summary List all cargo items for a quote
 * @permission Requires `canUseListCargosByQuoteId` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } object.order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteId = <TData>({ officeId, quoteId, limit, order, page, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string }, options?: AppQueryOptions<typeof QuoteCargoApi.listCargosByQuoteId, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
    return QuoteCargoApi.listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor, config) },
    ...options,
  });
};

/** 
 * Infinite query `useListCargosByQuoteIdInfinite
 * @summary List all cargo items for a quote
 * @permission Requires `canUseListCargosByQuoteId` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } object.order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteIdInfinite = <TData>({ officeId, quoteId, limit, order, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string }, options?: AppInfiniteQueryOptions<typeof QuoteCargoApi.listCargosByQuoteId, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listCargosByQuoteIdInfinite(officeId, quoteId, limit, order, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
    return QuoteCargoApi.listCargosByQuoteId(officeId, quoteId, limit, order, pageParam, cursor, config) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useListCargoLabels`
 * @summary List all cargo labels for a quote
 * @permission Requires `canUseListCargoLabels` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoListCargoLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargoLabels = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.listCargoLabels, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargoLabels(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseListCargoLabels({ officeId } ));
    return QuoteCargoApi.listCargoLabels(officeId, quoteId, config) },
    ...options,
  });
};

/** 
 * Query `useGetCargoSummary`
 * @summary Get cargo summary grouped by transport unit type
 * @permission Requires `canUseGetCargoSummary` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoGetCargoSummaryResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoSummary = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.getCargoSummary, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoSummary(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseGetCargoSummary({ officeId } ));
    return QuoteCargoApi.getCargoSummary(officeId, quoteId, config) },
    ...options,
  });
};

/** 
 * Query `useGetCargoById`
 * @summary Get a specific cargo item
 * @permission Requires `canUseGetCargoById` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { string } object.cargoId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoById = <TData>({ officeId, quoteId, cargoId }: { officeId: string, quoteId: string, cargoId: string }, options?: AppQueryOptions<typeof QuoteCargoApi.getCargoById, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoById(officeId, quoteId, cargoId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseGetCargoById({ officeId } ));
    return QuoteCargoApi.getCargoById(officeId, quoteId, cargoId, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateCargo`
 * @summary Update a cargo item
 * @permission Requires `canUseUpdateCargo` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { CommonModels.UpdatePositionCargoDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.updateCargo, { officeId: string, quoteId: string, cargoId: string, data: CommonModels.UpdatePositionCargoDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseUpdateCargo({ officeId } ));
      return QuoteCargoApi.updateCargo(officeId, quoteId, cargoId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, quoteId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteCargo`
 * @summary Delete a cargo item
 * @permission Requires `canUseDeleteCargo` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.deleteCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDeleteCargo({ officeId } ));
      return QuoteCargoApi.deleteCargo(officeId, quoteId, cargoId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCreateBulkCargos`
 * @summary Create a new cargo item
 * @permission Requires `canUseCreateBulkCargos` ability 
 * @param { number } mutation.numberOfCargos Path parameter
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { CommonModels.CreatePositionCargoDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.QuoteCargoCreateBulkCargosResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateBulkCargos = (options?: AppMutationOptions<typeof QuoteCargoApi.createBulkCargos, { numberOfCargos: number, officeId: string, quoteId: string, data: CommonModels.CreatePositionCargoDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ numberOfCargos, officeId, quoteId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseCreateBulkCargos({ officeId } ));
      return QuoteCargoApi.createBulkCargos(numberOfCargos, officeId, quoteId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDuplicateCargo`
 * @summary Duplicate a cargo item
 * @permission Requires `canUseDuplicateCargo` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateCargo = (options?: AppMutationOptions<typeof QuoteCargoApi.duplicateCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDuplicateCargo({ officeId } ));
      return QuoteCargoApi.duplicateCargo(officeId, quoteId, cargoId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, quoteId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
