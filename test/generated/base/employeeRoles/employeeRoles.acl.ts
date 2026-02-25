import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace EmployeeRolesAcl {
  /**
   * Use for `useList` query ability. For global ability, omit the object parameter.
   * @description List all possible roles
   * @param { string } object.context context from filter query parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
   */
  export const canUseList = (object?: { context?: string }) =>
    ["Read", object ? subject("Role", object) : "Role"] as AbilityTuple<
      "Read",
      "Role" | (ForcedSubject<"Role"> & { context?: string })
    >;

  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "Role"] as AbilityTuple<"Create", "Role">;

  /**
   * Use for `useLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useLabels` query
   */
  export const canUseLabels = () => ["Read", "Role"] as AbilityTuple<"Read", "Role">;

  /**
   * Use for `useFind` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFind` query
   */
  export const canUseFind = () => ["Read", "Role"] as AbilityTuple<"Read", "Role">;

  /**
   * Use for `useUpdate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "Role"] as AbilityTuple<"Update", "Role">;

  /**
   * Use for `useDeleteEmployeesRolesByRoleId` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteEmployeesRolesByRoleId` mutation
   */
  export const canUseDeleteEmployeesRolesByRoleId = () => ["Delete", "Role"] as AbilityTuple<"Delete", "Role">;

  /**
   * Use for `usePaginatePermissions` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginatePermissions` query
   */
  export const canUsePaginatePermissions = () => ["Read", "Role"] as AbilityTuple<"Read", "Role">;

  /**
   * Use for `useTogglePermission` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useTogglePermission` mutation
   */
  export const canUseTogglePermission = () => ["Update", "Role"] as AbilityTuple<"Update", "Role">;

  /**
   * Use for `useCopy` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCopy` mutation
   */
  export const canUseCopy = () => ["Create", "Role"] as AbilityTuple<"Create", "Role">;
}
