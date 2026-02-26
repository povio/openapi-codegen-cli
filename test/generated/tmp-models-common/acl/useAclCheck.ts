import { AbilityTuple } from "@casl/ability";
import { type ErrorHandler, SharedErrorHandler } from "";
import { AbilityContext } from "";
import { useCallback } from "react";
import { AppAbilities } from "../acl/app.ability";

interface UseAclCheckProps {
  errorHandler?: ErrorHandler<never>;
}

export function useAclCheck({ errorHandler }: UseAclCheckProps = {}) {
  const ability = AbilityContext.useAbility();

  const checkAcl = useCallback((appAbility: AppAbilities) => {
    if (!ability.can(...(appAbility as AbilityTuple))) {
      (errorHandler ?? SharedErrorHandler).rethrowError(new Error("ACL check failed"));
    }
  }, [ability, errorHandler]);

  return { checkAcl };
}
