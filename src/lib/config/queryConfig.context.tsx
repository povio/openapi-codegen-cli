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
type IsUnion<T, TAll = T> = T extends unknown ? ([TAll] extends [T] ? false : true) : never;
// Objects whose fields merge; arrays, functions and dates are kept as they are.
type MergeableMembers<T> = T extends readonly unknown[] | ((...args: never) => unknown) | Date
  ? never
  : ObjectMembers<T>;
type MergedValue<T> =
  true extends IsUnion<MergeableMembers<T>> ? MergedObjects<MergeableMembers<T>> | Exclude<T, MergeableMembers<T>> : T;
// `Extract<keyof T, …>` rather than `keyof T`: a homomorphic mapped type would map each union member separately.
type MergedObjects<T> = { [K in Extract<keyof T, PropertyKey>]: MergedValue<ValueOfUnion<T, K>> } & {
  [K in Exclude<KeysOfUnion<T>, keyof T>]?: MergedValue<ValueOfUnion<T, K>>;
};

// `void` (a mutation without variables or response body) is `undefined` at runtime.
type VoidAsUndefined<T> = [void] extends [T] ? Exclude<T, void> | undefined : T;

/**
 * A union of a module's mutation values as one object: keys some mutations lack become optional, at any
 * depth (e.g. fields of request bodies only some mutations send). `void` becomes `undefined`, which is
 * what callbacks receive for mutations without one.
 */
export type MergedMutationValues<T> = [ObjectMembers<T>] extends [never]
  ? VoidAsUndefined<T>
  : MergedObjects<ObjectMembers<T>> | VoidAsUndefined<Exclude<T, object>>;

/** The variables of a module's mutations as one object; see `MergedMutationValues`. */
export type MergedMutationVariables<T> = MergedMutationValues<T>;

/** The responses of a module's mutations as one object; see `MergedMutationValues`. */
export type MergedMutationData<T> = MergedMutationValues<T>;

type InvalidationMapFuncFor<T> = InvalidationMapFunc<
  MergedMutationData<T extends MutationEffectsTypes ? T["data"] : never>,
  MergedMutationVariables<T extends MutationEffectsTypes ? T["variables"] : never>
>;

declare global {
  /**
   * Mutation types per module. The generated `queryModules.ts` extends it with `QueryModuleMutations`, so
   * `InvalidationMap<QueryModule>` types its callbacks from the spec. Global, because interfaces re-exported
   * from bundled declaration chunks can't be augmented through the package's entry points.
   */
  // oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type -- extended by generated code
  interface OpenApiCodegenQueryModuleMutations {}

  /** The generated `QueryModule` enum, registered by `queryModules.ts` as `{ queryModule: QueryModule }`. */
  // oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type -- extended by generated code
  interface OpenApiCodegenQueryModules {}
}

/** The generated `QueryModule` enum once `queryModules.ts` registers it, else any module key. */
export type RegisteredQueryModule = OpenApiCodegenQueryModules extends {
  queryModule: infer TModule extends QueryModule;
}
  ? TModule
  : QueryModule;

/**
 * Query keys to invalidate after a module's mutations. Without type arguments it is keyed by the generated
 * `QueryModule` and typed by its `QueryModuleMutations`, so a bare `InvalidationMap` is typed from the spec.
 */
export type InvalidationMap<
  TQueryModule extends QueryModule = RegisteredQueryModule,
  TMutations extends { [K in TQueryModule]?: MutationEffectsTypes } = OpenApiCodegenQueryModuleMutations,
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
