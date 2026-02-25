import { AbilityTuple } from "@casl/ability";
import { type ErrorHandler, SharedErrorHandler } from "@povio/openapi-codegen-cli";
import { AbilityContext } from "@povio/openapi-codegen-cli/acl";
import { useCallback } from "react";
import { AppAbilities } from "@/data/acl/app.ability";

interface UseAclCheckProps {
  errorHandler?: ErrorHandler<never>;
}

export function useAclCheck({ errorHandler }: UseAclCheckProps = {}) {
  const ability = AbilityContext.useAbility<AppAbilities>();

  const checkAcl = useCallback(
    (appAbility: AppAbilities) => {
      if (!ability.can(...(appAbility as AbilityTuple))) {
        (errorHandler ?? SharedErrorHandler).rethrowError(new Error("ACL check failed"));
      }
    },
    [ability, errorHandler],
  );

  return { checkAcl };
}
