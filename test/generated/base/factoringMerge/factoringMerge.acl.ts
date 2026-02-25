import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace FactoringMergeAcl {
  /**
   * Use for `usePrepareUpload` mutation ability. For global ability, omit the object parameter.
   * @description Prepare factoring merge upload
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePrepareUpload` mutation
   */
  export const canUsePrepareUpload = (object?: { officeId: string }) =>
    ["Update", object ? subject("FactoringExport", object) : "FactoringExport"] as AbilityTuple<
      "Update",
      "FactoringExport" | (ForcedSubject<"FactoringExport"> & { officeId: string })
    >;

  /**
   * Use for `useProcessMerge` mutation ability. For global ability, omit the object parameter.
   * @description Process factoring merge
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useProcessMerge` mutation
   */
  export const canUseProcessMerge = (object?: { officeId: string }) =>
    ["Update", object ? subject("FactoringExport", object) : "FactoringExport"] as AbilityTuple<
      "Update",
      "FactoringExport" | (ForcedSubject<"FactoringExport"> & { officeId: string })
    >;

  /**
   * Use for `useGetMergeBatch` query ability. For global ability, omit the object parameter.
   * @description Read merge batch
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetMergeBatch` query
   */
  export const canUseGetMergeBatch = (object?: { officeId: string }) =>
    ["Read", object ? subject("FactoringExport", object) : "FactoringExport"] as AbilityTuple<
      "Read",
      "FactoringExport" | (ForcedSubject<"FactoringExport"> & { officeId: string })
    >;
}
