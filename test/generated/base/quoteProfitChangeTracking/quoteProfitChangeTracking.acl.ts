import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace QuoteProfitChangeTrackingAcl {
/**
 * Use for `useFindProfitChangeGroups` query ability. For global ability, omit the object parameter.
 * @description List quote profit change groups
 * @param { string } object.officeId officeId from officeId path parameter
 * @param { string } object.quoteId quoteId from quoteId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindProfitChangeGroups` query
 */
export const canUseFindProfitChangeGroups = (
  object?: { officeId: string, quoteId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, quoteId: string, }>;

/**
 * Use for `useFindProfitChangeGroupDetail` query ability. For global ability, omit the object parameter.
 * @description Get quote profit change group details
 * @param { string } object.officeId officeId from officeId path parameter
 * @param { string } object.quoteId quoteId from quoteId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindProfitChangeGroupDetail` query
 */
export const canUseFindProfitChangeGroupDetail = (
  object?: { officeId: string, quoteId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, quoteId: string, }>;

}
