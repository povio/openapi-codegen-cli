import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace RemarkTemplatesAcl {
/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description List remark template labels for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Read", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List remark templates
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Read", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create a new remark template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Create", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get remark template by ID
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Read", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update remark template by ID
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Update", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive remark template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Archive", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive remark template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Unarchive",
  object ? subject("RemarkTemplate", object) : "RemarkTemplate"
] as AbilityTuple<"Unarchive", "RemarkTemplate" | ForcedSubject<"RemarkTemplate"> & { officeId: string, }>;

}
