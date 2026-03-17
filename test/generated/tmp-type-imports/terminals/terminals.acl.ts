import { type AbilityTuple } from "@casl/ability";

export namespace TerminalsAcl {
/**
 * Use for `useCreate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
) => [
  "Create",
  "Terminal"
] as AbilityTuple<"Create", "Terminal">;

/**
 * Use for `usePaginate` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
) => [
  "Read",
  "Terminal"
] as AbilityTuple<"Read", "Terminal">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "Terminal"
] as AbilityTuple<"Read", "Terminal">;

/**
 * Use for `useGetById` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetById` query
 */
export const canUseGetById = (
) => [
  "Read",
  "Terminal"
] as AbilityTuple<"Read", "Terminal">;

/**
 * Use for `useUpdate` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "Terminal"
] as AbilityTuple<"Update", "Terminal">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Archive",
  "Terminal"
] as AbilityTuple<"Archive", "Terminal">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Unarchive",
  "Terminal"
] as AbilityTuple<"Unarchive", "Terminal">;

}
