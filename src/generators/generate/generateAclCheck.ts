import { ACL_APP_ABILITIES, ACL_CHECK_HOOK } from "src/generators/const/acl.const";
import {
  ABILITY_CONTEXT,
  ABILITY_CONTEXT_IMPORT,
  ERROR_HANDLERS,
  ERROR_HANDLING_IMPORT,
} from "src/generators/const/deps.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { getAppAbilitiesImportPath } from "src/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";

export function generateAclCheck(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "acl-check");

  return hbsTemplate({
    abilityContextImport: {
      ...ABILITY_CONTEXT_IMPORT,
      from: resolver.options.abilityContextImportPath,
    },
    appAbilitiesImport: {
      bindings: [ACL_APP_ABILITIES],
      from: getAppAbilitiesImportPath(resolver.options),
    },
    errorHandlingImport: {
      ...ERROR_HANDLING_IMPORT,
      from: resolver.options.errorHandlingImportPath,
    },
    abilityContext: ABILITY_CONTEXT,
    appAbilities: ACL_APP_ABILITIES,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    aclCheckHook: ACL_CHECK_HOOK,
    hasGenericAppAbilities: resolver.options.abilityContextGenericAppAbilities,
  });
}
