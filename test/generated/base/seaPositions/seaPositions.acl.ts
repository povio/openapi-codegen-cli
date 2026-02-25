import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace SeaPositionsAcl {
  /**
   * Use for `useGet` query ability. For global ability, omit the object parameter.
   * @description Get sea position by position id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGet` query
   */
  export const canUseGet = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
   * @description Update sea position by position id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = (object?: { officeId: string }) =>
    ["Update", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Update",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;
}
