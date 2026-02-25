import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace ShippingInstructionsAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Create", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useGet` query ability. For global ability, omit the object parameter.
 * @description Read shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
 */
export const canUseGet = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Read", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Update", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useDeleteOfficesPositionsShippingInstructionsById` mutation ability. For global ability, omit the object parameter.
 * @description Delete shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteOfficesPositionsShippingInstructionsById` mutation
 */
export const canUseDeleteOfficesPositionsShippingInstructionsById = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Delete", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `usePreview` query or `usePreviewMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreview` query or `usePreviewMutation` mutation
 */
export const canUsePreview = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Read", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useGenerate` mutation ability. For global ability, omit the object parameter.
 * @description Generate shipping instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerate` mutation
 */
export const canUseGenerate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Update", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

}
