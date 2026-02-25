import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace PositionCargoAcl {
  /**
   * Use for `useListCargosByPositionId` query ability. For global ability, omit the object parameter.
   * @description List cargo items by position id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListCargosByPositionId` query
   */
  export const canUseListCargosByPositionId = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Read",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useCreateCargo` mutation ability. For global ability, omit the object parameter.
   * @description Create cargo item for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateCargo` mutation
   */
  export const canUseCreateCargo = (object?: { officeId: string }) =>
    ["Create", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Create",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useListCargoLabels` query ability. For global ability, omit the object parameter.
   * @description List cargo labels by position id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListCargoLabels` query
   */
  export const canUseListCargoLabels = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Read",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useGetCargoSummary` query ability. For global ability, omit the object parameter.
   * @description Get cargo summary by position id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCargoSummary` query
   */
  export const canUseGetCargoSummary = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Read",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useGetCargoById` query ability. For global ability, omit the object parameter.
   * @description Get cargo item by id
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useGetCargoById` query
   */
  export const canUseGetCargoById = (object?: { officeId: string }) =>
    ["Read", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Read",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useUpdateCargo` mutation ability. For global ability, omit the object parameter.
   * @description Update cargo item
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdateCargo` mutation
   */
  export const canUseUpdateCargo = (object?: { officeId: string }) =>
    ["Update", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Update",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useDeleteCargo` mutation ability. For global ability, omit the object parameter.
   * @description Delete cargo item
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeleteCargo` mutation
   */
  export const canUseDeleteCargo = (object?: { officeId: string }) =>
    ["Delete", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Delete",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useCreateBulkCargos` mutation ability. For global ability, omit the object parameter.
   * @description Create cargo item for position
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreateBulkCargos` mutation
   */
  export const canUseCreateBulkCargos = (object?: { officeId: string }) =>
    ["Create", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Create",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;

  /**
   * Use for `useDuplicateCargo` mutation ability. For global ability, omit the object parameter.
   * @description Duplicate cargo item
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDuplicateCargo` mutation
   */
  export const canUseDuplicateCargo = (object?: { officeId: string }) =>
    ["Duplicate", object ? subject("PositionCargo", object) : "PositionCargo"] as AbilityTuple<
      "Duplicate",
      "PositionCargo" | (ForcedSubject<"PositionCargo"> & { officeId: string })
    >;
}
