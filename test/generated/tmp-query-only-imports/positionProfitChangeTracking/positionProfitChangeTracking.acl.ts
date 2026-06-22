import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace PositionProfitChangeTrackingAcl {
/**
 * Use for `useFindProfitChangeGroups` query ability. For global ability, omit the object parameter.
 * @description List position profit change groups
 * @param { string } object.officeId officeId from officeId path parameter
 * @param { string } object.positionId positionId from positionId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindProfitChangeGroups` query
 */
export const canUseFindProfitChangeGroups = (
  object?: { officeId: string, positionId: string,  } 
) => [
  "Read",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Read", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, positionId: string, }>;

/**
 * Use for `useFindProfitChangeGroupDetail` query ability. For global ability, omit the object parameter.
 * @description Get position profit change group details
 * @param { string } object.officeId officeId from officeId path parameter
 * @param { string } object.positionId positionId from positionId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindProfitChangeGroupDetail` query
 */
export const canUseFindProfitChangeGroupDetail = (
  object?: { officeId: string, positionId: string,  } 
) => [
  "Read",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Read", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, positionId: string, }>;

}
