import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace ProjectLiteAcl {
/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create project in office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Create", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List projects for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Read", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `usePaginateProjectLabels` query ability. For global ability, omit the object parameter.
 * @description Paginate project labels for office
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateProjectLabels` query
 */
export const canUsePaginateProjectLabels = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Read", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `useFindById` query ability. For global ability, omit the object parameter.
 * @description Get project by id
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
 */
export const canUseFindById = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Read", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
 * @description Update project
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Update", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
 * @description Archive project
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Archive", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

/**
 * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
 * @description Unarchive project
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
  object?: { officeId: string,  } 
) => [
  "Archive",
  object ? subject("ProjectLite", object) : "ProjectLite"
] as AbilityTuple<"Archive", "ProjectLite" | ForcedSubject<"ProjectLite"> & { officeId: string, }>;

}
