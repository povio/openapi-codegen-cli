import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { PositionCargoPackageAcl } from "./positionCargoPackage.acl";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PositionCargoPackageModels } from "./positionCargoPackage.models";

export namespace PositionCargoPackageQueries {
const createPackage = (officeId: string, positionId: string, cargoId: string, data: PositionCargoPackageModels.CreatePositionCargoPackageDTO) => {
  return AppRestClient.post(
    { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages`,
    ZodExtended.parse(PositionCargoPackageModels.CreatePositionCargoPackageDTOSchema, data),
    
  );
};

const updatePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.UpdatePositionCargoPackageDTO) => {
  return AppRestClient.patch(
    { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
    ZodExtended.parse(PositionCargoPackageModels.UpdatePositionCargoPackageDTOSchema, data),
    
  );
};

const deletePackage = (officeId: string, positionId: string, cargoId: string, packageId: string) => {
  return AppRestClient.delete(
    { resSchema: z.void() },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
    
  );
};

const duplicatePackage = (officeId: string, positionId: string, cargoId: string, packageId: string) => {
  return AppRestClient.post(
    { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/duplicate`,
    
  );
};

const movePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.MovePositionCargoPackageRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/move`,
    ZodExtended.parse(PositionCargoPackageModels.MovePositionCargoPackageRequestDTOSchema, data),
    
  );
};


export const moduleName = QueryModule.PositionCargoPackage;



/** 
 * Mutation `useCreatePackage`
 * @summary Create a new package for a cargo
 * @permission Requires `canUseCreatePackage` ability 
 * @param { string } officeId Path parameter
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { PositionCargoPackageModels.CreatePositionCargoPackageDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreatePackage = (options?: AppMutationOptions<typeof createPackage, { officeId: string, positionId: string, cargoId: string, data: PositionCargoPackageModels.CreatePositionCargoPackageDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseCreatePackage({ officeId } ));
      return createPackage(officeId, positionId, cargoId, data)
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { PositionCargoPackageModels.UpdatePositionCargoPackageDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdatePackage = (options?: AppMutationOptions<typeof updatePackage, { officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.UpdatePositionCargoPackageDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseUpdatePackage({ officeId } ));
      return updatePackage(officeId, positionId, cargoId, packageId, data)
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useDeletePackage = (options?: AppMutationOptions<typeof deletePackage, { officeId: string, positionId: string, cargoId: string, packageId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId }) => { 
      checkAcl(PositionCargoPackageAcl.canUseDeletePackage({ officeId } ));
      return deletePackage(officeId, positionId, cargoId, packageId)
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useDuplicatePackage = (options?: AppMutationOptions<typeof duplicatePackage, { officeId: string, positionId: string, cargoId: string, packageId: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId }) => { 
      checkAcl(PositionCargoPackageAcl.canUseDuplicatePackage({ officeId } ));
      return duplicatePackage(officeId, positionId, cargoId, packageId)
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
 * @param { string } positionId Path parameter
 * @param { string } cargoId Path parameter
 * @param { string } packageId Path parameter
 * @param { PositionCargoPackageModels.MovePositionCargoPackageRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PositionCargoPackageModels.PositionCargoPackageResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useMovePackage = (options?: AppMutationOptions<typeof movePackage, { officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.MovePositionCargoPackageRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, positionId, cargoId, packageId, data }) => { 
      checkAcl(PositionCargoPackageAcl.canUseMovePackage({ officeId } ));
      return movePackage(officeId, positionId, cargoId, packageId, data)
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
