import { ACL_APP_ABILITIES, ACL_CHECK_HOOK, CASL_ABILITY_BINDING } from "@/generators/const/acl.const";
import {
  ABILITY_CONTEXT,
  ABILITY_CONTEXT_IMPORT,
  ERROR_HANDLERS,
  ERROR_HANDLING_IMPORT,
} from "@/generators/const/deps.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getAppAbilitiesImportPath } from "@/generators/utils/generate/generate.utils";

export function generateAclCheck(resolver: SchemaResolver) {
  const abilityContextImportPath = resolver.options.abilityContextImportPath || ABILITY_CONTEXT_IMPORT.from;
  const appAbilitiesImportPath = getAppAbilitiesImportPath(resolver.options);
  const errorHandlingImportPath = resolver.options.errorHandlingImportPath || ERROR_HANDLING_IMPORT.from;

  const genericAppAbilities = resolver.options.abilityContextGenericAppAbilities ? `<${ACL_APP_ABILITIES}>` : "";
  return `import { ${CASL_ABILITY_BINDING.abilityTuple} } from "@casl/ability";
import { type ${ERROR_HANDLERS.ErrorHandler}, ${ERROR_HANDLERS.SharedErrorHandler} } from "${errorHandlingImportPath}";
import { ${ABILITY_CONTEXT} } from "${abilityContextImportPath}";
import { useCallback } from "react";
import { ${ACL_APP_ABILITIES} } from "${appAbilitiesImportPath}";

interface UseAclCheckProps {
  errorHandler?: ${ERROR_HANDLERS.ErrorHandler}<never>;
}

export function ${ACL_CHECK_HOOK}({ errorHandler }: UseAclCheckProps = {}) {
  const ability = ${ABILITY_CONTEXT}.useAbility${genericAppAbilities}();

  const checkAcl = useCallback((appAbility: ${ACL_APP_ABILITIES}) => {
    if (!ability.can(...(appAbility as ${CASL_ABILITY_BINDING.abilityTuple}))) {
      (errorHandler ?? ${ERROR_HANDLERS.SharedErrorHandler}).rethrowError(new Error("ACL check failed"));
    }
  }, [ability, errorHandler]);

  return { checkAcl };
}
`;
}
