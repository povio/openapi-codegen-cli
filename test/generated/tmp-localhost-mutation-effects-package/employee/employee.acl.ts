import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace EmployeeAcl {
/**
 * Use for `usePaginate` query ability. For global ability, omit the object parameter.
 * @description List employees
 * @param { string } object.officeId officeId from filter query parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
 */
export const canUsePaginate = (
  object?: { officeId?: string,  } 
) => [
  "Read",
  object ? subject("Employee", object) : "Employee"
] as AbilityTuple<"Read", "Employee" | ForcedSubject<"Employee"> & { officeId?: string, }>;

/**
 * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
 * @description Create a new employee
 * @param { string } object.officeId officeId from mutation data
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
 */
export const canUseCreate = (
  object?: { officeId?: string,  } 
) => [
  "Create",
  object ? subject("Employee", object) : "Employee"
] as AbilityTuple<"Create", "Employee" | ForcedSubject<"Employee"> & { officeId?: string, }>;

/**
 * Use for `useFindAll` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
 */
export const canUseFindAll = (
) => [
  "Read",
  "Employee"
] as AbilityTuple<"Read", "Employee">;

/**
 * Use for `usePaginateLabels` query ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginateLabels` query
 */
export const canUsePaginateLabels = (
) => [
  "Read",
  "Employee"
] as AbilityTuple<"Read", "Employee">;

/**
 * Use for `useResendOnboardingWithOffice` mutation ability. For global ability, omit the object parameter.
 * @description Resend employee onboarding email
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useResendOnboardingWithOffice` mutation
 */
export const canUseResendOnboardingWithOffice = (
  object?: { officeId: string,  } 
) => [
  "Create",
  object ? subject("Employee", object) : "Employee"
] as AbilityTuple<"Create", "Employee" | ForcedSubject<"Employee"> & { officeId: string, }>;

/**
 * Use for `useGet` query ability. 
 * @description Read Office Employee
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
 */
export const canUseGet = (
) => [
  "Read",
  "Employee"
] as AbilityTuple<"Read", "Employee">;

/**
 * Use for `useUpdate` mutation ability. 
 * @description Update Office Employee
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
 */
export const canUseUpdate = (
) => [
  "Update",
  "Employee"
] as AbilityTuple<"Update", "Employee">;

/**
 * Use for `useGetWithOffice` query ability. For global ability, omit the object parameter.
 * @description Read Office Employee
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetWithOffice` query
 */
export const canUseGetWithOffice = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Employee", object) : "Employee"
] as AbilityTuple<"Read", "Employee" | ForcedSubject<"Employee"> & { officeId: string, }>;

/**
 * Use for `useUpdateWithOffice` mutation ability. For global ability, omit the object parameter.
 * @description Update Office Employee
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateWithOffice` mutation
 */
export const canUseUpdateWithOffice = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Employee", object) : "Employee"
] as AbilityTuple<"Update", "Employee" | ForcedSubject<"Employee"> & { officeId: string, }>;

/**
 * Use for `useListRoles` query ability. 
 * @description List employee (global) roles
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListRoles` query
 */
export const canUseListRoles = (
) => [
  "ListRoles",
  "Employee"
] as AbilityTuple<"ListRoles", "Employee">;

/**
 * Use for `useUpdateRoles` mutation ability. 
 * @description Update employee (global) roles
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateRoles` mutation
 */
export const canUseUpdateRoles = (
) => [
  "UpdateRoles",
  "Employee"
] as AbilityTuple<"UpdateRoles", "Employee">;

/**
 * Use for `useArchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
 */
export const canUseArchive = (
) => [
  "Archive",
  "Employee"
] as AbilityTuple<"Archive", "Employee">;

/**
 * Use for `useUnarchive` mutation ability. 
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
 */
export const canUseUnarchive = (
) => [
  "Unarchive",
  "Employee"
] as AbilityTuple<"Unarchive", "Employee">;

}
