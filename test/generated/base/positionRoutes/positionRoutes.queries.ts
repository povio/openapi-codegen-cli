import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionRoutesAcl } from "./positionRoutes.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { PositionRoutesApi } from "./positionRoutes.api";

export namespace PositionRoutesQueries {
  export const moduleName = QueryModule.PositionRoutes;

  export const keys = {
    all: [moduleName] as const,
    listRoutes: (officeId: string, positionId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/routes", officeId, positionId] as const,
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
  export const useListRoutes = <TData>(
    { officeId, positionId }: { officeId: string; positionId: string },
    options?: AppQueryOptions<typeof PositionRoutesApi.listRoutes, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.listRoutes(officeId, positionId),
      queryFn: () => {
        checkAcl(PositionRoutesAcl.canUseListRoutes({ officeId }));
        return PositionRoutesApi.listRoutes(officeId, positionId, config);
      },
      ...options,
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
  export const useCreateRoutePoint = (
    options?: AppMutationOptions<
      typeof PositionRoutesApi.createRoutePoint,
      { officeId: string; positionId: string; routeId: string; data: CommonModels.CreateRoutePointRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, routeId, data }) => {
        checkAcl(PositionRoutesAcl.canUseCreateRoutePoint({ officeId }));
        return PositionRoutesApi.createRoutePoint(officeId, positionId, routeId, data, config);
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
  export const useUpdateRoutePoint = (
    options?: AppMutationOptions<
      typeof PositionRoutesApi.updateRoutePoint,
      {
        officeId: string;
        positionId: string;
        routeId: string;
        pointId: string;
        data: CommonModels.UpdateRoutePointRequestDto;
      }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, routeId, pointId, data }) => {
        checkAcl(PositionRoutesAcl.canUseUpdateRoutePoint({ officeId }));
        return PositionRoutesApi.updateRoutePoint(officeId, positionId, routeId, pointId, data, config);
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
  export const useDeleteRoutePoint = (
    options?: AppMutationOptions<
      typeof PositionRoutesApi.deleteRoutePoint,
      { officeId: string; positionId: string; routeId: string; pointId: string }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, routeId, pointId }) => {
        checkAcl(PositionRoutesAcl.canUseDeleteRoutePoint({ officeId }));
        return PositionRoutesApi.deleteRoutePoint(officeId, positionId, routeId, pointId, config);
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
   * @summary Split routes by cargo (sea positions only)
   * @permission Requires `canUseSplitRoutes` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [200, 401]
   */
  export const useSplitRoutes = (
    options?: AppMutationOptions<typeof PositionRoutesApi.splitRoutes, { officeId: string; positionId: string }> &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId }) => {
        checkAcl(PositionRoutesAcl.canUseSplitRoutes({ officeId }));
        return PositionRoutesApi.splitRoutes(officeId, positionId, config);
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
   * @summary Merge routes (sea positions only)
   * @permission Requires `canUseMergeRoutes` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.positionId Path parameter
   * @param { CommonModels.MergeRoutesRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<void> }
   * @statusCodes [200, 401]
   */
  export const useMergeRoutes = (
    options?: AppMutationOptions<
      typeof PositionRoutesApi.mergeRoutes,
      { officeId: string; positionId: string; data: CommonModels.MergeRoutesRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, data }) => {
        checkAcl(PositionRoutesAcl.canUseMergeRoutes({ officeId }));
        return PositionRoutesApi.mergeRoutes(officeId, positionId, data, config);
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
  export const useCopyRoute = (
    options?: AppMutationOptions<
      typeof PositionRoutesApi.copyRoute,
      { officeId: string; positionId: string; routeId: string; data: CommonModels.CopyRouteRequestDto }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, positionId, routeId, data }) => {
        checkAcl(PositionRoutesAcl.canUseCopyRoute({ officeId }));
        return PositionRoutesApi.copyRoute(officeId, positionId, routeId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        await runMutationEffects(resData, variables, options);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
