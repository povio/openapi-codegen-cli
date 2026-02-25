import { type PropsWithChildren, createContext, use, useMemo } from "react";

type WorkspaceValues = Record<string, unknown>;

interface WorkspaceProviderProps {
  values?: WorkspaceValues;
}

export namespace OpenApiWorkspaceContext {
  const Context = createContext<WorkspaceValues>({});

  export const Provider = ({ values, children }: PropsWithChildren<WorkspaceProviderProps>) => {
    const contextValues = useMemo(() => values ?? {}, [values]);
    return <Context.Provider value={contextValues}>{children}</Context.Provider>;
  };

  export const useContext = () => {
    return use(Context);
  };

  export const resolveParam = <T,>(context: WorkspaceValues, name: string, value: T | null | undefined): T => {
    if (value != null) {
      return value;
    }

    const workspaceValue = context[name];
    if (workspaceValue == null) {
      throw new Error(`Missing workspace context param "${name}"`);
    }

    return workspaceValue as T;
  };
}
