import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerAuthModels } from "./controlTowerAuth.models";

export namespace ControlTowerAuthQueries {
const login = (data: ControlTowerAuthModels.LoginRequestDto) => {
  return AppRestClient.post(
    { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
    `/auth/move/login`,
    ZodExtended.parse(ControlTowerAuthModels.LoginRequestDtoSchema, data),
    
  );
};

const resetPassword = (data: ControlTowerAuthModels.PasswordResetDto) => {
  return AppRestClient.post(
    { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
    `/auth/reset-password`,
    ZodExtended.parse(ControlTowerAuthModels.PasswordResetDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.ControlTowerAuth;



/** 
 * Mutation `useLogin`
 * @description Returns an access token to authenticate for protected endpoints
 * @param { ControlTowerAuthModels.LoginRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerAuthModels.LoginResponseDto> } 
 * @statusCodes [200, 400, 401]
 */
export const useLogin = (options?: AppMutationOptions<typeof login, { data: ControlTowerAuthModels.LoginRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      login(data)
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
 * @param { ControlTowerAuthModels.PasswordResetDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerAuthModels.LoginResponseDto> } 
 * @statusCodes [200, 400, 401]
 */
export const useResetPassword = (options?: AppMutationOptions<typeof resetPassword, { data: ControlTowerAuthModels.PasswordResetDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      resetPassword(data)
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
