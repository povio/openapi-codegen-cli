import { AbilityTuple } from "@casl/ability";

export namespace MasterDataAcl {
  /**
   * Use for `useFindAll` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
   */
  export const canUseFindAll = () => ["Read", "Depot"] as AbilityTuple<"Read", "Depot">;

  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "Depot"] as AbilityTuple<"Read", "Depot">;
}
