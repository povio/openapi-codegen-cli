import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionRoutesAcl } from "./positionRoutes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { PositionRoutesApi } from "./positionRoutes.api";

export namespace PositionRoutesQueries {
export const moduleName = QueryModule.PositionRoutes;

export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/routes", officeId, positionId] as const,
};

export const listRoutesQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.listRoutes(officeId, positionId),
  queryFn: () => PositionRoutesApi.listRoutes(officeId, positionId),
});

/** 
 * Query `useListRoutes`
 * @summary List routes with points for a position (unified for sea/air/road)
 * @permission Requires `canUseListRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionRoutesModels.RouteListResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useListRoutes = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionRoutesApi.listRoutes, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listRoutesQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionRoutesAcl.canUseListRoutes({ officeId } ));
      return listRoutesQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
  });
};

export const prefetchListRoutes = (queryClient: QueryClient, { officeId, positionId }: { officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...listRoutesQueryOptions({ officeId, positionId }), ...options });
};

/** 
 * Mutation `useCreateRoutePoint`
 * @summary Create a route point
 * @permission Requires `canUseCreateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } routeId Path parameter
 * @param { PositionRoutesModels.CreateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionRoutesModels.RoutePointResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof PositionRoutesApi.createRoutePoint, { officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseCreateRoutePoint({ officeId } ));
      return PositionRoutesApi.createRoutePoint(officeId, positionId, routeId, data)
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
 * @summary Update a route point
 * @permission Requires `canUseUpdateRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } routeId Path parameter
 * @param { string } pointId Path parameter
 * @param { PositionRoutesModels.UpdateRoutePointRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionRoutesModels.RoutePointResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof PositionRoutesApi.updateRoutePoint, { officeId: string, positionId: string, routeId: string, pointId: string, data: PositionRoutesModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, pointId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseUpdateRoutePoint({ officeId } ));
      return PositionRoutesApi.updateRoutePoint(officeId, positionId, routeId, pointId, data)
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
 * @summary Delete a route point
 * @permission Requires `canUseDeleteRoutePoint` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } routeId Path parameter
 * @param { string } pointId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteRoutePoint = (options?: AppMutationOptions<typeof PositionRoutesApi.deleteRoutePoint, { officeId: string, positionId: string, routeId: string, pointId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, pointId }) => { 
      checkAcl(PositionRoutesAcl.canUseDeleteRoutePoint({ officeId } ));
      return PositionRoutesApi.deleteRoutePoint(officeId, positionId, routeId, pointId)
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
 * @summary Split routes by cargo (sea positions only)
 * @permission Requires `canUseSplitRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useSplitRoutes = (options?: AppMutationOptions<typeof PositionRoutesApi.splitRoutes, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionRoutesAcl.canUseSplitRoutes({ officeId } ));
      return PositionRoutesApi.splitRoutes(officeId, positionId)
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
 * @summary Merge routes (sea positions only)
 * @permission Requires `canUseMergeRoutes` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionRoutesModels.MergeRoutesRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useMergeRoutes = (options?: AppMutationOptions<typeof PositionRoutesApi.mergeRoutes, { officeId: string, positionId: string, data: PositionRoutesModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseMergeRoutes({ officeId } ));
      return PositionRoutesApi.mergeRoutes(officeId, positionId, data)
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
 * @summary Copy route points to another route (sea positions only)
 * @permission Requires `canUseCopyRoute` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } routeId Path parameter
 * @param { PositionRoutesModels.CopyRouteRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useCopyRoute = (options?: AppMutationOptions<typeof PositionRoutesApi.copyRoute, { officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionRoutes>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseCopyRoute({ officeId } ));
      return PositionRoutesApi.copyRoute(officeId, positionId, routeId, data)
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
