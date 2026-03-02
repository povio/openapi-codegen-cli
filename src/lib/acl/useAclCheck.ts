import { useCallback } from "react";

import { type ErrorHandler, SharedErrorHandler } from "../rest/error-handling";
import { AbilityContext } from "./ability.context";
import type { AppAbilities } from "./appAbility.types";

interface UseAclCheckProps {
  errorHandler?: ErrorHandler<never>;
}

export function useAclCheck<TAppAbilities extends AppAbilities = AppAbilities>({
  errorHandler,
}: UseAclCheckProps = {}) {
  const ability = AbilityContext.useAbility<TAppAbilities>();

  const checkAcl = useCallback(
    (appAbility: TAppAbilities) => {
      const can = ability.can as unknown as (...appAbility: AppAbilities) => boolean;
      if (!can(...(appAbility as AppAbilities))) {
        (errorHandler ?? SharedErrorHandler).rethrowError(new Error("ACL check failed"));
      }
    },
    [ability, errorHandler],
  );

  return { checkAcl };
}
