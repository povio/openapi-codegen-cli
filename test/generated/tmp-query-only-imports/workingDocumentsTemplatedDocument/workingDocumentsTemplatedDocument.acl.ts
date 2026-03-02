import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace WorkingDocumentsTemplatedDocumentAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Create", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `useGetTemplatedDocument` query ability. For global ability, omit the object parameter.
 * @description Read templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetTemplatedDocument` query
 */
export const canUseGetTemplatedDocument = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Read", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `useUpdateTemplatedDocument` mutation ability. For global ability, omit the object parameter.
 * @description Update templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateTemplatedDocument` mutation
 */
export const canUseUpdateTemplatedDocument = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Update", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `useDeleteTemplatedDocument` mutation ability. For global ability, omit the object parameter.
 * @description Delete templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteTemplatedDocument` mutation
 */
export const canUseDeleteTemplatedDocument = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Delete", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `usePreviewTemplatedDocument` mutation ability. For global ability, omit the object parameter.
 * @description Preview templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewTemplatedDocument` mutation
 */
export const canUsePreviewTemplatedDocument = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Read", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `useIssueTemplatedDocument` mutation ability. For global ability, omit the object parameter.
 * @description Issue templated document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useIssueTemplatedDocument` mutation
 */
export const canUseIssueTemplatedDocument = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Update", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

/**
 * Use for `useGenerateDocumentEml` mutation ability. For global ability, omit the object parameter.
 * @description Generate templated document EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateDocumentEml` mutation
 */
export const canUseGenerateDocumentEml = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-templated-document", object) : "WorkingDocument-templated-document"
] as AbilityTuple<"Update", "WorkingDocument-templated-document" | ForcedSubject<"WorkingDocument-templated-document"> & { officeId: string, }>;

}
