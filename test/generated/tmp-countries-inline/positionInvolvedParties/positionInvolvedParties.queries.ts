import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionInvolvedPartiesAcl } from "./positionInvolvedParties.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionInvolvedPartiesModels } from "./positionInvolvedParties.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionInvolvedPartiesQueries {
const findByPositionId = (officeId: string, positionId: string) => {
  return AppRestClient.get(
    { resSchema: PositionInvolvedPartiesModels.FindByPositionIdResponseSchema },
    `/offices/${officeId}/positions/${positionId}/involved-parties`,
    
  );
};

const create = (officeId: string, positionId: string, data: PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDto) => {
  return AppRestClient.post(
    { resSchema: PositionInvolvedPartiesModels.InvolvedPartyResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/involved-parties`,
    ZodExtended.parse(PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDtoSchema, data),
    
  );
};

const update = (officeId: string, positionId: string, partyId: string, data: PositionInvolvedPartiesModels.UpdateInvolvedPartyDto) => {
  return AppRestClient.patch(
    { resSchema: PositionInvolvedPartiesModels.InvolvedPartyResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
    ZodExtended.parse(PositionInvolvedPartiesModels.UpdateInvolvedPartyDtoSchema, data),
    
  );
};

const deleteOfficesPositionsInvolvedPartiesByPartyId = (officeId: string, positionId: string, partyId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
    
  );
};


export const moduleName = QueryModule.PositionInvolvedParties;

export const keys = {
    all: [moduleName] as const,
    findByPositionId: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/involved-parties", officeId, positionId] as const,
};

export const findByPositionIdQueryOptions = ({ officeId, positionId }: { officeId: string, positionId: string }) => ({
  queryKey: keys.findByPositionId(officeId, positionId),
  queryFn: () => findByPositionId(officeId, positionId),
});

/** 
 * Query `useFindByPositionId`
 * @summary List position involved parties
 * @permission Requires `canUseFindByPositionId` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionInvolvedPartiesModels.FindByPositionIdResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindByPositionId = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof findByPositionId, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByPositionIdQueryOptions({ officeId, positionId }),
    queryFn: async () => {
    checkAcl(PositionInvolvedPartiesAcl.canUseFindByPositionId({ officeId } ));
      return findByPositionIdQueryOptions({ officeId, positionId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindByPositionId = (queryClient: QueryClient, { officeId, positionId }: { officeId: string, positionId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findByPositionIdQueryOptions({ officeId, positionId }), ...options });
};

/** 
 * Mutation `useCreate`
 * @summary Create position involved party
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionInvolvedPartiesModels.InvolvedPartyResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, positionId: string, data: PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionInvolvedParties>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(PositionInvolvedPartiesAcl.canUseCreate({ officeId } ));
      return create(officeId, positionId, data)
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
 * Mutation `useUpdate`
 * @summary Update position involved party
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } partyId Path parameter
 * @param { PositionInvolvedPartiesModels.UpdateInvolvedPartyDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionInvolvedPartiesModels.InvolvedPartyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, positionId: string, partyId: string, data: PositionInvolvedPartiesModels.UpdateInvolvedPartyDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionInvolvedParties>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, partyId, data }) => { 
      checkAcl(PositionInvolvedPartiesAcl.canUseUpdate({ officeId } ));
      return update(officeId, positionId, partyId, data)
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
 * Mutation `useDeleteOfficesPositionsInvolvedPartiesByPartyId`
 * @summary Delete position involved party
 * @permission Requires `canUseDeleteOfficesPositionsInvolvedPartiesByPartyId` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } partyId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeleteOfficesPositionsInvolvedPartiesByPartyId = (options?: AppMutationOptions<typeof deleteOfficesPositionsInvolvedPartiesByPartyId, { officeId: string, positionId: string, partyId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.PositionInvolvedParties>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, partyId }) => { 
      checkAcl(PositionInvolvedPartiesAcl.canUseDeleteOfficesPositionsInvolvedPartiesByPartyId({ officeId } ));
      return deleteOfficesPositionsInvolvedPartiesByPartyId(officeId, positionId, partyId)
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
