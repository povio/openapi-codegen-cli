import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionCargoAcl } from "./positionCargo.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionCargoModels } from "./positionCargo.models";
import { CommonModels } from "@/data/common/common.models";
import { PositionCargoApi } from "./positionCargo.api";

export namespace PositionCargoQueries {
export const moduleName = QueryModule.PositionCargo;

export const keys = {
    all: [moduleName] as const,
    listCargosByPositionId: (officeId: string, positionId: string, limit?: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos", officeId, positionId, limit, order, page, cursor] as const,
    listCargosByPositionIdInfinite: (officeId: string, positionId: string, limit?: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos", "infinite", officeId, positionId, limit, order, cursor] as const,
    listCargoLabels: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/labels", officeId, positionId] as const,
    getCargoSummary: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/summary", officeId, positionId] as const,
    getCargoById: (officeId: string, positionId: string, cargoId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/:cargoId", officeId, positionId, cargoId] as const,
};

export const listCargosByPositionIdQueryOptions = ({ officeId, positionId, limit, order, page, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string }) => ({
  queryKey: keys.listCargosByPositionId(officeId, positionId, limit, order, page, cursor),
  queryFn: () => PositionCargoApi.listCargosByPositionId(officeId, positionId, limit, order, page, cursor),
});

/** 
 * Query `useListCargosByPositionId`
 * @summary List all cargo items for a position
 * @permission Requires `canUseListCargosByPositionId` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionCargoModels.ListCargosByPositionIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionCargoModels.ListCargosByPositionIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByPositionId = <TData>({ officeId, positionId, limit, order, page, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string }, options?: AppQueryOptions<typeof PositionCargoApi.listCargosByPositionId, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listCargosByPositionIdQueryOptions({ officeId, positionId, limit, order, page, cursor }),
    queryFn: async () => {
    checkAcl(PositionCargoAcl.canUseListCargosByPositionId({ officeId } ));
      return listCargosByPositionIdQueryOptions({ officeId, positionId, limit, order, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const listCargosByPositionIdInfiniteQueryOptions = ({ officeId, positionId, limit, order, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, cursor?: string }) => ({
  queryKey: keys.listCargosByPositionIdInfinite(officeId, positionId, limit, order, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => PositionCargoApi.listCargosByPositionId(officeId, positionId, limit, order, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListCargosByPositionIdInfinite
 * @summary List all cargo items for a position
 * @permission Requires `canUseListCargosByPositionId` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { PositionCargoModels.ListCargosByPositionIdOrderParam } order Query parameter. Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<PositionCargoModels.ListCargosByPositionIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargosByPositionIdInfinite = <TData>({ officeId, positionId, limit, order, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, cursor?: string }, options?: AppInfiniteQueryOptions<typeof PositionCargoApi.listCargosByPositionId, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listCargosByPositionIdInfiniteQueryOptions({ officeId, positionId, limit, order, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(PositionCargoAcl.canUseListCargosByPositionId({ officeId } ));
      return listCargosByPositionIdInfiniteQueryOptions({ officeId, positionId, limit, order, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useCreateCargo`
 * @summary Create a new cargo item
 * @permission Requires `canUseCreateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionCargoModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateCargo = (options?: AppMutationOptions<typeof PositionCargoApi.createCargo, { officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionCargoAcl.canUseCreateCargo({ officeId } ));
      return PositionCargoApi.createCargo(officeId, positionId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const listCargoLabelsQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.listCargoLabels(officeId, positionId),
  queryFn: () => PositionCargoApi.listCargoLabels(officeId, positionId),
});

/** 
 * Query `useListCargoLabels`
 * @summary List all cargo labels for a position
 * @permission Requires `canUseListCargoLabels` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionCargoModels.PositionCargoListCargoLabelsResponse> } 
 * @statusCodes [200, 401]
 */
export const useListCargoLabels = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionCargoApi.listCargoLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listCargoLabelsQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionCargoAcl.canUseListCargoLabels({ officeId } ));
      return listCargoLabelsQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const getCargoSummaryQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.getCargoSummary(officeId, positionId),
  queryFn: () => PositionCargoApi.getCargoSummary(officeId, positionId),
});

/** 
 * Query `useGetCargoSummary`
 * @summary Get cargo summary grouped by transport unit type
 * @permission Requires `canUseGetCargoSummary` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionCargoModels.PositionCargoGetCargoSummaryResponse> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoSummary = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof PositionCargoApi.getCargoSummary, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getCargoSummaryQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionCargoAcl.canUseGetCargoSummary({ officeId } ));
      return getCargoSummaryQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const getCargoByIdQueryOptions = ({ officeId, positionId, cargoId }: { officeId: string, positionId: string, cargoId: string }) => ({
  queryKey: keys.getCargoById(officeId, positionId, cargoId),
  queryFn: () => PositionCargoApi.getCargoById(officeId, positionId, cargoId),
});

/** 
 * Query `useGetCargoById`
 * @summary Get a specific cargo item
 * @permission Requires `canUseGetCargoById` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoById = <TData>({ officeId, positionId, cargoId }: { officeId: string, positionId: string, cargoId: string }, options?: AppQueryOptions<typeof PositionCargoApi.getCargoById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getCargoByIdQueryOptions({ officeId, positionId, cargoId }),
    queryFn: async () => {
    checkAcl(PositionCargoAcl.canUseGetCargoById({ officeId } ));
      return getCargoByIdQueryOptions({ officeId, positionId, cargoId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateCargo`
 * @summary Update a cargo item
 * @permission Requires `canUseUpdateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { PositionCargoModels.UpdatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargo = (options?: AppMutationOptions<typeof PositionCargoApi.updateCargo, { officeId: string, positionId: string, cargoId: string, data: PositionCargoModels.UpdatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, data }) => { 
      checkAcl(PositionCargoAcl.canUseUpdateCargo({ officeId } ));
      return PositionCargoApi.updateCargo(officeId, positionId, cargoId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, positionId, cargoId)];
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteCargo = (options?: AppMutationOptions<typeof PositionCargoApi.deleteCargo, { officeId: string, positionId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId }) => { 
      checkAcl(PositionCargoAcl.canUseDeleteCargo({ officeId } ));
      return PositionCargoApi.deleteCargo(officeId, positionId, cargoId)
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
 * @param { string } positionId Path parameter
 * @param { PositionCargoModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoModels.PositionCargoCreateBulkCargosResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateBulkCargos = (options?: AppMutationOptions<typeof PositionCargoApi.createBulkCargos, { numberOfCargos: number, officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ numberOfCargos, officeId, positionId, data }) => { 
      checkAcl(PositionCargoAcl.canUseCreateBulkCargos({ officeId } ));
      return PositionCargoApi.createBulkCargos(numberOfCargos, officeId, positionId, data)
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateCargo = (options?: AppMutationOptions<typeof PositionCargoApi.duplicateCargo, { officeId: string, positionId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionCargo>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId }) => { 
      checkAcl(PositionCargoAcl.canUseDuplicateCargo({ officeId } ));
      return PositionCargoApi.duplicateCargo(officeId, positionId, cargoId)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, positionId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
