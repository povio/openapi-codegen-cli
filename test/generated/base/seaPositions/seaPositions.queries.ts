import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { SeaPositionsAcl } from "./seaPositions.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { SeaPositionsModels } from "./seaPositions.models";
import { SeaPositionsApi } from "./seaPositions.api";

export namespace SeaPositionsQueries {
export const moduleName = QueryModule.SeaPositions;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/sea-position", officeId, positionId] as const,
};

/** 
 * Query `useGet`
 * @summary Get sea position by ID
 * @permission Requires `canUseGet` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<SeaPositionsModels.SeaPositionResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof SeaPositionsApi.get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, positionId),
    queryFn: () => { 
    checkAcl(SeaPositionsAcl.canUseGet({ officeId } ));
    return SeaPositionsApi.get(officeId, positionId) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update sea position
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { SeaPositionsModels.UpdateSeaPositionRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<SeaPositionsModels.SeaPositionResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof SeaPositionsApi.update, { officeId: string, positionId: string, data: SeaPositionsModels.UpdateSeaPositionRequestDTO }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(SeaPositionsAcl.canUseUpdate({ officeId } ));
      return SeaPositionsApi.update(officeId, positionId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, positionId } = variables;
      const updateKeys = [keys.get(officeId, positionId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
