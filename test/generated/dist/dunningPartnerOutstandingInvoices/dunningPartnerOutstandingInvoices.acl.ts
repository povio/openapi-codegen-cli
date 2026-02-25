import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace DunningPartnerOutstandingInvoicesAcl {
  /**
   * Use for `useListPartnerOutstandingInvoiceSummaries` query ability. For global ability, omit the object parameter.
   * @description List office outstanding invoice summaries per partner
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListPartnerOutstandingInvoiceSummaries` query
   */
  export const canUseListPartnerOutstandingInvoiceSummaries = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useListPartnerOutstandingInvoices` query ability. For global ability, omit the object parameter.
   * @description List partner outstanding invoices
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListPartnerOutstandingInvoices` query
   */
  export const canUseListPartnerOutstandingInvoices = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useListRecommendedDunningLevels` mutation ability. For global ability, omit the object parameter.
   * @description List recommended dunning levels for a partner
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListRecommendedDunningLevels` mutation
   */
  export const canUseListRecommendedDunningLevels = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;
}
