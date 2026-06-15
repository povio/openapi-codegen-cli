import { type PropsWithChildren, useEffect } from "react";

import { OpenApiRouter } from "../config/router.context";
import { AbilityContext } from "./ability.context";
import type { AppAbilities } from "./appAbility.types";

interface AclGuardProps<TAppAbilities extends AppAbilities = AppAbilities> {
  canUse: TAppAbilities;
  redirectTo?: string;
}

export const createAclGuard =
  <TAppAbilities extends AppAbilities = AppAbilities>() =>
  ({ canUse, redirectTo = "/", children }: PropsWithChildren<AclGuardProps<TAppAbilities>>) => {
    const ability = AbilityContext.useAbility();

    const { replace } = OpenApiRouter.useRouter();

    const shouldRedirect = !ability.can(canUse[0], canUse[1]);

    useEffect(() => {
      if (shouldRedirect) {
        replace(redirectTo);
      }
    }, [redirectTo, replace, shouldRedirect]);

    if (shouldRedirect) {
      return null;
    }

    return children;
  };
