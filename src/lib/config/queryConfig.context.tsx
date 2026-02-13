import type { QueryKey } from "@tanstack/react-query";
import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";

export namespace OpenApiQueryConfig {
  interface Type {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
    invalidationMap?: Record<string, (context: Record<string, string>) => QueryKey[]>;
    crossTabInvalidation?: boolean;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({ preferUpdate, invalidateCurrentModule,
    invalidationMap,
    crossTabInvalidation,

    children }: PropsWithChildren<ProviderProps>) => {
    const value = useMemo(() => ({ preferUpdate, invalidateCurrentModule, invalidationMap, crossTabInvalidation }), [preferUpdate, invalidateCurrentModule, invalidationMap   , crossTabInvalidation]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
