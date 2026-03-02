import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace WorkingDocumentsBlInstructionsAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create BL Instructions document
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
 * Use for `useGetBlInstructionsData` query ability. For global ability, omit the object parameter.
 * @description Read BL Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetBlInstructionsData` query
 */
export const canUseGetBlInstructionsData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Read", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useUpdateBlInstructionsData` mutation ability. For global ability, omit the object parameter.
 * @description Update BL Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBlInstructionsData` mutation
 */
export const canUseUpdateBlInstructionsData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Update", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useDeleteBlInstructions` mutation ability. For global ability, omit the object parameter.
 * @description Delete BL Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteBlInstructions` mutation
 */
export const canUseDeleteBlInstructions = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Delete", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `usePreviewBlInstructions` query or `usePreviewBlInstructionsMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview BL Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewBlInstructions` query or `usePreviewBlInstructionsMutation` mutation
 */
export const canUsePreviewBlInstructions = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Read", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useGenerateBlInstructions` mutation ability. For global ability, omit the object parameter.
 * @description Generate BL Instructions document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateBlInstructions` mutation
 */
export const canUseGenerateBlInstructions = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Update", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

/**
 * Use for `useGenerateDocumentEml` mutation ability. For global ability, omit the object parameter.
 * @description Generate BL Instructions document EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateDocumentEml` mutation
 */
export const canUseGenerateDocumentEml = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-bl-instructions", object) : "WorkingDocument-bl-instructions"
] as AbilityTuple<"Update", "WorkingDocument-bl-instructions" | ForcedSubject<"WorkingDocument-bl-instructions"> & { officeId: string, }>;

}
