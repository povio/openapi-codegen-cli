import { AbilityTuple } from "@casl/ability";

export namespace CustomersAcl {
  /**
   * Use for `useCreate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useCreate` mutation
   */
  export const canUseCreate = () => ["Create", "Customer"] as AbilityTuple<"Create", "Customer">;

  /**
   * Use for `useList` query ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useList` query
   */
  export const canUseList = () => ["Read", "Customer"] as AbilityTuple<"Read", "Customer">;

  /**
   * Use for `useFindById` query ability.
   * @description Read a customer with id
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useFindById` query
   */
  export const canUseFindById = () => ["Read", "Customer"] as AbilityTuple<"Read", "Customer">;

  /**
   * Use for `useUpdate` mutation ability.
   * @description Update Customer
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useUpdate` mutation
   */
  export const canUseUpdate = () => ["Update", "Customer"] as AbilityTuple<"Update", "Customer">;

  /**
   * Use for `useDeactivate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useDeactivate` mutation
   */
  export const canUseDeactivate = () => ["Deactivate", "Customer"] as AbilityTuple<"Deactivate", "Customer">;

  /**
   * Use for `useReactivate` mutation ability.
   * @returns { AbilityTuple } An ability tuple indicating the user's ability to use `useReactivate` mutation
   */
  export const canUseReactivate = () => ["Reactivate", "Customer"] as AbilityTuple<"Reactivate", "Customer">;
}
