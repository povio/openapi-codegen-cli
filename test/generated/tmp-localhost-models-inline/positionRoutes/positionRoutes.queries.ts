import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionRoutesAcl } from "./positionRoutes.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionRoutesModels } from "./positionRoutes.models";

export namespace PositionRoutesQueries {
const listRoutes = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: CommonModels.RouteListResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes`,
    
  );
};

const createRoutePoint = (officeId: string, positionId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto) => {
  return AppRestClient.post(
    { resSchema: CommonModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points`,
    ZodExtended.parse(CommonModels.CreateRoutePointRequestDtoSchema, data),
    
  );
};

const updateRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto) => {
  return AppRestClient.patch(
    { resSchema: CommonModels.RoutePointResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
    ZodExtended.parse(CommonModels.UpdateRoutePointRequestDtoSchema, data),
    
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

const mergeRoutes = (officeId: string, positionId: string, data: CommonModels.MergeRoutesRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/merge`,
    ZodExtended.parse(CommonModels.MergeRoutesRequestDtoSchema, data),
    
  );
};

const copyRoute = (officeId: string, positionId: string, routeId: string, data: CommonModels.CopyRouteRequestDto) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/routes/${routeId}/copy`,
    ZodExtended.parse(CommonModels.CopyRouteRequestDtoSchema, data),
    
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
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.RouteListResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useListRoutes = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof listRoutes, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listRoutes(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionRoutesAcl.canUseListRoutes({ officeId } ));
    return listRoutes(officeId, positionId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreateRoutePoint`
 * @summary Create a route point
 * @permission Requires `canUseCreateRoutePoint` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { CommonModels.CreateRoutePointRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreateRoutePoint = (options?: AppMutationOptions<typeof createRoutePoint, { officeId: string, positionId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto }> & MutationEffectsOptions) => {
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { string } mutation.pointId Path parameter
 * @param { CommonModels.UpdateRoutePointRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.RoutePointResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdateRoutePoint = (options?: AppMutationOptions<typeof updateRoutePoint, { officeId: string, positionId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto }> & MutationEffectsOptions) => {
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { string } mutation.pointId Path parameter
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { CommonModels.MergeRoutesRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useMergeRoutes = (options?: AppMutationOptions<typeof mergeRoutes, { officeId: string, positionId: string, data: CommonModels.MergeRoutesRequestDto }> & MutationEffectsOptions) => {
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.routeId Path parameter
 * @param { CommonModels.CopyRouteRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useCopyRoute = (options?: AppMutationOptions<typeof copyRoute, { officeId: string, positionId: string, routeId: string, data: CommonModels.CopyRouteRequestDto }> & MutationEffectsOptions) => {
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
