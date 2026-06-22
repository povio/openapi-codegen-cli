import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace BusinessPartnerContactsAcl {
/**
 * Use for `useGetContacts` query ability. For global ability, omit the object parameter.
 * @description List business partner contacts
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetContacts` query
 */
export const canUseGetContacts = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useCreateContact` mutation ability. For global ability, omit the object parameter.
 * @description Create business partner contact
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateContact` mutation
 */
export const canUseCreateContact = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `usePaginateContactLabels` query ability. For global ability, omit the object parameter.
 * @description Paginate business partner contact labels
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateContactLabels` query
 */
export const canUsePaginateContactLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdateContact` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner contact
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateContact` mutation
 */
export const canUseUpdateContact = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useDeleteContact` mutation ability. For global ability, omit the object parameter.
 * @description Delete business partner contact
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteContact` mutation
 */
export const canUseDeleteContact = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

}
