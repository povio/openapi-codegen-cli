import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace WorkingDocumentsHouseAwbAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Create", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

/**
 * Use for `useGetHouseAwbData` query ability. For global ability, omit the object parameter.
 * @description Read House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetHouseAwbData` query
 */
export const canUseGetHouseAwbData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Read", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

/**
 * Use for `useUpdateHouseAwbData` mutation ability. For global ability, omit the object parameter.
 * @description Update House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateHouseAwbData` mutation
 */
export const canUseUpdateHouseAwbData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Update", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

/**
 * Use for `useDeleteHouseAwb` mutation ability. For global ability, omit the object parameter.
 * @description Delete House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteHouseAwb` mutation
 */
export const canUseDeleteHouseAwb = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Delete", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

/**
 * Use for `usePreviewHouseAwb` query or `usePreviewHouseAwbMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewHouseAwb` query or `usePreviewHouseAwbMutation` mutation
 */
export const canUsePreviewHouseAwb = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Read", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

/**
 * Use for `useGenerateHouseAwb` mutation ability. For global ability, omit the object parameter.
 * @description Generate House AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateHouseAwb` mutation
 */
export const canUseGenerateHouseAwb = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-house-awb", object) : "WorkingDocument-house-awb"
] as AbilityTuple<"Update", "WorkingDocument-house-awb" | ForcedSubject<"WorkingDocument-house-awb"> & { officeId: string, }>;

}
