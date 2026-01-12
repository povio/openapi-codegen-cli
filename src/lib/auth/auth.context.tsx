import { type PropsWithChildren, type ReactNode, createContext, use, useMemo } from "react";

export namespace AuthContext {
  export interface Routes {
    authenticated?: string;
    unauthenticated?: string;
  }

  interface Type<TUser = unknown> {
    isAuthenticated: boolean;
    isInitializing: boolean;
    logout: () => void;
    updateTokens?: (accessToken: string | null, refreshToken?: string | null) => void;
    accessToken?: string | null;
    user?: TUser | null;
    userPromise?: () => Promise<TUser | null>;
    routes?: Routes;
    loadingState?: ReactNode;
  }

  const Context = createContext<Type>({} as never);

  type ProviderProps<TUser = unknown> = Type<TUser>;

  export const Provider = <TUser,>({
    isAuthenticated,
    isInitializing,
    logout,
    updateTokens,
    accessToken,
    user,
    userPromise,
    routes,
    loadingState,
    children,
  }: PropsWithChildren<ProviderProps<TUser>>) => {
    const value: Type<TUser> = useMemo(
      () => ({
        isAuthenticated,
        isInitializing,
        logout,
        updateTokens,
        accessToken,
        user,
        userPromise,
        routes,
        loadingState,
      }),
      [isAuthenticated, isInitializing, logout, updateTokens, accessToken, user, userPromise, routes, loadingState],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  export const useAuth = <TUser,>() => {
    const auth = use(Context);
    return auth as Type<TUser>;
  };
}
