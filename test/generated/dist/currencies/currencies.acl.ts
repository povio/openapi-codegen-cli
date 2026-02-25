import { AbilityTuple } from "@casl/ability";

export namespace CurrenciesAcl {
  /**
   * Use for `useList` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
   */
  export const canUseList = () => ["Read", "Currency"] as AbilityTuple<"Read", "Currency">;

  /**
   * Use for `useCreateCurrency` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateCurrency` mutation
   */
  export const canUseCreateCurrency = () => ["Create", "Currency"] as AbilityTuple<"Create", "Currency">;

  /**
   * Use for `usePaginateCurrencyLabels` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateCurrencyLabels` query
   */
  export const canUsePaginateCurrencyLabels = () => ["Read", "Currency"] as AbilityTuple<"Read", "Currency">;

  /**
   * Use for `useGetCurrencyById` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCurrencyById` query
   */
  export const canUseGetCurrencyById = () => ["Read", "Currency"] as AbilityTuple<"Read", "Currency">;

  /**
   * Use for `useUpdateCurrency` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCurrency` mutation
   */
  export const canUseUpdateCurrency = () => ["Update", "Currency"] as AbilityTuple<"Update", "Currency">;

  /**
   * Use for `usePaginateCurrencyLabelsByOffice` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateCurrencyLabelsByOffice` query
   */
  export const canUsePaginateCurrencyLabelsByOffice = () => ["Read", "Currency"] as AbilityTuple<"Read", "Currency">;
}
