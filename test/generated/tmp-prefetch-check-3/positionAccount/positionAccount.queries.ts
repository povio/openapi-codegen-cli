import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionAccountAcl } from "./positionAccount.acl";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { PositionAccountApi } from "./positionAccount.api";

export namespace PositionAccountQueries {
export const moduleName = QueryModule.PositionAccount;

export const keys = {
    all: [moduleName] as const,
    get: (positionId: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/account", positionId, officeId] as const,
};

export const getQueryOptions = ({ positionId, officeId }: { positionId: string, officeId: string }) => ({
  queryKey: keys.get(positionId, officeId),
  queryFn: () => PositionAccountApi.get(positionId, officeId),
});

/** 
 * Query `useGet`
 * @summary Get position account details
 * @permission Requires `canUseGet` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PositionAccountModels.PositionAccountResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ positionId, officeId }: { positionId: string, officeId: string }, options?: AppQueryOptions<typeof PositionAccountApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getQueryOptions({ positionId, officeId }),
    queryFn: async () => {
    checkAcl(PositionAccountAcl.canUseGet({ officeId } ));
      return getQueryOptions({ positionId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
