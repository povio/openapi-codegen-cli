import { AbilityTuple } from "@casl/ability";

export namespace AirportsAcl {
/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "Airport"
] as AbilityTuple<"Read", "Airport">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "Airport"
] as AbilityTuple<"Create", "Airport">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "Airport"
] as AbilityTuple<"Read", "Airport">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "Airport"
] as AbilityTuple<"Update", "Airport">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "Airport"
] as AbilityTuple<"Read", "Airport">;

}
