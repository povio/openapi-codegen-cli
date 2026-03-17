import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace WorkingDocumentsMasterAwbAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Create", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

/**
 * Use for `useGetMasterAwbData` query ability. For global ability, omit the object parameter.
 * @description Read Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetMasterAwbData` query
 */
export const canUseGetMasterAwbData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Read", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

/**
 * Use for `useUpdateMasterAwbData` mutation ability. For global ability, omit the object parameter.
 * @description Update Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateMasterAwbData` mutation
 */
export const canUseUpdateMasterAwbData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Update", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

/**
 * Use for `useDeleteMasterAwb` mutation ability. For global ability, omit the object parameter.
 * @description Delete Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteMasterAwb` mutation
 */
export const canUseDeleteMasterAwb = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Delete", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

/**
 * Use for `usePreviewMasterAwb` query or `usePreviewMasterAwbMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewMasterAwb` query or `usePreviewMasterAwbMutation` mutation
 */
export const canUsePreviewMasterAwb = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Read", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

/**
 * Use for `useGenerateMasterAwb` mutation ability. For global ability, omit the object parameter.
 * @description Generate Master AWB document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateMasterAwb` mutation
 */
export const canUseGenerateMasterAwb = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-master-awb", object) : "WorkingDocument-master-awb"
] as AbilityTuple<"Update", "WorkingDocument-master-awb" | ForcedSubject<"WorkingDocument-master-awb"> & { officeId: string, }>;

}
