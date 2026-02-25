import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionsAcl {
  /**
   * Use for `useFindAll` query ability. For global ability, omit the object parameter.
   * @description List position labels for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindAll` query
   */
  export const canUseFindAll = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `usePaginate` query ability. For global ability, omit the object parameter.
   * @description List positions for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `usePaginate` query
   */
  export const canUsePaginate = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
   * @description Create position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = (object?: { officeId: string }) =>
    ["Create", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Create",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useTotalProfit` query ability. For global ability, omit the object parameter.
   * @description Fake endpoint
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useTotalProfit` query
   */
  export const canUseTotalProfit = (object?: { officeId: string }) =>
    ["TotalProfitView", object ? subject("PositionAccount", object) : "PositionAccount"] as AbilityTuple<
      "TotalProfitView",
      "PositionAccount" | (ForcedSubject<"PositionAccount"> & { officeId: string })
    >;

  /**
   * Use for `useListAvailablePartnersFor` query ability. For global ability, omit the object parameter.
   * @description List available partners for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListAvailablePartnersFor` query
   */
  export const canUseListAvailablePartnersFor = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useExportPositions` mutation ability. For global ability, omit the object parameter.
   * @description Export positions for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useExportPositions` mutation
   */
  export const canUseExportPositions = (object?: { officeId: string }) =>
    ["Export", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Export",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useGet` query ability. For global ability, omit the object parameter.
   * @description Get position for office
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
   * @description Update position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = (object?: { officeId: string }) =>
    ["Update", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Update",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useListRouteLabels` query ability. For global ability, omit the object parameter.
   * @description List route labels for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListRouteLabels` query
   */
  export const canUseListRouteLabels = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useGetDuplicateDefaultParameters` query ability. For global ability, omit the object parameter.
   * @description Read position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetDuplicateDefaultParameters` query
   */
  export const canUseGetDuplicateDefaultParameters = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useDuplicate` mutation ability. For global ability, omit the object parameter.
   * @description Create position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicate` mutation
   */
  export const canUseDuplicate = (object?: { officeId: string }) =>
    ["Create", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Create",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useCancel` mutation ability. For global ability, omit the object parameter.
   * @description Cancel position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCancel` mutation
   */
  export const canUseCancel = (object?: { officeId: string }) =>
    ["Update", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Update",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useRevertCancel` mutation ability. For global ability, omit the object parameter.
   * @description Revert cancelled position for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useRevertCancel` mutation
   */
  export const canUseRevertCancel = (object?: { officeId: string }) =>
    ["RevertCancel", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "RevertCancel",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useLinkChild` mutation ability. For global ability, omit the object parameter.
   * @description Link positions to parent
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useLinkChild` mutation
   */
  export const canUseLinkChild = (object?: { officeId: string }) =>
    ["Update", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Update",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useUnlinkChild` mutation ability. For global ability, omit the object parameter.
   * @description Link positions to parent
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnlinkChild` mutation
   */
  export const canUseUnlinkChild = (object?: { officeId: string }) =>
    ["Update", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Update",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;

  /**
   * Use for `useListChild` query ability. For global ability, omit the object parameter.
   * @description List positions for office
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListChild` query
   */
  export const canUseListChild = (object?: { officeId: string }) =>
    ["Read", object ? subject("Position", object) : "Position"] as AbilityTuple<
      "Read",
      "Position" | (ForcedSubject<"Position"> & { officeId: string })
    >;
}
