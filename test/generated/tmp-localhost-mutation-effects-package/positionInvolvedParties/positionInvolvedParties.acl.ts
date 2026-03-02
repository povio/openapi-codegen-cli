import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionInvolvedPartiesAcl {
/**
 * Use for `useFindByPositionId` query ability. For global ability, omit the object parameter.
 * @description List position involved parties
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindByPositionId` query
 */
export const canUseFindByPositionId = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Read", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create position involved party
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update position involved party
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

/**
 * Use for `useDeleteOfficesPositionsInvolvedPartiesByPartyId` mutation ability. For global ability, omit the object parameter.
 * @description Delete position involved party
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteOfficesPositionsInvolvedPartiesByPartyId` mutation
 */
export const canUseDeleteOfficesPositionsInvolvedPartiesByPartyId = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Position", object) : "Position"
] as AbilityTuple<"Update", "Position" | ForcedSubject<"Position"> & { officeId: string, }>;

}
