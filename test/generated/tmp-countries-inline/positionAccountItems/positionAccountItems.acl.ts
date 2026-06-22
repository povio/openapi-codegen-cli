import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionAccountItemsAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Update", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

/**
 * Use for `useDeletePositionAccountItems` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeletePositionAccountItems` mutation
 */
export const canUseDeletePositionAccountItems = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Update", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Update", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

/**
 * Use for `useDuplicate` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicate` mutation
 */
export const canUseDuplicate = (
  object?: { officeId: string,  } 
) => [
  "Duplicate",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Duplicate", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

/**
 * Use for `useReassign` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useReassign` mutation
 */
export const canUseReassign = (
  object?: { officeId: string,  } 
) => [
  "Reassign",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Reassign", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

/**
 * Use for `useReorder` mutation ability. For global ability, omit the object parameter.
 * @description Update positions for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useReorder` mutation
 */
export const canUseReorder = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionAccount", object) : "PositionAccount"
] as AbilityTuple<"Update", "PositionAccount" | ForcedSubject<"PositionAccount"> & { officeId: string, }>;

}
