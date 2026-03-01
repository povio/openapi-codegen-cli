import { AppRestClient } from "@/data/app-rest-client";
import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionAccountAcl } from "./positionAccount.acl";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { PositionAccountModels } from "./positionAccount.models";

export namespace PositionAccountQueries {
const get = (positionId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: PositionAccountModels.PositionAccountResponseDtoSchema },
    `/offices/${officeId}/positions/${positionId}/account`,
    
  );
};


export const moduleName = QueryModule.PositionAccount;

export const keys = {
    all: [moduleName] as const,
    get: (positionId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/account", positionId, officeId] as const,
};

/** 
 * Query `useGet`
 * @summary Get position account details
 * @permission Requires `canUseGet` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionAccountModels.PositionAccountResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ positionId, officeId }: { positionId: string, officeId: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(positionId, officeId),
    queryFn: () => { 
    checkAcl(PositionAccountAcl.canUseGet({ officeId } ));
    return get(positionId, officeId) },
    ...options,
  });
};

}
