import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace InvoicesAcl {
  /**
   * Use for `useGetInvoicesEml` query or `useGetInvoicesEmlMutation` mutation ability. For global ability, omit the object parameter.
   * @description Download invoices as EML
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetInvoicesEml` query or `useGetInvoicesEmlMutation` mutation
   */
  export const canUseGetInvoicesEml = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useFind` query ability. For global ability, omit the object parameter.
   * @description List invoices for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFind` query
   */
  export const canUseFind = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useChangeIncomingCustomer` mutation ability. For global ability, omit the object parameter.
   * @description PositionInvoice Fix
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useChangeIncomingCustomer` mutation
   */
  export const canUseChangeIncomingCustomer = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useFindByOffice` query ability. For global ability, omit the object parameter.
   * @description List invoices for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindByOffice` query
   */
  export const canUseFindByOffice = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useCreateDraft` mutation ability. For global ability, omit the object parameter.
   * @description Create invoice for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateDraft` mutation
   */
  export const canUseCreateDraft = (object?: { officeId: string }) =>
    ["Create", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Create",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useExportInvoices` mutation ability. For global ability, omit the object parameter.
   * @description Export invoices for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportInvoices` mutation
   */
  export const canUseExportInvoices = (object?: { officeId: string }) =>
    ["Export", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Export",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useExportCharges` mutation ability. For global ability, omit the object parameter.
   * @description Export invoice charges for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportCharges` mutation
   */
  export const canUseExportCharges = (object?: { officeId: string }) =>
    ["Export", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Export",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetUnCharges` query ability. For global ability, omit the object parameter.
   * @description List uninvoiced charges for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetUnCharges` query
   */
  export const canUseGetUnCharges = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useListAvailablePartnersFor` query ability. For global ability, omit the object parameter.
   * @description List available partners for invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListAvailablePartnersFor` query
   */
  export const canUseListAvailablePartnersFor = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetOfficeUnCharges` query ability. For global ability, omit the object parameter.
   * @description List uninvoiced charges for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetOfficeUnCharges` query
   */
  export const canUseGetOfficeUnCharges = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useExportUnCharges` mutation ability. For global ability, omit the object parameter.
   * @description Export uninvoiced charges for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportUnCharges` mutation
   */
  export const canUseExportUnCharges = (object?: { officeId: string }) =>
    ["Export", object ? subject("UninvoicedCharge", object) : "UninvoicedCharge"] as AbilityTuple<
      "Export",
      "UninvoicedCharge" | (ForcedSubject<"UninvoicedCharge"> & { officeId: string })
    >;

  /**
   * Use for `useCreateDirect` mutation ability. For global ability, omit the object parameter.
   * @description Create direct invoice for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateDirect` mutation
   */
  export const canUseCreateDirect = (object?: { officeId: string }) =>
    ["CreateDirectInvoice", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "CreateDirectInvoice",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useAddChargeToDirect` mutation ability. For global ability, omit the object parameter.
   * @description Add charge to direct invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useAddChargeToDirect` mutation
   */
  export const canUseAddChargeToDirect = (object?: { officeId: string }) =>
    ["UpdateDirectInvoice", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "UpdateDirectInvoice",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateCharges` mutation ability. For global ability, omit the object parameter.
   * @description Update invoice charges
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCharges` mutation
   */
  export const canUseUpdateCharges = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionAccount", object) : "PositionAccount"] as AbilityTuple<
      "Update",
      "PositionAccount" | (ForcedSubject<"PositionAccount"> & { officeId: string })
    >;

  /**
   * Use for `useRemoveChargeFromDirect` mutation ability. For global ability, omit the object parameter.
   * @description Remove charge from direct invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useRemoveChargeFromDirect` mutation
   */
  export const canUseRemoveChargeFromDirect = (object?: { officeId: string }) =>
    ["UpdateDirectInvoice", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "UpdateDirectInvoice",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetDetail` query ability. For global ability, omit the object parameter.
   * @description Read invoice details
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetDetail` query
   */
  export const canUseGetDetail = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
   * @description Update invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useDeleteInvoice` mutation ability. For global ability, omit the object parameter.
   * @description Delete invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteInvoice` mutation
   */
  export const canUseDeleteInvoice = (object?: { officeId: string }) =>
    ["Delete", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Delete",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useFix` mutation ability. For global ability, omit the object parameter.
   * @description Fix invoice accounting issues
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFix` mutation
   */
  export const canUseFix = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGenerate` mutation ability. For global ability, omit the object parameter.
   * @description Generate invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerate` mutation
   */
  export const canUseGenerate = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateIssuedVatRules` mutation ability. For global ability, omit the object parameter.
   * @description Fix invoice VAT rules
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateIssuedVatRules` mutation
   */
  export const canUseUpdateIssuedVatRules = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateIssuedCharges` mutation ability. For global ability, omit the object parameter.
   * @description Fix invoice charges
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateIssuedCharges` mutation
   */
  export const canUseUpdateIssuedCharges = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useIssue` mutation ability. For global ability, omit the object parameter.
   * @description Issue invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useIssue` mutation
   */
  export const canUseIssue = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useReportHungarian` mutation ability. For global ability, omit the object parameter.
   * @description Report invoice to Hungarian tax authority
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useReportHungarian` mutation
   */
  export const canUseReportHungarian = (object?: { officeId: string }) =>
    ["Fix", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Fix",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGenerateIncoming` mutation ability. For global ability, omit the object parameter.
   * @description Generate incoming invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateIncoming` mutation
   */
  export const canUseGenerateIncoming = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useRegister` mutation ability. For global ability, omit the object parameter.
   * @description Register invoice for bookkeeping
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useRegister` mutation
   */
  export const canUseRegister = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetPreview` query or `useGetPreviewMutation` mutation ability. For global ability, omit the object parameter.
   * @description View invoice preview
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetPreview` query or `useGetPreviewMutation` mutation
   */
  export const canUseGetPreview = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useGetInvoiceEml` query or `useGetInvoiceEmlMutation` mutation ability. For global ability, omit the object parameter.
   * @description Download invoice as EML
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetInvoiceEml` query or `useGetInvoiceEmlMutation` mutation
   */
  export const canUseGetInvoiceEml = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Read",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `usePrepareDocumentUpload` mutation ability. For global ability, omit the object parameter.
   * @description Upload invoice document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePrepareDocumentUpload` mutation
   */
  export const canUsePrepareDocumentUpload = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useCancel` mutation ability. For global ability, omit the object parameter.
   * @description Cancel invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCancel` mutation
   */
  export const canUseCancel = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;

  /**
   * Use for `useIssueCreditNote` mutation ability. For global ability, omit the object parameter.
   * @description Issue credit note invoice
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useIssueCreditNote` mutation
   */
  export const canUseIssueCreditNote = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionInvoice", object) : "PositionInvoice"] as AbilityTuple<
      "Update",
      "PositionInvoice" | (ForcedSubject<"PositionInvoice"> & { officeId: string })
    >;
}
