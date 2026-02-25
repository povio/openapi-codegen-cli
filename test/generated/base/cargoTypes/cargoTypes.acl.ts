import { AbilityTuple } from "@casl/ability";

export namespace CargoTypesAcl {
  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "CargoType"] as AbilityTuple<"Read", "CargoType">;

  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "CargoType"] as AbilityTuple<"Create", "CargoType">;

  /**
   * Use for `usePaginateLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
   */
  export const canUsePaginateLabels = () => ["Read", "CargoType"] as AbilityTuple<"Read", "CargoType">;

  /**
   * Use for `useFindById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = () => ["Read", "CargoType"] as AbilityTuple<"Read", "CargoType">;

  /**
   * Use for `useUpdate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "CargoType"] as AbilityTuple<"Update", "CargoType">;

  /**
   * Use for `useArchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
   */
  export const canUseArchive = () => ["Archive", "CargoType"] as AbilityTuple<"Archive", "CargoType">;

  /**
   * Use for `useUnarchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
   */
  export const canUseUnarchive = () => ["Archive", "CargoType"] as AbilityTuple<"Archive", "CargoType">;
}
