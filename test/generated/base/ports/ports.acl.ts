import { AbilityTuple } from "@casl/ability";

export namespace PortsAcl {
  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "Port"] as AbilityTuple<"Read", "Port">;

  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "Port"] as AbilityTuple<"Create", "Port">;

  /**
   * Use for `usePaginateLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
   */
  export const canUsePaginateLabels = () => ["Read", "Port"] as AbilityTuple<"Read", "Port">;

  /**
   * Use for `useUpdate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "Port"] as AbilityTuple<"Update", "Port">;

  /**
   * Use for `useFindById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = () => ["Read", "Port"] as AbilityTuple<"Read", "Port">;
}
