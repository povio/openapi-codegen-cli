import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteRoutesAcl } from "./quoteRoutes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteRoutesModels } from "./quoteRoutes.models";

export namespace QuoteRoutesQueries {
const listRoutes = (officeId: string, quoteId: string) => {
  return AppRestClient.get(
    { resSchema: QuoteRoutesModels.RouteListResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/routes`,
    
  );
};

const createRoutePoint = (officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CreateRoutePointRequestDto) => {
  return AppRestClient.post(
    { resSchema: QuoteRoutesModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points`,
    ZodExtended.parse(QuoteRoutesModels.CreateRoutePointRequestDtoSchema, data),
    
  );
};

const updateRoutePoint = (officeId: string, quoteId: string, routeId: string, pointId: string, data: QuoteRoutesModels.UpdateRoutePointRequestDto) => {
  return AppRestClient.patch(
    { resSchema: QuoteRoutesModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points/${pointId}`,
    ZodExtended.parse(QuoteRoutesModels.UpdateRoutePointRequestDtoSchema, data),
    
  );
};

const deleteRoutePoint = (officeId: string, quoteId: string, routeId: string, pointId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points/${pointId}`,
    
  );
};

const splitRoutes = (officeId: string, quoteId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/routes/split`,
    
  );
};

const mergeRoutes = (officeId: string, quoteId: string, data: QuoteRoutesModels.MergeRoutesRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/routes/merge`,
    ZodExtended.parse(QuoteRoutesModels.MergeRoutesRequestDtoSchema, data),
    
  );
};

const copyRoute = (officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CopyRouteRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/copy`,
    ZodExtended.parse(QuoteRoutesModels.CopyRouteRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.QuoteRoutes;

export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/routes", officeId, quoteId] as const,
};

/** 
 * Query `useListRoutes`
 * @summary List routes with points for a quote
 * @permission Requires `canUseListRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.RouteListResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useListRoutes = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof listRoutes, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoutes(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteRoutesAcl.canUseListRoutes({ officeId } ));
    return listRoutes(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateRoutePoint`
 * @summary Create a route point for a quote route
 * @permission Requires `canUseCreateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { CommonModels.CreateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof createRoutePoint, { officeId: string, quoteId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCreateRoutePoint({ officeId } ));
      return createRoutePoint(officeId, quoteId, routeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUpdateRoutePoint`
 * @summary Update a route point for a quote route
 * @permission Requires `canUseUpdateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { string } pointId Path parameter
 * @param { CommonModels.UpdateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof updateRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseUpdateRoutePoint({ officeId } ));
      return updateRoutePoint(officeId, quoteId, routeId, pointId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteRoutePoint`
 * @summary Delete a route point from a quote route
 * @permission Requires `canUseDeleteRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { string } pointId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteRoutePoint = (options?: AppMutationOptions<typeof deleteRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId }) => { 
      checkAcl(QuoteRoutesAcl.canUseDeleteRoutePoint({ officeId } ));
      return deleteRoutePoint(officeId, quoteId, routeId, pointId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useSplitRoutes`
 * @summary Split quote routes by cargo (sea only)
 * @permission Requires `canUseSplitRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useSplitRoutes = (options?: AppMutationOptions<typeof splitRoutes, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuoteRoutesAcl.canUseSplitRoutes({ officeId } ));
      return splitRoutes(officeId, quoteId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useMergeRoutes`
 * @summary Merge quote cargo routes into single route (sea only)
 * @permission Requires `canUseMergeRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { CommonModels.MergeRoutesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMergeRoutes = (options?: AppMutationOptions<typeof mergeRoutes, { officeId: string, quoteId: string, data: CommonModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseMergeRoutes({ officeId } ));
      return mergeRoutes(officeId, quoteId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCopyRoute`
 * @summary Copy route points from one route to another (sea only)
 * @permission Requires `canUseCopyRoute` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { CommonModels.CopyRouteRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useCopyRoute = (options?: AppMutationOptions<typeof copyRoute, { officeId: string, quoteId: string, routeId: string, data: CommonModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCopyRoute({ officeId } ));
      return copyRoute(officeId, quoteId, routeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
