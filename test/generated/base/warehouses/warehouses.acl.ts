import { AbilityTuple } from "@casl/ability";

export namespace WarehousesAcl {
  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "Warehouse"] as AbilityTuple<"Create", "Warehouse">;

  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "Warehouse"] as AbilityTuple<"Read", "Warehouse">;

  /**
   * Use for `usePaginateLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
   */
  export const canUsePaginateLabels = () => ["Read", "Warehouse"] as AbilityTuple<"Read", "Warehouse">;

  /**
   * Use for `useFindById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = () => ["Read", "Warehouse"] as AbilityTuple<"Read", "Warehouse">;

  /**
   * Use for `useUpdate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "Warehouse"] as AbilityTuple<"Update", "Warehouse">;

  /**
   * Use for `useArchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
   */
  export const canUseArchive = () => ["Archive", "Warehouse"] as AbilityTuple<"Archive", "Warehouse">;

  /**
   * Use for `useUnarchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
   */
  export const canUseUnarchive = () => ["Archive", "Warehouse"] as AbilityTuple<"Archive", "Warehouse">;
}
