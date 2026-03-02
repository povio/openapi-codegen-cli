import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerAuthModels } from "./controlTowerAuth.models";
import { ControlTowerAuthApi } from "./controlTowerAuth.api";

export namespace ControlTowerAuthQueries {
export const moduleName = QueryModule.ControlTowerAuth;



/** 
 * Mutation `useLogin`
 * @description Returns an access token to authenticate for protected endpoints
 * @param { ControlTowerAuthModels.LoginRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerAuthModels.LoginResponseDto> } 
 * @statusCodes [200, 400, 401]
 */
export const useLogin = (options?: AppMutationOptions<typeof ControlTowerAuthApi.login, { data: ControlTowerAuthModels.LoginRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerAuth>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerAuthApi.login(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useResetPassword`
 * @description Resets the password for the requesting user
 * @param { ControlTowerAuthModels.PasswordResetDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerAuthModels.LoginResponseDto> } 
 * @statusCodes [200, 400, 401]
 */
export const useResetPassword = (options?: AppMutationOptions<typeof ControlTowerAuthApi.resetPassword, { data: ControlTowerAuthModels.PasswordResetDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.ControlTowerAuth>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      ControlTowerAuthApi.resetPassword(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
