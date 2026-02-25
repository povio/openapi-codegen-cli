import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsAcl {
  /**
   * Use for `useList` query ability. For global ability, omit the object parameter.
   * @description List working documents
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
   */
  export const canUseList = (object?: { officeId: string }) =>
    ["Read", object ? subject("WorkingDocument", object) : "WorkingDocument"] as AbilityTuple<
      "Read",
      "WorkingDocument" | (ForcedSubject<"WorkingDocument"> & { officeId: string })
    >;

  /**
   * Use for `useFindById` query ability. For global ability, omit the object parameter.
   * @description Get working document by ID
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = (object?: { officeId: string }) =>
    ["Read", object ? subject("WorkingDocument", object) : "WorkingDocument"] as AbilityTuple<
      "Read",
      "WorkingDocument" | (ForcedSubject<"WorkingDocument"> & { officeId: string })
    >;
}
