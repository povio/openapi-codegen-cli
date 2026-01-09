import { type PropsWithChildren, createContext, use, useMemo } from "react";

interface RouterProviderProps {
  replace: (url: string) => void;
}

export namespace OpenApiRouter {
  const Context = createContext<RouterProviderProps | null>(null);

  export const Provider = ({ children, replace }: PropsWithChildren<RouterProviderProps>) => {
    const value = useMemo(() => ({ replace }), [replace]);

    return <Context value={value}>{children}</Context>;
  };

  export const useRouter = () => {
    const context = use(Context);

    if (!context) {
      throw new Error("useRouter must be used within an OpenApiRouter.Provider");
    }

    return context;
  };
}
