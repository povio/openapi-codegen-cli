import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace QuoteConversionAcl {
  /**
   * Use for `useConvertQuoteToPosition` mutation ability. For global ability, omit the object parameter.
   * @description Create position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useConvertQuoteToPosition` mutation
   */
  export const canUseConvertQuoteToPosition = (object?: { officeId: string }) =>
    ["Create", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Create",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;
}
