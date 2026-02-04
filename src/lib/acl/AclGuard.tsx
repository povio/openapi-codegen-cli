import type { PropsWithChildren } from "react";
import { AbilityContext } from "./ability.context";
import { OpenApiRouter } from "../config/router.context";

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

    if (!ability.can(canUse[0], canUse[1])) {
      replace(redirectTo);
      return null;
    }

    return children;
  };
