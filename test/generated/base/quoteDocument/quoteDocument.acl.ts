import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace QuoteDocumentAcl {
/**
 * Use for `useGet` query ability. For global ability, omit the object parameter.
 * @description Read quote document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
 */
export const canUseGet = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update quote document
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
 * Use for `useGetPreview` mutation ability. For global ability, omit the object parameter.
 * @description Read quote document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetPreview` mutation
 */
export const canUseGetPreview = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useGenerate` mutation ability. For global ability, omit the object parameter.
 * @description Read quote document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerate` mutation
 */
export const canUseGenerate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useGenerateEml` mutation ability. For global ability, omit the object parameter.
 * @description Read quote document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateEml` mutation
 */
export const canUseGenerateEml = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

}
