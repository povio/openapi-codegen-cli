import { AbilityTuple } from "@casl/ability";

export namespace CitiesAcl {
/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "City"
] as AbilityTuple<"Read", "City">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "City"
] as AbilityTuple<"Create", "City">;

/**
 * Use for `useListCityLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListCityLabels` query
 */
export const canUseListCityLabels = (
) => [
  "Read",
  "City"
] as AbilityTuple<"Read", "City">;

/**
 * Use for `useGetCityLabelById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCityLabelById` query
 */
export const canUseGetCityLabelById = (
) => [
  "Read",
  "City"
] as AbilityTuple<"Read", "City">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "City"
] as AbilityTuple<"Read", "City">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "City"
] as AbilityTuple<"Update", "City">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Archive",
  "City"
] as AbilityTuple<"Archive", "City">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Archive",
  "City"
] as AbilityTuple<"Archive", "City">;

}
