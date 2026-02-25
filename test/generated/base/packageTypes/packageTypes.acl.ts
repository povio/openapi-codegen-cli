import { AbilityTuple } from "@casl/ability";

export namespace PackageTypesAcl {
  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "PackageType"] as AbilityTuple<"Read", "PackageType">;

  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "PackageType"] as AbilityTuple<"Create", "PackageType">;

  /**
   * Use for `usePaginateLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
   */
  export const canUsePaginateLabels = () => ["Read", "PackageType"] as AbilityTuple<"Read", "PackageType">;

  /**
   * Use for `useFindById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = () => ["Read", "PackageType"] as AbilityTuple<"Read", "PackageType">;

  /**
   * Use for `useUpdate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "PackageType"] as AbilityTuple<"Update", "PackageType">;

  /**
   * Use for `useArchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
   */
  export const canUseArchive = () => ["Archive", "PackageType"] as AbilityTuple<"Archive", "PackageType">;

  /**
   * Use for `useUnarchive` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
   */
  export const canUseUnarchive = () => ["Archive", "PackageType"] as AbilityTuple<"Archive", "PackageType">;
}
