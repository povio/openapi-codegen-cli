import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteCargoPackageAcl } from "./quoteCargoPackage.acl";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { QuoteCargoPackageApi } from "./quoteCargoPackage.api";

export namespace QuoteCargoPackageQueries {
export const moduleName = QueryModule.QuoteCargoPackage;



/** 
 * Mutation `useCreatePackage`
 * @summary Create a new package for a cargo
 * @permission Requires `canUseCreatePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { QuoteCargoPackageModels.CreatePositionCargoPackageDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreatePackage = (options?: AppMutationOptions<typeof QuoteCargoPackageApi.createPackage, { officeId: string, quoteId: string, cargoId: string, data: QuoteCargoPackageModels.CreatePositionCargoPackageDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargoPackage>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, data }) => { 
      checkAcl(QuoteCargoPackageAcl.canUseCreatePackage({ officeId } ));
      return QuoteCargoPackageApi.createPackage(officeId, quoteId, cargoId, data)
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
 * Mutation `useUpdatePackage`
 * @summary Update a package
 * @permission Requires `canUseUpdatePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { QuoteCargoPackageModels.UpdatePositionCargoPackageDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdatePackage = (options?: AppMutationOptions<typeof QuoteCargoPackageApi.updatePackage, { officeId: string, quoteId: string, cargoId: string, packageId: string, data: QuoteCargoPackageModels.UpdatePositionCargoPackageDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargoPackage>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, packageId, data }) => { 
      checkAcl(QuoteCargoPackageAcl.canUseUpdatePackage({ officeId } ));
      return QuoteCargoPackageApi.updatePackage(officeId, quoteId, cargoId, packageId, data)
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
 * Mutation `useDeletePackage`
 * @summary Delete a package
 * @permission Requires `canUseDeletePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeletePackage = (options?: AppMutationOptions<typeof QuoteCargoPackageApi.deletePackage, { officeId: string, quoteId: string, cargoId: string, packageId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargoPackage>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, packageId }) => { 
      checkAcl(QuoteCargoPackageAcl.canUseDeletePackage({ officeId } ));
      return QuoteCargoPackageApi.deletePackage(officeId, quoteId, cargoId, packageId)
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
 * Mutation `useDuplicatePackage`
 * @summary Duplicate a package
 * @permission Requires `canUseDuplicatePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicatePackage = (options?: AppMutationOptions<typeof QuoteCargoPackageApi.duplicatePackage, { officeId: string, quoteId: string, cargoId: string, packageId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargoPackage>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, packageId }) => { 
      checkAcl(QuoteCargoPackageAcl.canUseDuplicatePackage({ officeId } ));
      return QuoteCargoPackageApi.duplicatePackage(officeId, quoteId, cargoId, packageId)
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
 * Mutation `useMovePackage`
 * @summary Move a package to a different cargo
 * @permission Requires `canUseMovePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { QuoteCargoPackageModels.MovePositionCargoPackageRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useMovePackage = (options?: AppMutationOptions<typeof QuoteCargoPackageApi.movePackage, { officeId: string, quoteId: string, cargoId: string, packageId: string, data: QuoteCargoPackageModels.MovePositionCargoPackageRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteCargoPackage>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, cargoId, packageId, data }) => { 
      checkAcl(QuoteCargoPackageAcl.canUseMovePackage({ officeId } ));
      return QuoteCargoPackageApi.movePackage(officeId, quoteId, cargoId, packageId, data)
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
