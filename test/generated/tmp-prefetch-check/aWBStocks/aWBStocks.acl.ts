import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace AWBStocksAcl {
/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List AWB stocks
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Read", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create AWB stock
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Create", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get AWB stock details
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Read", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update AWB stock
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Update", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive AWB stock
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Update", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive AWB stock
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Update", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

/**
 * Use for `useGenerateNextNumber` mutation ability. For global ability, omit the object parameter.
 * @description Generate next AWB number
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateNextNumber` mutation
 */
export const canUseGenerateNextNumber = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("AWBStock", object) : "AWBStock"
] as AbilityTuple<"Update", "AWBStock" | ForcedSubject<"AWBStock"> & { officeId: string, }>;

}
