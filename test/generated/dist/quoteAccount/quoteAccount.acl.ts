import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace QuoteAccountAcl {
  /**
   * Use for `useGet` query ability. For global ability, omit the object parameter.
   * @description List quotes for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
   */
  export const canUseGet = (object?: { officeId: string }) =>
    ["Read", object ? subject("Quote", object) : "Quote"] as AbilityTuple<
      "Read",
      "Quote" | (ForcedSubject<"Quote"> & { officeId: string })
    >;

  /**
   * Use for `useCreateItem` mutation ability. For global ability, omit the object parameter.
   * @description Update quotes for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateItem` mutation
   */
  export const canUseCreateItem = (object?: { officeId: string }) =>
    ["Update", object ? subject("Quote", object) : "Quote"] as AbilityTuple<
      "Update",
      "Quote" | (ForcedSubject<"Quote"> & { officeId: string })
    >;

  /**
   * Use for `useDeleteItem` mutation ability. For global ability, omit the object parameter.
   * @description Update quotes for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteItem` mutation
   */
  export const canUseDeleteItem = (object?: { officeId: string }) =>
    ["Update", object ? subject("Quote", object) : "Quote"] as AbilityTuple<
      "Update",
      "Quote" | (ForcedSubject<"Quote"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateItem` mutation ability. For global ability, omit the object parameter.
   * @description Update quotes for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateItem` mutation
   */
  export const canUseUpdateItem = (object?: { officeId: string }) =>
    ["Update", object ? subject("Quote", object) : "Quote"] as AbilityTuple<
      "Update",
      "Quote" | (ForcedSubject<"Quote"> & { officeId: string })
    >;

  /**
   * Use for `useDuplicateItem` mutation ability. For global ability, omit the object parameter.
   * @description Update quotes for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicateItem` mutation
   */
  export const canUseDuplicateItem = (object?: { officeId: string }) =>
    ["Update", object ? subject("Quote", object) : "Quote"] as AbilityTuple<
      "Update",
      "Quote" | (ForcedSubject<"Quote"> & { officeId: string })
    >;
}
