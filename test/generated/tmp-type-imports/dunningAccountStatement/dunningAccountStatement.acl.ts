import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace DunningAccountStatementAcl {
/**
 * Use for `useGenerateAccountStatement` query or `useGenerateAccountStatementMutation` mutation ability. For global ability, omit the object parameter.
 * @description Generate account statement
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateAccountStatement` query or `useGenerateAccountStatementMutation` mutation
 */
export const canUseGenerateAccountStatement = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Read", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useGetAccountStatementEml` mutation ability. For global ability, omit the object parameter.
 * @description Download account statement as EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetAccountStatementEml` mutation
 */
export const canUseGetAccountStatementEml = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Read", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

}
