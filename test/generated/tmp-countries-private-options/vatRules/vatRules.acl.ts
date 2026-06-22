import { AbilityTuple } from "@casl/ability";

export namespace VatRulesAcl {
/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "VatRule"
] as AbilityTuple<"Read", "VatRule">;

/**
 * Use for `useList` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
) => [
  "Read",
  "VatRule"
] as AbilityTuple<"Read", "VatRule">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "VatRule"
] as AbilityTuple<"Create", "VatRule">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "VatRule"
] as AbilityTuple<"Read", "VatRule">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "VatRule"
] as AbilityTuple<"Update", "VatRule">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Update",
  "VatRule"
] as AbilityTuple<"Update", "VatRule">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Update",
  "VatRule"
] as AbilityTuple<"Update", "VatRule">;

}
