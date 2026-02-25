import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace InttraOfficeIntegrationAcl {
  /**
   * Use for `useGet` query ability. For global ability, omit the object parameter.
   * @description Get INTTRA credentials
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
   */
  export const canUseGet = (object?: { officeId: string }) =>
    ["Read", object ? subject("Office", object) : "Office"] as AbilityTuple<
      "Read",
      "Office" | (ForcedSubject<"Office"> & { officeId: string })
    >;

  /**
   * Use for `useGenerate` mutation ability. For global ability, omit the object parameter.
   * @description Generate INTTRA credentials
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerate` mutation
   */
  export const canUseGenerate = (object?: { officeId: string }) =>
    ["Update", object ? subject("Office", object) : "Office"] as AbilityTuple<
      "Update",
      "Office" | (ForcedSubject<"Office"> & { officeId: string })
    >;

  /**
   * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
   * @description Update INTTRA credentials
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = (object?: { officeId: string }) =>
    ["Update", object ? subject("Office", object) : "Office"] as AbilityTuple<
      "Update",
      "Office" | (ForcedSubject<"Office"> & { officeId: string })
    >;
}
