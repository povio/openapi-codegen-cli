import { createContext, use, useMemo } from "react";

export namespace OpenApiQueryConfig {
  interface Type {
    preferUpdate?: boolean;
  }

  const Context = createContext<Type>({});

  type ProviderProps = Type;

  export const Provider = ({ preferUpdate = true, children }: React.PropsWithChildren<ProviderProps>) => {
    const value = useMemo(() => ({ preferUpdate }), [preferUpdate]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useConfig = () => {
    const context = use(Context);
    return context ?? {};
  };
}
