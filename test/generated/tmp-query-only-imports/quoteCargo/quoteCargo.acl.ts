import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace QuoteCargoAcl {
/**
 * Use for `useListCargosByQuoteId` query ability. For global ability, omit the object parameter.
 * @description List cargo items by quote id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListCargosByQuoteId` query
 */
export const canUseListCargosByQuoteId = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Read", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useListCargoLabels` query ability. For global ability, omit the object parameter.
 * @description List cargo labels by quote id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListCargoLabels` query
 */
export const canUseListCargoLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Read", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useGetCargoSummary` query ability. For global ability, omit the object parameter.
 * @description Get cargo summary by quote id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCargoSummary` query
 */
export const canUseGetCargoSummary = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Read", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useGetCargoById` query ability. For global ability, omit the object parameter.
 * @description Get cargo item by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCargoById` query
 */
export const canUseGetCargoById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Read", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useUpdateCargo` mutation ability. For global ability, omit the object parameter.
 * @description Update cargo item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCargo` mutation
 */
export const canUseUpdateCargo = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Update", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useDeleteCargo` mutation ability. For global ability, omit the object parameter.
 * @description Delete cargo item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteCargo` mutation
 */
export const canUseDeleteCargo = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Delete", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useCreateBulkCargos` mutation ability. For global ability, omit the object parameter.
 * @description Create cargo item for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateBulkCargos` mutation
 */
export const canUseCreateBulkCargos = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Create", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

/**
 * Use for `useDuplicateCargo` mutation ability. For global ability, omit the object parameter.
 * @description Duplicate cargo item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicateCargo` mutation
 */
export const canUseDuplicateCargo = (
  object?: { officeId: string,  } 
) => [
  "Duplicate",
  object ? subject("QuoteCargo", object) : "QuoteCargo"
] as AbilityTuple<"Duplicate", "QuoteCargo" | ForcedSubject<"QuoteCargo"> & { officeId: string, }>;

}
