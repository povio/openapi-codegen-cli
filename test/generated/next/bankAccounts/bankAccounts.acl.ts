import { AbilityTuple } from "@casl/ability";

export namespace BankAccountsAcl {
/**
 * Use for `useFindAll` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
 */
export const canUseFindAll = (
) => [
  "Read",
  "Office"
] as AbilityTuple<"Read", "Office">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "Office"
] as AbilityTuple<"Read", "Office">;

}
