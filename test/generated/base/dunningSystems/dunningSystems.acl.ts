import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace DunningSystemsAcl {
/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description List dunning system labels
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Read", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List dunning systems
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Read", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create dunning system
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Create", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get dunning system by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Read", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update dunning system
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Update", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive dunning system
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Archive", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive dunning system
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("DunningSystem", object) : "DunningSystem"
] as AbilityTuple<"Archive", "DunningSystem" | ForcedSubject<"DunningSystem"> & { officeId: string, }>;

}
