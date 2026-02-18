import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";

import type { QueryKey } from "@tanstack/react-query";

export type QueryModule = string | number | symbol;

export type InvalidationMapFunc<TData = any, TVariables = any> = (data: TData, variables: TVariables) => QueryKey[];
export type InvalidationMap<TData = any, TVariables = any> = Record<QueryModule, InvalidationMapFunc<TData, TVariables>>;

export namespace OpenApiQueryConfig {
  interface Type {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
    invalidationMap?: InvalidationMap;
    crossTabInvalidation?: boolean;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({
    preferUpdate,
    invalidateCurrentModule,
    invalidationMap,
    crossTabInvalidation,

    children,
  }: PropsWithChildren<ProviderProps>) => {
    const value = useMemo(
      () => ({ preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation }),
      [preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
