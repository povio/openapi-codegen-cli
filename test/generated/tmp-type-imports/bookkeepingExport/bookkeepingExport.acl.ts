import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace BookkeepingExportAcl {
/**
 * Use for `useCreateBatch` mutation ability. For global ability, omit the object parameter.
 * @description Create bookkeeping export batch
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateBatch` mutation
 */
export const canUseCreateBatch = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Create", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `usePaginateBatches` query ability. For global ability, omit the object parameter.
 * @description List bookkeeping export batches
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateBatches` query
 */
export const canUsePaginateBatches = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Read", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useGetBatch` query ability. For global ability, omit the object parameter.
 * @description Get bookkeeping export batch details
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetBatch` query
 */
export const canUseGetBatch = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Read", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useUpdateBatchFormat` mutation ability. For global ability, omit the object parameter.
 * @description Update bookkeeping export batch format
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBatchFormat` mutation
 */
export const canUseUpdateBatchFormat = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Update", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useUpdateBatchItem` mutation ability. For global ability, omit the object parameter.
 * @description Update bookkeeping export batch item
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBatchItem` mutation
 */
export const canUseUpdateBatchItem = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Update", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `usePaginateBatchItems` query ability. For global ability, omit the object parameter.
 * @description List batch items
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateBatchItems` query
 */
export const canUsePaginateBatchItems = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Read", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useValidateBookkeepingBatch` mutation ability. For global ability, omit the object parameter.
 * @description Export bookkeeping export batch
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useValidateBookkeepingBatch` mutation
 */
export const canUseValidateBookkeepingBatch = (
  object?: { officeId: string,  } 
) => [
  "Export",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Export", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useExportBookkeepingBatch` mutation ability. For global ability, omit the object parameter.
 * @description Export bookkeeping export batch
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportBookkeepingBatch` mutation
 */
export const canUseExportBookkeepingBatch = (
  object?: { officeId: string,  } 
) => [
  "Export",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Export", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useRevertBookkeepingBatch` mutation ability. For global ability, omit the object parameter.
 * @description Revert bookkeeping export batch
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useRevertBookkeepingBatch` mutation
 */
export const canUseRevertBookkeepingBatch = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Update", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

/**
 * Use for `useGetVatLineItems` query ability. For global ability, omit the object parameter.
 * @description Get VAT line items
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetVatLineItems` query
 */
export const canUseGetVatLineItems = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BookkeepingExportBatch", object) : "BookkeepingExportBatch"
] as AbilityTuple<"Read", "BookkeepingExportBatch" | ForcedSubject<"BookkeepingExportBatch"> & { officeId: string, }>;

}
