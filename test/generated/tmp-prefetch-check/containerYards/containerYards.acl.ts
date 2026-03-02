import { AbilityTuple } from "@casl/ability";

export namespace ContainerYardsAcl {
/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "ContainerYard"
] as AbilityTuple<"Read", "ContainerYard">;

/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "ContainerYard"
] as AbilityTuple<"Create", "ContainerYard">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "ContainerYard"
] as AbilityTuple<"Read", "ContainerYard">;

/**
 * Use for `useGetLabelById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetLabelById` query
 */
export const canUseGetLabelById = (
) => [
  "Read",
  "ContainerYard"
] as AbilityTuple<"Read", "ContainerYard">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Update",
  "ContainerYard"
] as AbilityTuple<"Update", "ContainerYard">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Update",
  "ContainerYard"
] as AbilityTuple<"Update", "ContainerYard">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "ContainerYard"
] as AbilityTuple<"Update", "ContainerYard">;

/**
 * Use for `useFindById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
) => [
  "Read",
  "ContainerYard"
] as AbilityTuple<"Read", "ContainerYard">;

}
