import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InttraOfficeIntegrationAcl } from "./inttraOfficeIntegration.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InttraOfficeIntegrationModels } from "./inttraOfficeIntegration.models";
import { InttraOfficeIntegrationApi } from "./inttraOfficeIntegration.api";

export namespace InttraOfficeIntegrationQueries {
export const moduleName = QueryModule.InttraOfficeIntegration;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string) => [...keys.all, "/offices/:officeId/inttra/credentials", officeId] as const,
};

/** 
 * Query `useGet`
 * @summary Get INTTRA credentials for an office
 * @permission Requires `canUseGet` ability 
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraOfficeIntegrationModels.OfficeInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId }: { officeId: string }, options?: AppQueryOptions<typeof InttraOfficeIntegrationApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId),
    queryFn: () => { 
    checkAcl(InttraOfficeIntegrationAcl.canUseGet({ officeId } ));
    return InttraOfficeIntegrationApi.get(officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useGenerate`
 * @summary Generate and persist INTTRA SFTP RSA key pair for an office
 * @permission Requires `canUseGenerate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraOfficeIntegrationModels.GenerateInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof InttraOfficeIntegrationApi.generate, { officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId }) => { 
      checkAcl(InttraOfficeIntegrationAcl.canUseGenerate({ officeId } ));
      return InttraOfficeIntegrationApi.generate(officeId)
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
 * @summary Manually update INTTRA credentials (username/password/passphrase)
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraOfficeIntegrationModels.UpdateInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof InttraOfficeIntegrationApi.update, { officeId: string, data: InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InttraOfficeIntegrationAcl.canUseUpdate({ officeId } ));
      return InttraOfficeIntegrationApi.update(officeId, data)
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
