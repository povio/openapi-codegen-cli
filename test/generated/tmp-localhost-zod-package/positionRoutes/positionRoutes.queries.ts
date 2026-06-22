import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionRoutesAcl } from "./positionRoutes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionRoutesModels } from "./positionRoutes.models";

export namespace PositionRoutesQueries {
const listRoutes = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionRoutesModels.RouteListResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes`,
    
  );
};

const createRoutePoint = (officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CreateRoutePointRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionRoutesModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points`,
    ZodExtended.parse(PositionRoutesModels.CreateRoutePointRequestDtoSchema, data),
    
  );
};

const updateRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, data: PositionRoutesModels.UpdateRoutePointRequestDto) => {
  return AppRestClient.patch(
    { resSchema: PositionRoutesModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
    ZodExtended.parse(PositionRoutesModels.UpdateRoutePointRequestDtoSchema, data),
    
  );
};

const deleteRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
    
  );
};

const splitRoutes = (officeId: string, positionId: string) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/split`,
    
  );
};

const mergeRoutes = (officeId: string, positionId: string, data: PositionRoutesModels.MergeRoutesRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/merge`,
    ZodExtended.parse(PositionRoutesModels.MergeRoutesRequestDtoSchema, data),
    
  );
};

const copyRoute = (officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CopyRouteRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/copy`,
    ZodExtended.parse(PositionRoutesModels.CopyRouteRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.PositionRoutes;

export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/routes", officeId, positionId] as const,
};

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
export const useListRoutes = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof listRoutes, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoutes(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionRoutesAcl.canUseListRoutes({ officeId } ));
    return listRoutes(officeId, positionId) },
    ...options,
  });
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
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof createRoutePoint, { officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseCreateRoutePoint({ officeId } ));
      return createRoutePoint(officeId, positionId, routeId, data)
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
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof updateRoutePoint, { officeId: string, positionId: string, routeId: string, pointId: string, data: PositionRoutesModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, pointId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseUpdateRoutePoint({ officeId } ));
      return updateRoutePoint(officeId, positionId, routeId, pointId, data)
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
export const useDeleteRoutePoint = (options?: AppMutationOptions<typeof deleteRoutePoint, { officeId: string, positionId: string, routeId: string, pointId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, pointId }) => { 
      checkAcl(PositionRoutesAcl.canUseDeleteRoutePoint({ officeId } ));
      return deleteRoutePoint(officeId, positionId, routeId, pointId)
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
export const useSplitRoutes = (options?: AppMutationOptions<typeof splitRoutes, { officeId: string, positionId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId }) => { 
      checkAcl(PositionRoutesAcl.canUseSplitRoutes({ officeId } ));
      return splitRoutes(officeId, positionId)
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
export const useMergeRoutes = (options?: AppMutationOptions<typeof mergeRoutes, { officeId: string, positionId: string, data: PositionRoutesModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseMergeRoutes({ officeId } ));
      return mergeRoutes(officeId, positionId, data)
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
export const useCopyRoute = (options?: AppMutationOptions<typeof copyRoute, { officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, routeId, data }) => { 
      checkAcl(PositionRoutesAcl.canUseCopyRoute({ officeId } ));
      return copyRoute(officeId, positionId, routeId, data)
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
