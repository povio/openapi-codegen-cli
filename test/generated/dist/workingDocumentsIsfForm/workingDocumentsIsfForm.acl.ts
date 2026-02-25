import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace WorkingDocumentsIsfFormAcl {
  /**
   * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
   * @description Create ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = (object?: { officeId: string }) =>
    ["Create", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Create",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;

  /**
   * Use for `useGetIsfData` query ability. For global ability, omit the object parameter.
   * @description Read ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetIsfData` query
   */
  export const canUseGetIsfData = (object?: { officeId: string }) =>
    ["Read", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Read",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateIsfData` mutation ability. For global ability, omit the object parameter.
   * @description Update ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateIsfData` mutation
   */
  export const canUseUpdateIsfData = (object?: { officeId: string }) =>
    ["Update", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Update",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;

  /**
   * Use for `useDeleteIsf` mutation ability. For global ability, omit the object parameter.
   * @description Delete ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteIsf` mutation
   */
  export const canUseDeleteIsf = (object?: { officeId: string }) =>
    ["Delete", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Delete",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;

  /**
   * Use for `usePreviewIsf` query or `usePreviewIsfMutation` mutation ability. For global ability, omit the object parameter.
   * @description Preview ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePreviewIsf` query or `usePreviewIsfMutation` mutation
   */
  export const canUsePreviewIsf = (object?: { officeId: string }) =>
    ["Read", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Read",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;

  /**
   * Use for `useGenerateIsf` mutation ability. For global ability, omit the object parameter.
   * @description Generate ISF document
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGenerateIsf` mutation
   */
  export const canUseGenerateIsf = (object?: { officeId: string }) =>
    ["Update", object ? subject("WorkingDocument-isf-form", object) : "WorkingDocument-isf-form"] as AbilityTuple<
      "Update",
      "WorkingDocument-isf-form" | (ForcedSubject<"WorkingDocument-isf-form"> & { officeId: string })
    >;
}
