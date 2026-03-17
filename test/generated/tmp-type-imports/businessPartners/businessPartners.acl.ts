import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace BusinessPartnersAcl {
/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List business partners
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Create", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `usePaginateLabels` query ability. For global ability, omit the object parameter.
 * @description Paginate business partner labels
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useGetById` query ability. For global ability, omit the object parameter.
 * @description Read business partner details
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetById` query
 */
export const canUseGetById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Archive", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Archive", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useLock` mutation ability. For global ability, omit the object parameter.
 * @description Lock business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useLock` mutation
 */
export const canUseLock = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUnlock` mutation ability. For global ability, omit the object parameter.
 * @description Unlock business partner
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnlock` mutation
 */
export const canUseUnlock = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useGetRemarks` query ability. For global ability, omit the object parameter.
 * @description List business partner remarks
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetRemarks` query
 */
export const canUseGetRemarks = (
  object?: { officeId: string,  } 
) => [
  "ReadRemark",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"ReadRemark", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useCreateRemark` mutation ability. For global ability, omit the object parameter.
 * @description Create business partner remark
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateRemark` mutation
 */
export const canUseCreateRemark = (
  object?: { officeId: string,  } 
) => [
  "CreateRemark",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"CreateRemark", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdateRemark` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner remark
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateRemark` mutation
 */
export const canUseUpdateRemark = (
  object?: { officeId: string,  } 
) => [
  "UpdateRemark",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"UpdateRemark", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useDeleteRemark` mutation ability. For global ability, omit the object parameter.
 * @description Delete business partner remark
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteRemark` mutation
 */
export const canUseDeleteRemark = (
  object?: { officeId: string,  } 
) => [
  "DeleteRemark",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"DeleteRemark", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useGetBasicInfo` query ability. For global ability, omit the object parameter.
 * @description Read business partner basic info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetBasicInfo` query
 */
export const canUseGetBasicInfo = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdateBasicInfo` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner basic info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBasicInfo` mutation
 */
export const canUseUpdateBasicInfo = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartnerBasicTab", object) : "BusinessPartnerBasicTab"
] as AbilityTuple<"Update", "BusinessPartnerBasicTab" | ForcedSubject<"BusinessPartnerBasicTab"> & { officeId: string, }>;

/**
 * Use for `useCreateSignatureUploadInstructions` mutation ability. For global ability, omit the object parameter.
 * @description Create business partner signature upload instructions
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateSignatureUploadInstructions` mutation
 */
export const canUseCreateSignatureUploadInstructions = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartnerBasicTab", object) : "BusinessPartnerBasicTab"
] as AbilityTuple<"Update", "BusinessPartnerBasicTab" | ForcedSubject<"BusinessPartnerBasicTab"> & { officeId: string, }>;

/**
 * Use for `useGetCargoAgentInfo` query ability. For global ability, omit the object parameter.
 * @description Read business partner cargo agent info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCargoAgentInfo` query
 */
export const canUseGetCargoAgentInfo = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdateCargoAgent` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner cargo agent info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCargoAgent` mutation
 */
export const canUseUpdateCargoAgent = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useGetCarrierInformation` query ability. For global ability, omit the object parameter.
 * @description Read business partner carrier info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCarrierInformation` query
 */
export const canUseGetCarrierInformation = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Read", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

/**
 * Use for `useUpdateCarrier` mutation ability. For global ability, omit the object parameter.
 * @description Update business partner carrier info
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCarrier` mutation
 */
export const canUseUpdateCarrier = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("BusinessPartner", object) : "BusinessPartner"
] as AbilityTuple<"Update", "BusinessPartner" | ForcedSubject<"BusinessPartner"> & { officeId: string, }>;

}
