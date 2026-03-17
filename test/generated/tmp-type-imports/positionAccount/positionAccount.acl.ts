import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace PositionAccountAcl {
/**
 * Use for `useGet` query ability. For global ability, omit the object parameter.
 * @description List positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
 */
export const canUseGet = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Read", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

}
