import { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionAccountAcl } from "./positionAccount.acl";
import { AppQueryOptions } from "@povio/openapi-codegen-cli";
import { PositionAccountApi } from "./positionAccount.api";

export namespace PositionAccountQueries {
  export const moduleName = QueryModule.PositionAccount;

  export const keys = {
    all: [moduleName] as const,
    get: (positionId: string, officeId: string) =>
      [...keys.all, "/offices/:officeId/positions/:positionId/account", positionId, officeId] as const,
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
  export const useGet = <TData>(
    { positionId, officeId }: { positionId: string; officeId: string },
    options?: AppQueryOptions<typeof PositionAccountApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(positionId, officeId),
      queryFn: () => {
        checkAcl(PositionAccountAcl.canUseGet({ officeId }));
        return PositionAccountApi.get(positionId, officeId, config);
      },
      ...options,
    });
  };
}
