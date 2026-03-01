import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionCargoAcl } from "./positionCargo.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionCargoModels } from "./positionCargo.models";

export namespace PositionCargoQueries {
const listCargosByPositionId = (officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: PositionCargoModels.ListCargosByPositionIdResponseSchema },
    `/offices/${officeId}/positions/${positionId}/cargos`,
    {
      params: {
        order: ZodExtended.parse(PositionCargoModels.ListCargosByPositionIdOrderParamSchema.optional(), order, { type: "query", name: "order" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const createCargo = (officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO) => {
  return AppRestClient.post(
    { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos`,
    ZodExtended.parse(PositionCargoModels.CreatePositionCargoDTOSchema, data),
    
  );
};

const listCargoLabels = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionCargoModels.PositionCargoListCargoLabelsResponseSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/labels`,
    
  );
};

const getCargoSummary = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionCargoModels.PositionCargoGetCargoSummaryResponseSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/summary`,
    
  );
};

const getCargoById = (officeId: string, positionId: string, cargoId: string) => {
  return AppRestClient.get(
    { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
    
  );
};

const updateCargo = (officeId: string, positionId: string, cargoId: string, data: PositionCargoModels.UpdatePositionCargoDTO) => {
  return AppRestClient.patch(
    { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
    ZodExtended.parse(PositionCargoModels.UpdatePositionCargoDTOSchema, data),
    
  );
};

const deleteCargo = (officeId: string, positionId: string, cargoId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
    
  );
};

const createBulkCargos = (numberOfCargos: number, officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO) => {
  return AppRestClient.post(
    { resSchema: PositionCargoModels.PositionCargoCreateBulkCargosResponseSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/bulk/${numberOfCargos}`,
    ZodExtended.parse(PositionCargoModels.CreatePositionCargoDTOSchema, data),
    
  );
};

const duplicateCargo = (officeId: string, positionId: string, cargoId: string) => {
  return AppRestClient.post(
    { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/duplicate`,
    
  );
};


export const moduleName = QueryModule.PositionCargo;

export const keys = {
    all: [moduleName] as const,
    listCargosByPositionId: (officeId: string, positionId: string, limit?: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos", officeId, positionId, limit, order, page, cursor] as const,
    listCargosByPositionIdInfinite: (officeId: string, positionId: string, limit?: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos", "infinite", officeId, positionId, limit, order, cursor] as const,
    listCargoLabels: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/labels", officeId, positionId] as const,
    getCargoSummary: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/summary", officeId, positionId] as const,
    getCargoById: (officeId: string, positionId: string, cargoId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/cargos/:cargoId", officeId, positionId, cargoId] as const,
};

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
export const useListCargosByPositionId = <TData>({ officeId, positionId, limit, order, page, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string }, options?: AppQueryOptions<typeof listCargosByPositionId, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargosByPositionId(officeId, positionId, limit, order, page, cursor),
    queryFn: () => { 
    checkAcl(PositionCargoAcl.canUseListCargosByPositionId({ officeId } ));
    return listCargosByPositionId(officeId, positionId, limit, order, page, cursor) },
    ...options,
  });
};

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
export const useListCargosByPositionIdInfinite = <TData>({ officeId, positionId, limit, order, cursor }: { officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, cursor?: string }, options?: AppInfiniteQueryOptions<typeof listCargosByPositionId, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listCargosByPositionIdInfinite(officeId, positionId, limit, order, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(PositionCargoAcl.canUseListCargosByPositionId({ officeId } ));
    return listCargosByPositionId(officeId, positionId, limit, order, pageParam, cursor) },
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Mutation `useCreateCargo`
 * @summary Create a new cargo item
 * @permission Requires `canUseCreateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { CommonModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateCargo = (options?: AppMutationOptions<typeof createCargo, { officeId: string, positionId: string, data: CommonModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionCargoAcl.canUseCreateCargo({ officeId } ));
      return createCargo(officeId, positionId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

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
export const useListCargoLabels = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof listCargoLabels, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.listCargoLabels(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionCargoAcl.canUseListCargoLabels({ officeId } ));
    return listCargoLabels(officeId, positionId) },
    ...options,
  });
};

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
export const useGetCargoSummary = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof getCargoSummary, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoSummary(officeId, positionId),
    queryFn: () => { 
    checkAcl(PositionCargoAcl.canUseGetCargoSummary({ officeId } ));
    return getCargoSummary(officeId, positionId) },
    ...options,
  });
};

/** 
 * Query `useGetCargoById`
 * @summary Get a specific cargo item
 * @permission Requires `canUseGetCargoById` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetCargoById = <TData>({ officeId, positionId, cargoId }: { officeId: string, positionId: string, cargoId: string }, options?: AppQueryOptions<typeof getCargoById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getCargoById(officeId, positionId, cargoId),
    queryFn: () => { 
    checkAcl(PositionCargoAcl.canUseGetCargoById({ officeId } ));
    return getCargoById(officeId, positionId, cargoId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdateCargo`
 * @summary Update a cargo item
 * @permission Requires `canUseUpdateCargo` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { CommonModels.UpdatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateCargo = (options?: AppMutationOptions<typeof updateCargo, { officeId: string, positionId: string, cargoId: string, data: CommonModels.UpdatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, data }) => { 
      checkAcl(PositionCargoAcl.canUseUpdateCargo({ officeId } ));
      return updateCargo(officeId, positionId, cargoId, data)
    },
    ...options,
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
export const useDeleteCargo = (options?: AppMutationOptions<typeof deleteCargo, { officeId: string, positionId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId }) => { 
      checkAcl(PositionCargoAcl.canUseDeleteCargo({ officeId } ));
      return deleteCargo(officeId, positionId, cargoId)
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
 * @param { number } numberOfCargos Path parameter
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { CommonModels.CreatePositionCargoDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoModels.PositionCargoCreateBulkCargosResponse> } 
 * @statusCodes [201, 401]
 */
export const useCreateBulkCargos = (options?: AppMutationOptions<typeof createBulkCargos, { numberOfCargos: number, officeId: string, positionId: string, data: CommonModels.CreatePositionCargoDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ numberOfCargos, officeId, positionId, data }) => { 
      checkAcl(PositionCargoAcl.canUseCreateBulkCargos({ officeId } ));
      return createBulkCargos(numberOfCargos, officeId, positionId, data)
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
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicateCargo = (options?: AppMutationOptions<typeof duplicateCargo, { officeId: string, positionId: string, cargoId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId }) => { 
      checkAcl(PositionCargoAcl.canUseDuplicateCargo({ officeId } ));
      return duplicateCargo(officeId, positionId, cargoId)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId, cargoId } = variables;
      const updateKeys = [keys.getCargoById(officeId, positionId, cargoId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
