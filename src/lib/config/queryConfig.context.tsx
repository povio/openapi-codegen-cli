import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";

import type { QueryKey, UseMutationResult } from "@tanstack/react-query";

export type QueryModule = string | number | symbol;

// Method syntax keeps parameters bivariant, so callbacks with annotated parameters fit the `unknown` defaults.
export type InvalidationMapFunc<TData = unknown, TVariables = unknown> = {
  invalidate(data: TData, variables: TVariables): QueryKey[];
}["invalidate"];

/** The `data` and `variables` one mutation passes to its module's invalidation callback. */
export interface MutationEffectsTypes {
  data: unknown;
  variables: unknown;
}

/** `data` and `variables` of mutation hooks, e.g. `MutationEffectsOf<typeof useCreate | typeof useUpdate>`. */
export type MutationEffectsOf<THook> = THook extends (
  ...args: never
) => UseMutationResult<infer TData, infer _TError, infer TVariables, infer _TOnMutateResult>
  ? { data: TData; variables: TVariables }
  : never;

type ObjectMembers<T> = T extends object ? T : never;
type KeysOfUnion<T> = T extends unknown ? keyof T : never;
type ValueOfUnion<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? T[K] : undefined) : never;
type MergedObjects<T> = { [K in keyof T]: ValueOfUnion<T, K> } & {
  [K in Exclude<KeysOfUnion<T>, keyof T>]?: ValueOfUnion<T, K>;
};

/**
 * The variables of a module's mutations as one object: keys some mutations lack become optional.
 * Mutations without variables (`void`) stay in the union, as their callbacks receive `undefined`.
 */
export type MergedMutationVariables<T> = [ObjectMembers<T>] extends [never]
  ? T
  : MergedObjects<ObjectMembers<T>> | Exclude<T, object>;

type InvalidationMapFuncFor<T> = InvalidationMapFunc<
  T extends MutationEffectsTypes ? T["data"] : never,
  MergedMutationVariables<T extends MutationEffectsTypes ? T["variables"] : never>
>;

/**
 * Query keys to invalidate after a module's mutations. Pass the generated `QueryModuleMutations` as
 * `TMutations` to type each module's callback with its mutations' `data` and `variables`.
 */
export type InvalidationMap<
  TQueryModule extends QueryModule = QueryModule,
  TMutations extends { [K in TQueryModule]?: MutationEffectsTypes } = {},
> = {
  [K in TQueryModule]?: K extends keyof TMutations ? InvalidationMapFuncFor<TMutations[K]> : InvalidationMapFunc;
};

export namespace OpenApiQueryConfig {
  export interface Type<TQueryModule extends QueryModule = QueryModule> {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
    invalidationMap?: InvalidationMap<TQueryModule>;
    crossTabInvalidation?: boolean;
    allowInvalidResponseData?: boolean;
    onError?: (error: unknown) => void;
  }

  const Context = createContext<Type>({});

  type ProviderProps<TQueryModule extends QueryModule = QueryModule> = Type<TQueryModule>;

  export function Provider<TQueryModule extends QueryModule = QueryModule>({
    preferUpdate,
    invalidateCurrentModule,
    invalidationMap,
    crossTabInvalidation,
    allowInvalidResponseData,
    onError,

    children,
  }: PropsWithChildren<ProviderProps<TQueryModule>>) {
    const value = useMemo<Type<TQueryModule>>(
      () => ({
        preferUpdate,
        invalidateCurrentModule,
        invalidationMap,
        crossTabInvalidation,
        allowInvalidResponseData,
        onError,
      }),
      [preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation, allowInvalidResponseData, onError],
    );

    return <Context.Provider value={value as Type}>{children}</Context.Provider>;
  }

  export const useConfig = <TQueryModule extends QueryModule = QueryModule>() => {
    const context = use(Context);
    return (context ?? {}) as Type<TQueryModule>;
  };
}
