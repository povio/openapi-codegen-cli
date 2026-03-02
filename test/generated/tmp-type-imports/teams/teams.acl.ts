import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace TeamsAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create team in office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Create", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List teams for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Read", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description Get team labels for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Read", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get team by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Read", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update team
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Update", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useBulkAddMembers` mutation ability. For global ability, omit the object parameter.
 * @description Add members to team
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useBulkAddMembers` mutation
 */
export const canUseBulkAddMembers = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Update", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useBulkRemoveMembers` mutation ability. For global ability, omit the object parameter.
 * @description Remove members from team
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useBulkRemoveMembers` mutation
 */
export const canUseBulkRemoveMembers = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Update", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive team
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Archive", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive team
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("Team", object) : "Team"
] as AbilityTuple<"Archive", "Team" | ForcedSubject<"Team"> & { officeId: string, }>;

}
