import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace QuotesAcl {
/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List quotes for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create quotes for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Create", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useListAvailablePartnersFor` query ability. For global ability, omit the object parameter.
 * @description List available partners for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListAvailablePartnersFor` query
 */
export const canUseListAvailablePartnersFor = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useExportQuotes` mutation ability. For global ability, omit the object parameter.
 * @description Export quotes for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportQuotes` mutation
 */
export const canUseExportQuotes = (
  object?: { officeId: string,  } 
) => [
  "Export",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Export", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useGetById` query ability. For global ability, omit the object parameter.
 * @description Get quote by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetById` query
 */
export const canUseGetById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useCancel` mutation ability. For global ability, omit the object parameter.
 * @description Cancel quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCancel` mutation
 */
export const canUseCancel = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useDuplicate` mutation ability. For global ability, omit the object parameter.
 * @description Duplicate quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicate` mutation
 */
export const canUseDuplicate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Create", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useGetInvolvedParties` query ability. For global ability, omit the object parameter.
 * @description Get involved parties for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetInvolvedParties` query
 */
export const canUseGetInvolvedParties = (
  object?: { officeId: string,  } 
) => [
  "ReadInvolvedParties",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"ReadInvolvedParties", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useCreateInvolvedParty` mutation ability. For global ability, omit the object parameter.
 * @description Create involved party for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateInvolvedParty` mutation
 */
export const canUseCreateInvolvedParty = (
  object?: { officeId: string,  } 
) => [
  "CreateInvolvedParties",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"CreateInvolvedParties", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useUpdateInvolvedParty` mutation ability. For global ability, omit the object parameter.
 * @description Update involved party for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateInvolvedParty` mutation
 */
export const canUseUpdateInvolvedParty = (
  object?: { officeId: string,  } 
) => [
  "UpdateInvolvedParties",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"UpdateInvolvedParties", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useDeleteInvolvedParty` mutation ability. For global ability, omit the object parameter.
 * @description Delete involved party for quote
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteInvolvedParty` mutation
 */
export const canUseDeleteInvolvedParty = (
  object?: { officeId: string,  } 
) => [
  "DeleteInvolvedParties",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"DeleteInvolvedParties", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

}
