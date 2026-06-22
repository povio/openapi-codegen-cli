import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace DocumentTemplatesAcl {
/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description List document template labels for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Read", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List document templates
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Read", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create a new document template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Create", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get document template by ID
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Read", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update document template by ID
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Update", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useAddRemarkBlock` mutation ability. For global ability, omit the object parameter.
 * @description Add remark block to document template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useAddRemarkBlock` mutation
 */
export const canUseAddRemarkBlock = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Update", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useDeleteRemarkBlock` mutation ability. For global ability, omit the object parameter.
 * @description Delete remark block from document template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteRemarkBlock` mutation
 */
export const canUseDeleteRemarkBlock = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Update", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive document template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Archive", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive document template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Unarchive",
  object ? subject("DocumentTemplate", object) : "DocumentTemplate"
] as AbilityTuple<"Unarchive", "DocumentTemplate" | ForcedSubject<"DocumentTemplate"> & { officeId: string, }>;

}
