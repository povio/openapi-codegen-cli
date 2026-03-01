import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { InttraOfficeIntegrationAcl } from "./inttraOfficeIntegration.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { InttraOfficeIntegrationModels } from "./inttraOfficeIntegration.models";

export namespace InttraOfficeIntegrationQueries {
const get = (officeId: string) => {
  return AppRestClient.get(
    { resSchema: InttraOfficeIntegrationModels.OfficeInttraCredentialsResponseDtoSchema },
    `/offices/${officeId}/inttra/credentials`,
    
  );
};

const generate = (officeId: string) => {
  return AppRestClient.post(
    { resSchema: InttraOfficeIntegrationModels.GenerateInttraCredentialsResponseDtoSchema },
    `/offices/${officeId}/inttra/credentials`,
    
  );
};

const update = (officeId: string, data: InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto) => {
  return AppRestClient.patch(
    { resSchema: InttraOfficeIntegrationModels.UpdateInttraCredentialsResponseDtoSchema },
    `/offices/${officeId}/inttra/credentials`,
    ZodExtended.parse(InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.InttraOfficeIntegration;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string) => [...keys.all, "/offices/:officeId/inttra/credentials", officeId] as const,
};

/** 
 * Query `useGet`
 * @summary Get INTTRA credentials for an office
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<InttraOfficeIntegrationModels.OfficeInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId }: { officeId: string }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId),
    queryFn: () => { 
    checkAcl(InttraOfficeIntegrationAcl.canUseGet({ officeId } ));
    return get(officeId) },
    ...options,
  });
};

/** 
 * Mutation `useGenerate`
 * @summary Generate and persist INTTRA SFTP RSA key pair for an office
 * @permission Requires `canUseGenerate` ability 
 * @param { string } officeId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraOfficeIntegrationModels.GenerateInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof generate, { officeId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId }) => { 
      checkAcl(InttraOfficeIntegrationAcl.canUseGenerate({ officeId } ));
      return generate(officeId)
    },
    ...options,
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
 * @param { string } officeId Path parameter
 * @param { InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<InttraOfficeIntegrationModels.UpdateInttraCredentialsResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof update, { officeId: string, data: InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(InttraOfficeIntegrationAcl.canUseUpdate({ officeId } ));
      return update(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
