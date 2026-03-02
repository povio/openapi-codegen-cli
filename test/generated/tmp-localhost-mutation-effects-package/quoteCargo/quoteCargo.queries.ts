import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteCargoAcl } from "./quoteCargo.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteCargoModels } from "./quoteCargo.models";

export namespace QuoteCargoQueries {
const listCargosByQuoteId = (officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: QuoteCargoModels.ListCargosByQuoteIdResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos`,
    {
      params: {
        order: ZodExtended.parse(QuoteCargoModels.ListCargosByQuoteIdOrderParamSchema.optional(), order, { type: "query", name: "order" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const listCargoLabels = (officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteCargoModels.QuoteCargoListCargoLabelsResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/labels`,
    
  );
};

const getCargoSummary = (officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteCargoModels.QuoteCargoGetCargoSummaryResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/summary`,
    
  );
};

const getCargoById = (officeId: string, quoteId: string, cargoId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
    
  );
};

const updateCargo = (officeId: string, quoteId: string, cargoId: string, data: QuoteCargoModels.UpdatePositionCargoDTO) => {
  return AppRestClient.patch(
    { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
    ZodExtended.parse(QuoteCargoModels.UpdatePositionCargoDTOSchema, data),
    
  );
};

const deleteCargo = (officeId: string, quoteId: string, cargoId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}`,
    
  );
};

const createBulkCargos = (numberOfCargos: number, officeId: string, quoteId: string, data: QuoteCargoModels.CreatePositionCargoDTO) => {
  return AppRestClient.post(
    { resSchema: QuoteCargoModels.QuoteCargoCreateBulkCargosResponseSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/bulk/${numberOfCargos}`,
    ZodExtended.parse(QuoteCargoModels.CreatePositionCargoDTOSchema, data),
    
  );
};

const duplicateCargo = (officeId: string, quoteId: string, cargoId: string) => {
  return AppRestClient.post(
    { resSchema: QuoteCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/duplicate`,
    
  );
};


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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteId = <TData>({ officeId, quoteId, limit, order, page, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listCargosByQuoteId, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
    return listCargosByQuoteId(officeId, quoteId, limit, order, page, cursor) },
    ...options,
  });
};

/** 
 * Infinite query `useListCargosByQuoteIdInfinite
 * @summary List all cargo items for a quote
 * @permission Requires `canUseListCargosByQuoteId` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { QuoteCargoModels.ListCargosByQuoteIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<QuoteCargoModels.ListCargosByQuoteIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByQuoteIdInfinite = <TData>({ officeId, quoteId, limit, order, cursor }: { officeId: string, quoteId: string, limit: number, order?: QuoteCargoModels.ListCargosByQuoteIdOrderParam, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listCargosByQuoteId, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listCargosByQuoteIdInfinite(officeId, quoteId, limit, order, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(QuoteCargoAcl.canUseListCargosByQuoteId({ officeId } ));
    return listCargosByQuoteId(officeId, quoteId, limit, order, pageParam, cursor) },
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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoListCargoLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargoLabels = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof listCargoLabels, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargoLabels(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseListCargoLabels({ officeId } ));
    return listCargoLabels(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Query `useGetCargoSummary`
 * @summary Get cargo summary grouped by transport unit type
 * @permission Requires `canUseGetCargoSummary` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.QuoteCargoGetCargoSummaryResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoSummary = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof getCargoSummary, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoSummary(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseGetCargoSummary({ officeId } ));
    return getCargoSummary(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Query `useGetCargoById`
 * @summary Get a specific cargo item
 * @permission Requires `canUseGetCargoById` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoById = <TData>({ officeId, quoteId, cargoId }: { officeId: string, quoteId: string, cargoId: string }, options?: AppQueryOptions<typeof getCargoById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoById(officeId, quoteId, cargoId),
    queryFn: () => { 
    checkAcl(QuoteCargoAcl.canUseGetCargoById({ officeId } ));
    return getCargoById(officeId, quoteId, cargoId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateCargo`
 * @summary Update a cargo item
 * @permission Requires `canUseUpdateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { QuoteCargoModels.UpdatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargo = (options?: AppMutationOptions<typeof updateCargo, { officeId: string, quoteId: string, cargoId: string, data: QuoteCargoModels.UpdatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseUpdateCargo({ officeId } ));
      return updateCargo(officeId, quoteId, cargoId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteCargo = (options?: AppMutationOptions<typeof deleteCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDeleteCargo({ officeId } ));
      return deleteCargo(officeId, quoteId, cargoId)
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
 * Mutation `useCreateBulkCargos`
 * @summary Create a new cargo item
 * @permission Requires `canUseCreateBulkCargos` ability 
 * @param { number } numberOfCargos Path parameter
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteCargoModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.QuoteCargoCreateBulkCargosResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateBulkCargos = (options?: AppMutationOptions<typeof createBulkCargos, { numberOfCargos: number, officeId: string, quoteId: string, data: QuoteCargoModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ numberOfCargos, officeId, quoteId, data }) => { 
      checkAcl(QuoteCargoAcl.canUseCreateBulkCargos({ officeId } ));
      return createBulkCargos(numberOfCargos, officeId, quoteId, data)
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
 * Mutation `useDuplicateCargo`
 * @summary Duplicate a cargo item
 * @permission Requires `canUseDuplicateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateCargo = (options?: AppMutationOptions<typeof duplicateCargo, { officeId: string, quoteId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId }) => { 
      checkAcl(QuoteCargoAcl.canUseDuplicateCargo({ officeId } ));
      return duplicateCargo(officeId, quoteId, cargoId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, quoteId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, quoteId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
