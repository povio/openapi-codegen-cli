import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PaymentConfirmationsAcl {
  /**
   * Use for `useGet` query ability. For global ability, omit the object parameter.
   * @description Read payment confirmation items
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
   */
  export const canUseGet = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGenerate` mutation ability. For global ability, omit the object parameter.
   * @description Generate payment confirmation document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerate` mutation
   */
  export const canUseGenerate = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetEml` mutation ability. For global ability, omit the object parameter.
   * @description Download payment confirmation as EML
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetEml` mutation
   */
  export const canUseGetEml = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;
}
