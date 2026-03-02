import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionChecklistAcl {
/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List checklist items for position
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Read", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useApplyTemplates` mutation ability. For global ability, omit the object parameter.
 * @description Apply checklist templates to position
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useApplyTemplates` mutation
 */
export const canUseApplyTemplates = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useComplete` mutation ability. For global ability, omit the object parameter.
 * @description Complete position checklist item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useComplete` mutation
 */
export const canUseComplete = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useUncomplete` mutation ability. For global ability, omit the object parameter.
 * @description Uncomplete position checklist item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUncomplete` mutation
 */
export const canUseUncomplete = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useUpdateNotes` mutation ability. For global ability, omit the object parameter.
 * @description Update position checklist item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateNotes` mutation
 */
export const canUseUpdateNotes = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useReorder` mutation ability. For global ability, omit the object parameter.
 * @description Reorder position checklist items
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useReorder` mutation
 */
export const canUseReorder = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

}
