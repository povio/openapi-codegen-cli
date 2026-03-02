import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace ChecklistTemplatesAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create checklist template in office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Create", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List checklist templates for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Read", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description Get checklist template labels for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Read", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get checklist template by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Read", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update checklist template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Update", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive checklist template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Archive", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive checklist template
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("ChecklistTemplate", object) : "ChecklistTemplate"
] as AbilityTuple<"Archive", "ChecklistTemplate" | ForcedSubject<"ChecklistTemplate"> & { officeId: string, }>;

}
