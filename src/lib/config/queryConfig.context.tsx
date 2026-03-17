import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";

import type { QueryKey } from "@tanstack/react-query";

export type QueryModule = string | number | symbol;

export type InvalidationMapFunc<TData = any, TVariables = any> = (data: TData, variables: TVariables) => QueryKey[];
export type InvalidationMap<TQueryModule extends QueryModule = QueryModule, TData = any, TVariables = any> = Partial<
  Record<TQueryModule, InvalidationMapFunc<TData, TVariables>>
>;

export namespace OpenApiQueryConfig {
  export interface Type<TQueryModule extends QueryModule = QueryModule> {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
    invalidationMap?: InvalidationMap<TQueryModule>;
    crossTabInvalidation?: boolean;
    onError?: (error: unknown) => void;
  }

  const Context = createContext<Type>({});

  type ProviderProps<TQueryModule extends QueryModule = QueryModule> = Type<TQueryModule>;

  export function Provider<TQueryModule extends QueryModule = QueryModule>({
    preferUpdate,
    invalidateCurrentModule,
    invalidationMap,
    crossTabInvalidation,
    onError,

    children,
  }: PropsWithChildren<ProviderProps<TQueryModule>>) {
    const value = useMemo<Type<TQueryModule>>(
      () => ({ preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation, onError }),
      [preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation, onError],
    );

    return <Context.Provider value={value as Type}>{children}</Context.Provider>;
  }

  export const useConfig = <TQueryModule extends QueryModule = QueryModule>() => {
    const context = use(Context);
    return (context ?? {}) as Type<TQueryModule>;
  };
}
