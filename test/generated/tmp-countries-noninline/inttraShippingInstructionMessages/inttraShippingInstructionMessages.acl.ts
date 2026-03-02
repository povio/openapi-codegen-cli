import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace InttraShippingInstructionMessagesAcl {
/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List SI messages
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-shipping-instructions", object) : "WorkingDocument-shipping-instructions"
] as AbilityTuple<"Read", "WorkingDocument-shipping-instructions" | ForcedSubject<"WorkingDocument-shipping-instructions"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create SI message
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-shipping-instructions", object) : "WorkingDocument-shipping-instructions"
] as AbilityTuple<"Update", "WorkingDocument-shipping-instructions" | ForcedSubject<"WorkingDocument-shipping-instructions"> & { officeId: string, }>;

/**
 * Use for `useGetById` query ability. For global ability, omit the object parameter.
 * @description Get SI message details
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetById` query
 */
export const canUseGetById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-shipping-instructions", object) : "WorkingDocument-shipping-instructions"
] as AbilityTuple<"Read", "WorkingDocument-shipping-instructions" | ForcedSubject<"WorkingDocument-shipping-instructions"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update SI message
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-shipping-instructions", object) : "WorkingDocument-shipping-instructions"
] as AbilityTuple<"Update", "WorkingDocument-shipping-instructions" | ForcedSubject<"WorkingDocument-shipping-instructions"> & { officeId: string, }>;

}
