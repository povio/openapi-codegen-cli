import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace EmploymentAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create new employment
 * @param { string } object.officeId officeId from mutation data
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"Create", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List employments
 * @param { string } object.officeId officeId from filter query parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId?: string,  } 
) => [
  "Read",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"Read", "Employment" | ForcedSubject<"Employment"> & { officeId?: string, }>;

/**
 * Use for `useListRoles` query ability. For global ability, omit the object parameter.
 * @description List employment roles
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListRoles` query
 */
export const canUseListRoles = (
  object?: { officeId: string,  } 
) => [
  "ListRoles",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"ListRoles", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

/**
 * Use for `useUpdateRoles` mutation ability. For global ability, omit the object parameter.
 * @description Update employment roles
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateRoles` mutation
 */
export const canUseUpdateRoles = (
  object?: { officeId: string,  } 
) => [
  "UpdateRoles",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"UpdateRoles", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update employment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"Create", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive employment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"Archive", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive employment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Unarchive",
  object ? subject("Employment", object) : "Employment"
] as AbilityTuple<"Unarchive", "Employment" | ForcedSubject<"Employment"> & { officeId: string, }>;

}
