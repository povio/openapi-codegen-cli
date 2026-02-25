import { AxiosRequestConfig } from "axios";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { PositionCargoPackageAcl } from "./positionCargoPackage.acl";
import { AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { PositionCargoPackageApi } from "./positionCargoPackage.api";

export namespace PositionCargoPackageQueries {
export const moduleName = QueryModule.PositionCargoPackage;



/** 
 * Mutation `useCreatePackage`
 * @summary Create a new package for a cargo
 * @permission Requires `canUseCreatePackage` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { CommonModels.CreatePositionCargoPackageDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreatePackage = (options?: AppMutationOptions<typeof PositionCargoPackageApi.createPackage, { officeId: string, positionId: string, cargoId: string, data: CommonModels.CreatePositionCargoPackageDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseCreatePackage({ officeId } ));
      return PositionCargoPackageApi.createPackage(officeId, positionId, cargoId, data, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { string } mutation.packageId Path parameter
 * @param { CommonModels.UpdatePositionCargoPackageDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdatePackage = (options?: AppMutationOptions<typeof PositionCargoPackageApi.updatePackage, { officeId: string, positionId: string, cargoId: string, packageId: string, data: CommonModels.UpdatePositionCargoPackageDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseUpdatePackage({ officeId } ));
      return PositionCargoPackageApi.updatePackage(officeId, positionId, cargoId, packageId, data, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { string } mutation.packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeletePackage = (options?: AppMutationOptions<typeof PositionCargoPackageApi.deletePackage, { officeId: string, positionId: string, cargoId: string, packageId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId }) => { 
      checkAcl(PositionCargoPackageAcl.canUseDeletePackage({ officeId } ));
      return PositionCargoPackageApi.deletePackage(officeId, positionId, cargoId, packageId, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { string } mutation.packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicatePackage = (options?: AppMutationOptions<typeof PositionCargoPackageApi.duplicatePackage, { officeId: string, positionId: string, cargoId: string, packageId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId }) => { 
      checkAcl(PositionCargoPackageAcl.canUseDuplicatePackage({ officeId } ));
      return PositionCargoPackageApi.duplicatePackage(officeId, positionId, cargoId, packageId, config)
    },
    ...options,
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
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.positionId Path parameter
 * @param { string } mutation.cargoId Path parameter
 * @param { string } mutation.packageId Path parameter
 * @param { CommonModels.MovePositionCargoPackageRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useMovePackage = (options?: AppMutationOptions<typeof PositionCargoPackageApi.movePackage, { officeId: string, positionId: string, cargoId: string, packageId: string, data: CommonModels.MovePositionCargoPackageRequestDTO }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseMovePackage({ officeId } ));
      return PositionCargoPackageApi.movePackage(officeId, positionId, cargoId, packageId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
