import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace BusinessPartnerBookkeepingMappingsAcl {
  /**
   * Use for `useGetBookkeepingMappings` query ability. For global ability, omit the object parameter.
   * @description List business partner bookkeeping mappings
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetBookkeepingMappings` query
   */
  export const canUseGetBookkeepingMappings = (object?: { officeId: string }) =>
    ["Read", object ? subject("BusinessPartner", object) : "BusinessPartner"] as AbilityTuple<
      "Read",
      "BusinessPartner" | (ForcedSubject<"BusinessPartner"> & { officeId: string })
    >;

  /**
   * Use for `useCreateBookkeepingMapping` mutation ability. For global ability, omit the object parameter.
   * @description Create business partner bookkeeping mapping
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateBookkeepingMapping` mutation
   */
  export const canUseCreateBookkeepingMapping = (object?: { officeId: string }) =>
    ["Update", object ? subject("BusinessPartnerBookkeeping", object) : "BusinessPartnerBookkeeping"] as AbilityTuple<
      "Update",
      "BusinessPartnerBookkeeping" | (ForcedSubject<"BusinessPartnerBookkeeping"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateBookkeepingMapping` mutation ability. For global ability, omit the object parameter.
   * @description Update business partner bookkeeping mapping
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBookkeepingMapping` mutation
   */
  export const canUseUpdateBookkeepingMapping = (object?: { officeId: string }) =>
    ["Update", object ? subject("BusinessPartnerBookkeeping", object) : "BusinessPartnerBookkeeping"] as AbilityTuple<
      "Update",
      "BusinessPartnerBookkeeping" | (ForcedSubject<"BusinessPartnerBookkeeping"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateBookkeepingMappingById` mutation ability. For global ability, omit the object parameter.
   * @description Update business partner bookkeeping mapping by ID
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateBookkeepingMappingById` mutation
   */
  export const canUseUpdateBookkeepingMappingById = (object?: { officeId: string }) =>
    ["Update", object ? subject("BusinessPartnerBookkeeping", object) : "BusinessPartnerBookkeeping"] as AbilityTuple<
      "Update",
      "BusinessPartnerBookkeeping" | (ForcedSubject<"BusinessPartnerBookkeeping"> & { officeId: string })
    >;

  /**
   * Use for `useDeleteBookkeepingMapping` mutation ability. For global ability, omit the object parameter.
   * @description Delete business partner bookkeeping mapping
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteBookkeepingMapping` mutation
   */
  export const canUseDeleteBookkeepingMapping = (object?: { officeId: string }) =>
    ["Delete", object ? subject("BusinessPartnerBookkeeping", object) : "BusinessPartnerBookkeeping"] as AbilityTuple<
      "Delete",
      "BusinessPartnerBookkeeping" | (ForcedSubject<"BusinessPartnerBookkeeping"> & { officeId: string })
    >;
}
