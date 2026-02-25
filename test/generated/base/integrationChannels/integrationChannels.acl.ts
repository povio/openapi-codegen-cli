import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace IntegrationChannelsAcl {
  /**
   * Use for `useList` query ability. For global ability, omit the object parameter.
   * @description List integration channels
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
   */
  export const canUseList = (object?: { officeId: string }) =>
    ["Read", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Read",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useCreate` mutation ability. For global ability, omit the object parameter.
   * @description Create integration channel
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = (object?: { officeId: string }) =>
    ["Create", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Create",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useFindById` query ability. For global ability, omit the object parameter.
   * @description Read integration channel
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = (object?: { officeId: string }) =>
    ["Read", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Read",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useUpdate` mutation ability. For global ability, omit the object parameter.
   * @description Update integration channel
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = (object?: { officeId: string }) =>
    ["Update", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Update",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useArchive` mutation ability. For global ability, omit the object parameter.
   * @description Archive integration channel
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useArchive` mutation
   */
  export const canUseArchive = (object?: { officeId: string }) =>
    ["Archive", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Archive",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useUnarchive` mutation ability. For global ability, omit the object parameter.
   * @description Unarchive integration channel
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUnarchive` mutation
   */
  export const canUseUnarchive = (object?: { officeId: string }) =>
    ["Archive", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Archive",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useTestConnection` mutation ability. For global ability, omit the object parameter.
   * @description Test integration channel connection
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useTestConnection` mutation
   */
  export const canUseTestConnection = (object?: { officeId: string }) =>
    ["Update", object ? subject("IntegrationChannel", object) : "IntegrationChannel"] as AbilityTuple<
      "Update",
      "IntegrationChannel" | (ForcedSubject<"IntegrationChannel"> & { officeId: string })
    >;

  /**
   * Use for `useListMessages` query ability. For global ability, omit the object parameter.
   * @description List integration channel messages
   * @param { string } object.officeId officeId from officeId path parameter
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useListMessages` query
   */
  export const canUseListMessages = (object?: { officeId: string }) =>
    ["Read", object ? subject("IntegrationMessage", object) : "IntegrationMessage"] as AbilityTuple<
      "Read",
      "IntegrationMessage" | (ForcedSubject<"IntegrationMessage"> & { officeId: string })
    >;
}
