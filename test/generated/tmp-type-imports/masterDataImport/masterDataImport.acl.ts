import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace MasterDataImportAcl {
/**
 * Use for `useUpload` mutation ability. For global ability, omit the object parameter.
 * @description Create upload instructions for master data import file
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpload` mutation
 */
export const canUseUpload = (
  object?: { officeId: string,  } 
) => [
  "Import",
  object ? subject("MasterData", object) : "MasterData"
] as AbilityTuple<"Import", "MasterData" | ForcedSubject<"MasterData"> & { officeId: string, }>;

/**
 * Use for `usePostOfficesMasterDataImportByOfficeId` mutation ability. For global ability, omit the object parameter.
 * @description Create upload instructions for master data import file
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePostOfficesMasterDataImportByOfficeId` mutation
 */
export const canUsePostOfficesMasterDataImportByOfficeId = (
  object?: { officeId: string,  } 
) => [
  "Import",
  object ? subject("MasterData", object) : "MasterData"
] as AbilityTuple<"Import", "MasterData" | ForcedSubject<"MasterData"> & { officeId: string, }>;

/**
 * Use for `useGetImportStatus` query ability. For global ability, omit the object parameter.
 * @description Create upload instructions for master data import file
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetImportStatus` query
 */
export const canUseGetImportStatus = (
  object?: { officeId: string,  } 
) => [
  "Import",
  object ? subject("MasterData", object) : "MasterData"
] as AbilityTuple<"Import", "MasterData" | ForcedSubject<"MasterData"> & { officeId: string, }>;

}
