import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";
import type { QueryKey } from "@tanstack/react-query";

export namespace OpenApiQueryConfig {
  export interface Type {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
    invalidationMap?: (context?: any) => Record<string, QueryKey[]>;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({
    preferUpdate,
    invalidateCurrentModule,
    invalidationMap,
    children,
  }: PropsWithChildren<ProviderProps>) => {
    const value = useMemo(
      () => ({ preferUpdate, invalidateCurrentModule, invalidationMap }),
      [preferUpdate, invalidateCurrentModule, invalidationMap],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
