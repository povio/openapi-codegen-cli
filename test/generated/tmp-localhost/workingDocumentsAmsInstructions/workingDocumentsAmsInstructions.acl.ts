import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsAmsInstructionsAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Create", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

/**
 * Use for `useGetAMSInstructionsData` query ability. For global ability, omit the object parameter.
 * @description Read AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetAMSInstructionsData` query
 */
export const canUseGetAMSInstructionsData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Read", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

/**
 * Use for `useUpdateAMSInstructionsData` mutation ability. For global ability, omit the object parameter.
 * @description Update AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateAMSInstructionsData` mutation
 */
export const canUseUpdateAMSInstructionsData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Update", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

/**
 * Use for `useDeleteAMSInstructions` mutation ability. For global ability, omit the object parameter.
 * @description Delete AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteAMSInstructions` mutation
 */
export const canUseDeleteAMSInstructions = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Delete", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

/**
 * Use for `usePreviewAMSInstructions` query or `usePreviewAMSInstructionsMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewAMSInstructions` query or `usePreviewAMSInstructionsMutation` mutation
 */
export const canUsePreviewAMSInstructions = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Read", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

/**
 * Use for `useGenerateAMSInstructions` mutation ability. For global ability, omit the object parameter.
 * @description Generate AMS Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateAMSInstructions` mutation
 */
export const canUseGenerateAMSInstructions = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-ams-instructions", object) : "WorkingDocument-ams-instructions"
] as AbilityTuple<"Update", "WorkingDocument-ams-instructions" | ForcedSubject<"WorkingDocument-ams-instructions"> & { officeId: string, }>;

}
