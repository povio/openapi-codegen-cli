import { AbilityTuple } from "@casl/ability";

export namespace CountriesAcl {
  /**
   * Use for `usePaginate` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = () => ["Read", "Country"] as AbilityTuple<"Read", "Country">;

  /**
   * Use for `usePaginateCountryLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateCountryLabels` query
   */
  export const canUsePaginateCountryLabels = () => ["Read", "Country"] as AbilityTuple<"Read", "Country">;

  /**
   * Use for `useGetCountryById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCountryById` query
   */
  export const canUseGetCountryById = () => ["Read", "Country"] as AbilityTuple<"Read", "Country">;
}
