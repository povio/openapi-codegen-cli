import { useCallback } from "react";

import { type ErrorHandler, SharedErrorHandler } from "../rest/error-handling";
import { AbilityContext } from "./ability.context";
import type { AppAbilities, AppAbility } from "./appAbility.types";

interface UseAclCheckProps {
  errorHandler?: ErrorHandler<never>;
}

export function useAclCheck<TAppAbilities extends AppAbilities = AppAbilities>({
  errorHandler,
}: UseAclCheckProps = {}) {
  const ability = AbilityContext.useAbility<TAppAbilities>() as AppAbility;

  const checkAcl = useCallback(
    (appAbility: TAppAbilities) => {
      const [action, subject] = appAbility as AppAbilities;
      if (!ability.can(action, subject)) {
        (errorHandler ?? SharedErrorHandler).rethrowError(new Error("ACL check failed"));
      }
    },
    [ability, errorHandler],
  );

  return { checkAcl };
}
