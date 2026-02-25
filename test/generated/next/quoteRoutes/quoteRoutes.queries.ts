import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteRoutesAcl } from "./quoteRoutes.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { QuoteRoutesApi } from "./quoteRoutes.api";

export namespace QuoteRoutesQueries {
export const moduleName = QueryModule.QuoteRoutes;

export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/routes", officeId, quoteId] as const,
};

/** 
 * Query `useListRoutes`
 * @summary List routes with points for a quote
 * @permission Requires `canUseListRoutes` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.RouteListResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useListRoutes = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteRoutesApi.listRoutes, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoutes(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteRoutesAcl.canUseListRoutes({ officeId } ));
    return QuoteRoutesApi.listRoutes(officeId, quoteId) },
    ...options,
  });
};

/** 
 * Mutation `useCreateRoutePoint`
 * @summary Create a route point for a quote route
 * @permission Requires `canUseCreateRoutePoint` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { CommonModels.CreateRoutePointRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.createRoutePoint, { officeId: string, quoteId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCreateRoutePoint({ officeId } ));
      return QuoteRoutesApi.createRoutePoint(officeId, quoteId, routeId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { string } mutation.pointId Path parameter
 * @param { CommonModels.UpdateRoutePointRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.updateRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseUpdateRoutePoint({ officeId } ));
      return QuoteRoutesApi.updateRoutePoint(officeId, quoteId, routeId, pointId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { string } mutation.pointId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteRoutePoint = (options?: AppMutationOptions<typeof QuoteRoutesApi.deleteRoutePoint, { officeId: string, quoteId: string, routeId: string, pointId: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, pointId }) => { 
      checkAcl(QuoteRoutesAcl.canUseDeleteRoutePoint({ officeId } ));
      return QuoteRoutesApi.deleteRoutePoint(officeId, quoteId, routeId, pointId)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useSplitRoutes = (options?: AppMutationOptions<typeof QuoteRoutesApi.splitRoutes, { officeId: string, quoteId: string }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId }) => { 
      checkAcl(QuoteRoutesAcl.canUseSplitRoutes({ officeId } ));
      return QuoteRoutesApi.splitRoutes(officeId, quoteId)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { CommonModels.MergeRoutesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMergeRoutes = (options?: AppMutationOptions<typeof QuoteRoutesApi.mergeRoutes, { officeId: string, quoteId: string, data: CommonModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseMergeRoutes({ officeId } ));
      return QuoteRoutesApi.mergeRoutes(officeId, quoteId, data)
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { CommonModels.CopyRouteRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useCopyRoute = (options?: AppMutationOptions<typeof QuoteRoutesApi.copyRoute, { officeId: string, quoteId: string, routeId: string, data: CommonModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, routeId, data }) => { 
      checkAcl(QuoteRoutesAcl.canUseCopyRoute({ officeId } ));
      return QuoteRoutesApi.copyRoute(officeId, quoteId, routeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
