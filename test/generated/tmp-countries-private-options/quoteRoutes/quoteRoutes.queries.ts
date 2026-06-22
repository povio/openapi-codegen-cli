import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteRoutesAcl } from "./quoteRoutes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { QuoteRoutesApi } from "./quoteRoutes.api";

export namespace QuoteRoutesQueries {
export const moduleName = QueryModule.QuoteRoutes;

export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/routes", officeId, quoteId] as const,
};

const listRoutesQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.listRoutes(officeId, quoteId),
  queryFn: () => QuoteRoutesApi.listRoutes(officeId, quoteId),
});

/** 
 * Query `useListRoutes`
 * @summary List routes with points for a quote
 * @permission Requires `canUseListRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteRoutesModels.RouteListResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useListRoutes = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteRoutesApi.listRoutes, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listRoutesQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuoteRoutesAcl.canUseListRoutes({ officeId } ));
      return listRoutesQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
  });
};

export const prefetchListRoutes = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listRoutesQueryOptions({ officeId, quoteId }), ...options });
};

/** 
 * Mutation `useCreateRoutePoint`
 * @summary Create a route point for a quote route
 * @permission Requires `canUseCreateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { QuoteRoutesModels.CreateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteRoutesModels.RoutePointResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.createRoutePoint, { officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCreateRoutePoint({ officeId } ));
      return QuoteRoutesApi.createRoutePoint(officeId, quoteId, routeId, data)
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
 * Mutation `useUpdateRoutePoint`
 * @summary Update a route point for a quote route
 * @permission Requires `canUseUpdateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { string } pointId Path parameter
 * @param { QuoteRoutesModels.UpdateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteRoutesModels.RoutePointResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.updateRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string, data: QuoteRoutesModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseUpdateRoutePoint({ officeId } ));
      return QuoteRoutesApi.updateRoutePoint(officeId, quoteId, routeId, pointId, data)
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
export const useDeleteRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.deleteRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId }) => { 
      checkAcl(QuoteRoutesAcl.canUseDeleteRoutePoint({ officeId } ));
      return QuoteRoutesApi.deleteRoutePoint(officeId, quoteId, routeId, pointId)
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
 * Mutation `useSplitRoutes`
 * @summary Split quote routes by cargo (sea only)
 * @permission Requires `canUseSplitRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useSplitRoutes = (options?: AppMutationOptions<typeof QuoteRoutesApi.splitRoutes, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuoteRoutesAcl.canUseSplitRoutes({ officeId } ));
      return QuoteRoutesApi.splitRoutes(officeId, quoteId)
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
 * Mutation `useMergeRoutes`
 * @summary Merge quote cargo routes into single route (sea only)
 * @permission Requires `canUseMergeRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteRoutesModels.MergeRoutesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMergeRoutes = (options?: AppMutationOptions<typeof QuoteRoutesApi.mergeRoutes, { officeId: string, quoteId: string, data: QuoteRoutesModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseMergeRoutes({ officeId } ));
      return QuoteRoutesApi.mergeRoutes(officeId, quoteId, data)
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
 * Mutation `useCopyRoute`
 * @summary Copy route points from one route to another (sea only)
 * @permission Requires `canUseCopyRoute` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } routeId Path parameter
 * @param { QuoteRoutesModels.CopyRouteRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useCopyRoute = (options?: AppMutationOptions<typeof QuoteRoutesApi.copyRoute, { officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCopyRoute({ officeId } ));
      return QuoteRoutesApi.copyRoute(officeId, quoteId, routeId, data)
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
