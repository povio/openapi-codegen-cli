import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsHouseBlAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Create", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `useGetHouseBlData` query ability. For global ability, omit the object parameter.
 * @description Read house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetHouseBlData` query
 */
export const canUseGetHouseBlData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Read", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `useUpdateHouseBlData` mutation ability. For global ability, omit the object parameter.
 * @description Update house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateHouseBlData` mutation
 */
export const canUseUpdateHouseBlData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Update", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `useDeleteHouseBl` mutation ability. For global ability, omit the object parameter.
 * @description Delete house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteHouseBl` mutation
 */
export const canUseDeleteHouseBl = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Delete", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `usePreviewHouseBl` query or `usePreviewHouseBlMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewHouseBl` query or `usePreviewHouseBlMutation` mutation
 */
export const canUsePreviewHouseBl = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Read", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `usePreviewHouseBlEml` query or `usePreviewHouseBlEmlMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview house BL document EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewHouseBlEml` query or `usePreviewHouseBlEmlMutation` mutation
 */
export const canUsePreviewHouseBlEml = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Read", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `useGenerateHouseBl` mutation ability. For global ability, omit the object parameter.
 * @description Generate house BL document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateHouseBl` mutation
 */
export const canUseGenerateHouseBl = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Update", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

/**
 * Use for `useGenerateDocumentEml` mutation ability. For global ability, omit the object parameter.
 * @description Generate house BL document EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateDocumentEml` mutation
 */
export const canUseGenerateDocumentEml = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-house-bl", object) : "WorkingDocument-house-bl"
] as AbilityTuple<"Update", "WorkingDocument-house-bl" | ForcedSubject<"WorkingDocument-house-bl"> & { officeId: string, }>;

}
