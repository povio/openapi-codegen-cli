import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { AirPositionsAcl } from "./airPositions.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { AirPositionsModels } from "./airPositions.models";
import { AirPositionsApi } from "./airPositions.api";

export namespace AirPositionsQueries {
export const moduleName = QueryModule.AirPositions;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, positionId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/air-position", officeId, positionId] as const,
};

/** 
 * Query `useGet`
 * @summary Get air position by ID
 * @permission Requires `canUseGet` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.positionId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<AirPositionsModels.AirPositionResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, positionId }: { officeId: string, positionId: string }, options?: AppQueryOptions<typeof AirPositionsApi.get, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, positionId),
    queryFn: () => { 
    checkAcl(AirPositionsAcl.canUseGet({ officeId } ));
    return AirPositionsApi.get(officeId, positionId, config) },
    ...options,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update air position
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { AirPositionsModels.UpdateAirPositionRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AirPositionsModels.AirPositionResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof AirPositionsApi.update, { officeId: string, positionId: string, data: AirPositionsModels.UpdateAirPositionRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, data }) => { 
      checkAcl(AirPositionsAcl.canUseUpdate({ officeId } ));
      return AirPositionsApi.update(officeId, positionId, data, config)
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
