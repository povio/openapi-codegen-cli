import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsFcrFormAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Create", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

/**
 * Use for `useGetFcrData` query ability. For global ability, omit the object parameter.
 * @description Read FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetFcrData` query
 */
export const canUseGetFcrData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Read", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

/**
 * Use for `useUpdateFcrData` mutation ability. For global ability, omit the object parameter.
 * @description Update FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateFcrData` mutation
 */
export const canUseUpdateFcrData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Update", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

/**
 * Use for `useDeleteFcr` mutation ability. For global ability, omit the object parameter.
 * @description Delete FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteFcr` mutation
 */
export const canUseDeleteFcr = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Delete", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

/**
 * Use for `usePreviewFcr` query or `usePreviewFcrMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewFcr` query or `usePreviewFcrMutation` mutation
 */
export const canUsePreviewFcr = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Read", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

/**
 * Use for `useGenerateFcr` mutation ability. For global ability, omit the object parameter.
 * @description Generate FCR document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateFcr` mutation
 */
export const canUseGenerateFcr = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-fcr-form", object) : "WorkingDocument-fcr-form"
] as AbilityTuple<"Update", "WorkingDocument-fcr-form" | ForcedSubject<"WorkingDocument-fcr-form"> & { officeId: string, }>;

}
