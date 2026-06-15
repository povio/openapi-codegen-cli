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

  const privateRedirectTo = redirectTo || routes?.unauthenticated || "/";
  const publicRedirectTo = redirectTo || routes?.authenticated || "/";
  const redirectTarget =
    type === "private" && !isAuthenticated
      ? privateRedirectTo
      : type === "public-only" && isAuthenticated
        ? publicRedirectTo
        : null;

  useEffect(() => {
    if (hasMounted && redirectTarget) {
      replace(redirectTarget);
    }
  }, [hasMounted, redirectTarget, replace]);

  if (!hasMounted) {
    return loadingState;
  }

  if (redirectTarget) {
    return null;
  }

  return children;
};
