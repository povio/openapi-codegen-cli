import { createContext, use, useMemo } from "react";
import { PropsWithChildren } from "react";

export namespace OpenApiQueryConfig {
  interface Type {
    preferUpdate?: boolean;
    invalidateCurrentModule?: boolean;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({ preferUpdate, invalidateCurrentModule, children }: PropsWithChildren<ProviderProps>) => {
    const value = useMemo(() => ({ preferUpdate, invalidateCurrentModule }), [preferUpdate, invalidateCurrentModule]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
