import { AbilityTuple, ForcedSubject, subject } from "@casl/ability";

export namespace IntegrationMessagesAcl {
/**
 * Use for `useList` query ability. For global ability, omit the object parameter.
 * @description List integration messages
 * @param { string } object.officeId officeId from officeId path parameter
 * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
 */
export const canUseList = (
  object?: { officeId: string,  } 
) => [
  "Read",
  object ? subject("IntegrationMessage", object) : "IntegrationMessage"
] as AbilityTuple<"Read", "IntegrationMessage" | ForcedSubject<"IntegrationMessage"> & { officeId: string, }>;

}
