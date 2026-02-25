import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace DunningManagementAcl {
/**
 * Use for `useListDunnings` query ability. For global ability, omit the object parameter.
 * @description List dunnings
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListDunnings` query
 */
export const canUseListDunnings = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Dunning", object) : "Dunning"
] as AbilityTuple<"Read", "Dunning" | ForcedSubject<"Dunning"> & { officeId: string, }>;

/**
 * Use for `useCreateDunningWithInvoices` mutation ability. For global ability, omit the object parameter.
 * @description Create dunning
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateDunningWithInvoices` mutation
 */
export const canUseCreateDunningWithInvoices = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Dunning", object) : "Dunning"
] as AbilityTuple<"Create", "Dunning" | ForcedSubject<"Dunning"> & { officeId: string, }>;

/**
 * Use for `useGetDunningEml` query or `useGetDunningEmlMutation` mutation ability. For global ability, omit the object parameter.
 * @description Download dunning as EML
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetDunningEml` query or `useGetDunningEmlMutation` mutation
 */
export const canUseGetDunningEml = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Dunning", object) : "Dunning"
] as AbilityTuple<"Read", "Dunning" | ForcedSubject<"Dunning"> & { officeId: string, }>;

}
