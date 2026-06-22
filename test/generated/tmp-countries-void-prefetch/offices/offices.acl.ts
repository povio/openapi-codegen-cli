import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace OfficesAcl {
/**
 * Use for `useCreate` mutation ability. 
 * @description Create office
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "Office"
] as AbilityTuple<"Create", "Office">;

/**
 * Use for `useGet` query ability. 
 * @description Read office
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
 */
export const canUseGet = (
) => [
  "Read",
  "Office"
] as AbilityTuple<"Read", "Office">;

/**
 * Use for `useUpdate` mutation ability. 
 * @description Update office
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "Office"
] as AbilityTuple<"Update", "Office">;

/**
 * Use for `useUploadDocumentImage` mutation ability. For global ability, omit the object parameter.
 * @description Upload office document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUploadDocumentImage` mutation
 */
export const canUseUploadDocumentImage = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Office", object) : "Office"
] as AbilityTuple<"Update", "Office" | ForcedSubject<"Office"> & { officeId: string, }>;

/**
 * Use for `useCreateBankAccount` mutation ability. For global ability, omit the object parameter.
 * @description Create office bank account
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateBankAccount` mutation
 */
export const canUseCreateBankAccount = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Office", object) : "Office"
] as AbilityTuple<"Update", "Office" | ForcedSubject<"Office"> & { officeId: string, }>;

/**
 * Use for `useUpdateBankAccount` mutation ability. For global ability, omit the object parameter.
 * @description Update office bank account
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBankAccount` mutation
 */
export const canUseUpdateBankAccount = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Office", object) : "Office"
] as AbilityTuple<"Update", "Office" | ForcedSubject<"Office"> & { officeId: string, }>;

/**
 * Use for `useDeleteBankAccount` mutation ability. For global ability, omit the object parameter.
 * @description Delete office bank account
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteBankAccount` mutation
 */
export const canUseDeleteBankAccount = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Office", object) : "Office"
] as AbilityTuple<"Update", "Office" | ForcedSubject<"Office"> & { officeId: string, }>;

/**
 * Use for `useUploadBankAccountFooter` mutation ability. For global ability, omit the object parameter.
 * @description Upload bank account footer
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUploadBankAccountFooter` mutation
 */
export const canUseUploadBankAccountFooter = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Office", object) : "Office"
] as AbilityTuple<"Update", "Office" | ForcedSubject<"Office"> & { officeId: string, }>;

}
