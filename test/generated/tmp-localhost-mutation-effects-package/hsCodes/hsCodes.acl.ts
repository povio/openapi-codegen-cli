import { AbilityTuple } from "@casl/ability";

export namespace HsCodesAcl {
/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "HsCode"
] as AbilityTuple<"Read", "HsCode">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "HsCode"
] as AbilityTuple<"Create", "HsCode">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "HsCode"
] as AbilityTuple<"Read", "HsCode">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "HsCode"
] as AbilityTuple<"Read", "HsCode">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "HsCode"
] as AbilityTuple<"Update", "HsCode">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Archive",
  "HsCode"
] as AbilityTuple<"Archive", "HsCode">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Archive",
  "HsCode"
] as AbilityTuple<"Archive", "HsCode">;

}
