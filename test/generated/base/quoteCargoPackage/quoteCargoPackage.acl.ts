import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace QuoteCargoPackageAcl {
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
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Create", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

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
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Update", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

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
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Delete", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

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
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Duplicate", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

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
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Update", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

}
