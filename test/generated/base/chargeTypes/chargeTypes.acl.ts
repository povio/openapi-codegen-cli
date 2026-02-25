import { AbilityTuple } from "@casl/ability";

export namespace ChargeTypesAcl {
/**
 * Use for `useFindAll` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
 */
export const canUseFindAll = (
) => [
  "Read",
  "ChargeType"
] as AbilityTuple<"Read", "ChargeType">;

/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "ChargeType"
] as AbilityTuple<"Read", "ChargeType">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "ChargeType"
] as AbilityTuple<"Create", "ChargeType">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "ChargeType"
] as AbilityTuple<"Read", "ChargeType">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "ChargeType"
] as AbilityTuple<"Update", "ChargeType">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Archive",
  "ChargeType"
] as AbilityTuple<"Archive", "ChargeType">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Archive",
  "ChargeType"
] as AbilityTuple<"Archive", "ChargeType">;

}
