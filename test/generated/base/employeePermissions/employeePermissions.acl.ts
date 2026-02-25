import { AbilityTuple } from "@casl/ability";

export namespace EmployeePermissionsAcl {
/**
 * Use for `usePaginatePermissions` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginatePermissions` query
 */
export const canUsePaginatePermissions = (
) => [
  "Read",
  "Permission"
] as AbilityTuple<"Read", "Permission">;

/**
 * Use for `useFindAll` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
 */
export const canUseFindAll = (
) => [
  "Read",
  "Permission"
] as AbilityTuple<"Read", "Permission">;

}
