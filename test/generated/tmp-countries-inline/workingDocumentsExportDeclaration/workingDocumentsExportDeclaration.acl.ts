import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsExportDeclarationAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Create", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

/**
 * Use for `useGetExportDeclarationData` query ability. For global ability, omit the object parameter.
 * @description Read export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetExportDeclarationData` query
 */
export const canUseGetExportDeclarationData = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Read", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

/**
 * Use for `useUpdateExportDeclarationData` mutation ability. For global ability, omit the object parameter.
 * @description Update export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateExportDeclarationData` mutation
 */
export const canUseUpdateExportDeclarationData = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Update", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

/**
 * Use for `useDeleteExportDeclaration` mutation ability. For global ability, omit the object parameter.
 * @description Delete export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteExportDeclaration` mutation
 */
export const canUseDeleteExportDeclaration = (
  object?: { officeId: string,  } 
) => [
  "Delete",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Delete", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

/**
 * Use for `usePreviewExportDeclaration` query or `usePreviewExportDeclarationMutation` mutation ability. For global ability, omit the object parameter.
 * @description Preview export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewExportDeclaration` query or `usePreviewExportDeclarationMutation` mutation
 */
export const canUsePreviewExportDeclaration = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Read", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

/**
 * Use for `useGenerateExportDeclaration` mutation ability. For global ability, omit the object parameter.
 * @description Generate export declaration document
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateExportDeclaration` mutation
 */
export const canUseGenerateExportDeclaration = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("WorkingDocument-export-declaration", object) : "WorkingDocument-export-declaration"
] as AbilityTuple<"Update", "WorkingDocument-export-declaration" | ForcedSubject<"WorkingDocument-export-declaration"> & { officeId: string, }>;

}
