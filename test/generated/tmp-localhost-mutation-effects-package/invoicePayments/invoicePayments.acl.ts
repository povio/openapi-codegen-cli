import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace InvoicePaymentsAcl {
/**
 * Use for `useListOfficePayments` query ability. For global ability, omit the object parameter.
 * @description List office payments
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListOfficePayments` query
 */
export const canUseListOfficePayments = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Read", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useBulkCreatePayments` mutation ability. For global ability, omit the object parameter.
 * @description Bulk create invoice payments
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useBulkCreatePayments` mutation
 */
export const canUseBulkCreatePayments = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Update", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useCalculatePayments` mutation ability. For global ability, omit the object parameter.
 * @description Calculate invoice payments
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCalculatePayments` mutation
 */
export const canUseCalculatePayments = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Read", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useExportOfficePayments` mutation ability. For global ability, omit the object parameter.
 * @description Export office invoice payments
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportOfficePayments` mutation
 */
export const canUseExportOfficePayments = (
  object?: { officeId: string,  } 
) => [
  "Export",
  object ? subject("InvoicePayment", object) : "InvoicePayment"
] as AbilityTuple<"Export", "InvoicePayment" | ForcedSubject<"InvoicePayment"> & { officeId: string, }>;

/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List invoice payments
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Read", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create invoice payment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Update", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useGetPaymentById` query ability. For global ability, omit the object parameter.
 * @description Create invoice payment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetPaymentById` query
 */
export const canUseGetPaymentById = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Update", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update invoice payment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Update", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

/**
 * Use for `useDeleteInvoicePayment` mutation ability. For global ability, omit the object parameter.
 * @description Delete invoice payment
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteInvoicePayment` mutation
 */
export const canUseDeleteInvoicePayment = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("PositionInvoice", object) : "PositionInvoice"
] as AbilityTuple<"Update", "PositionInvoice" | ForcedSubject<"PositionInvoice"> & { officeId: string, }>;

}
