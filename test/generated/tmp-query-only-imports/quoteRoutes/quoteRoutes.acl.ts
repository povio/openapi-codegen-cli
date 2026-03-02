import { ForcedSubject, subject, type AbilityTuple } from "@casl/ability";

export namespace QuoteRoutesAcl {
/**
 * Use for `useListRoutes` query ability. For global ability, omit the object parameter.
 * @description List quote routes
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListRoutes` query
 */
export const canUseListRoutes = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Read", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useCreateRoutePoint` mutation ability. For global ability, omit the object parameter.
 * @description Create quote route point
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateRoutePoint` mutation
 */
export const canUseCreateRoutePoint = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useUpdateRoutePoint` mutation ability. For global ability, omit the object parameter.
 * @description Update quote route point
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateRoutePoint` mutation
 */
export const canUseUpdateRoutePoint = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useDeleteRoutePoint` mutation ability. For global ability, omit the object parameter.
 * @description Delete quote route point
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteRoutePoint` mutation
 */
export const canUseDeleteRoutePoint = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useSplitRoutes` mutation ability. For global ability, omit the object parameter.
 * @description Split quote routes
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useSplitRoutes` mutation
 */
export const canUseSplitRoutes = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useMergeRoutes` mutation ability. For global ability, omit the object parameter.
 * @description Merge quote routes
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useMergeRoutes` mutation
 */
export const canUseMergeRoutes = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

/**
 * Use for `useCopyRoute` mutation ability. For global ability, omit the object parameter.
 * @description Copy quote route points
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCopyRoute` mutation
 */
export const canUseCopyRoute = (
  object?: { officeId: string,  } 
) => [
  "Update",
  object ? subject("Quote", object) : "Quote"
] as AbilityTuple<"Update", "Quote" | ForcedSubject<"Quote"> & { officeId: string, }>;

}
