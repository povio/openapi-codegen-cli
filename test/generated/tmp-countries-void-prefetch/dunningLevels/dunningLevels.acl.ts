import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace DunningLevelsAcl {
/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description List dunning level labels
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Read", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List dunning levels
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Read", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create dunning level
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Create", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get dunning level by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Read", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update dunning level
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Update", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive a dunning level
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Archive", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive a dunning level
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Unarchive",
  object ? subject("DunningLevel", object) : "DunningLevel"
] as AbilityTuple<"Unarchive", "DunningLevel" | ForcedSubject<"DunningLevel"> & { officeId: string, }>;

}
