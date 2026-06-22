import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace FactoringExportAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create factoring export
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("FactoringExport", object) : "FactoringExport"
] as AbilityTuple<"Create", "FactoringExport" | ForcedSubject<"FactoringExport"> & { officeId: string, }>;

/**
 * Use for `useGetBatch` query ability. For global ability, omit the object parameter.
 * @description Read factoring export
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetBatch` query
 */
export const canUseGetBatch = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("FactoringExport", object) : "FactoringExport"
] as AbilityTuple<"Read", "FactoringExport" | ForcedSubject<"FactoringExport"> & { officeId: string, }>;

}
