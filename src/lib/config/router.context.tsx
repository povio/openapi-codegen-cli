import { type PropsWithChildren, createContext, use, useMemo } from "react";

export interface RouterContextValue<TUrl = string> {
  replace: (url: TUrl) => void;
}

export namespace OpenApiRouter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Context = createContext<RouterContextValue<any> | null>(null);

  export const Provider = <TUrl = string,>({ children, replace }: PropsWithChildren<RouterContextValue<TUrl>>) => {
    const value = useMemo(() => ({ replace }), [replace]);

    return <Context value={value}>{children}</Context>;
  };

  export function useRouter<TUrl = string>(): RouterContextValue<TUrl> {
    const context = use(Context);

    if (!context) {
      throw new Error("useRouter must be used within an OpenApiRouter.Provider");
    }

    return context;
  }
}
