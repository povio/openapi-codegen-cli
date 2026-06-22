import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionCargoPackageAcl {
/**
 * Use for `useCreatePackage` mutation ability. For global ability, omit the object parameter.
 * @description Create cargo package
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreatePackage` mutation
 */
export const canUseCreatePackage = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("PositionCargo", object) : "PositionCargo"
] as AbilityTuple<"Create", "PositionCargo" | ForcedSubject<"PositionCargo"> & { officeId: string, }>;

/**
 * Use for `useUpdatePackage` mutation ability. For global ability, omit the object parameter.
 * @description Update cargo package
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdatePackage` mutation
 */
export const canUseUpdatePackage = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionCargo", object) : "PositionCargo"
] as AbilityTuple<"Update", "PositionCargo" | ForcedSubject<"PositionCargo"> & { officeId: string, }>;

/**
 * Use for `useDeletePackage` mutation ability. For global ability, omit the object parameter.
 * @description Delete cargo package
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeletePackage` mutation
 */
export const canUseDeletePackage = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("PositionCargo", object) : "PositionCargo"
] as AbilityTuple<"Delete", "PositionCargo" | ForcedSubject<"PositionCargo"> & { officeId: string, }>;

/**
 * Use for `useDuplicatePackage` mutation ability. For global ability, omit the object parameter.
 * @description Duplicate cargo package
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicatePackage` mutation
 */
export const canUseDuplicatePackage = (
  object?: { officeId: string,  } 
) => [
  "Duplicate",
  object ? subject("PositionCargo", object) : "PositionCargo"
] as AbilityTuple<"Duplicate", "PositionCargo" | ForcedSubject<"PositionCargo"> & { officeId: string, }>;

/**
 * Use for `useMovePackage` mutation ability. For global ability, omit the object parameter.
 * @description Move cargo package
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useMovePackage` mutation
 */
export const canUseMovePackage = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionCargo", object) : "PositionCargo"
] as AbilityTuple<"Update", "PositionCargo" | ForcedSubject<"PositionCargo"> & { officeId: string, }>;

}
