import { createContext, use, useMemo } from "react";

export namespace QueryConfig {
  interface Type {
    preferUpdate?: boolean;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({ preferUpdate, children }: React.PropsWithChildren<ProviderProps>) => {
    const value = useMemo(() => ({ preferUpdate }), [preferUpdate]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
