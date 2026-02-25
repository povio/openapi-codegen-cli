import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsCmrFormAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Create", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

/**
 * Use for `useGetCmrData` query ability. For global ability, omit the object parameter.
 * @description Read CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCmrData` query
 */
export const canUseGetCmrData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Read", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

/**
 * Use for `useUpdateCmrData` mutation ability. For global ability, omit the object parameter.
 * @description Update CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCmrData` mutation
 */
export const canUseUpdateCmrData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Update", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

/**
 * Use for `useDeleteCmr` mutation ability. For global ability, omit the object parameter.
 * @description Delete CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteCmr` mutation
 */
export const canUseDeleteCmr = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Delete", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

/**
 * Use for `usePreviewCmr` query or `usePreviewCmrMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewCmr` query or `usePreviewCmrMutation` mutation
 */
export const canUsePreviewCmr = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Read", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

/**
 * Use for `useGenerateCmr` mutation ability. For global ability, omit the object parameter.
 * @description Generate CMR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateCmr` mutation
 */
export const canUseGenerateCmr = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-cmr-form", object) : "WorkingDocument-cmr-form"
] as AbilityTuple<"Update", "WorkingDocument-cmr-form" | ForcedSubject<"WorkingDocument-cmr-form"> & { officeId: string, }>;

}
