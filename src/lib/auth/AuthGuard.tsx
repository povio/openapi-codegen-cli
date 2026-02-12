import { type PropsWithChildren, useEffect, useState } from "react";

import { OpenApiRouter } from "../config/router.context";
import { AuthContext } from "./auth.context";

export interface AuthGuardProps {
  type: "public-only" | "private";
  redirectTo?: string;
}

export const AuthGuard = ({ type, redirectTo, children }: PropsWithChildren<AuthGuardProps>) => {
  const { isAuthenticated, routes, loadingState } = AuthContext.useAuth();
  const { replace } = OpenApiRouter.useRouter();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return loadingState;
  }

  if (type === "private" && !isAuthenticated) {
    replace(redirectTo || routes?.unauthenticated || "/");
    return null;
  }

  if (type === "public-only" && isAuthenticated) {
    replace(redirectTo || routes?.authenticated || "/");
    return null;
  }

  return children;
};
