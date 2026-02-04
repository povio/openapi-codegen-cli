import { ACL_APP_ABILITIES, ACL_CHECK_HOOK } from "@/generators/const/acl.const";
import {
  ABILITY_CONTEXT,
  ABILITY_CONTEXT_IMPORT,
  ERROR_HANDLERS,
  ERROR_HANDLING_IMPORT,
} from "@/generators/const/deps.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getAppAbilitiesImportPath } from "@/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";

export function generateAclCheck(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "acl-check");

  return hbsTemplate({
    abilityContextImport: ABILITY_CONTEXT_IMPORT,
    appAbilitiesImport: {
      bindings: [ACL_APP_ABILITIES],
      from: getAppAbilitiesImportPath(resolver.options),
    },
    errorHandlingImport: ERROR_HANDLING_IMPORT,
    abilityContext: ABILITY_CONTEXT,
    appAbilities: ACL_APP_ABILITIES,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    aclCheckHook: ACL_CHECK_HOOK,
    hasGenericAppAbilities: resolver.options.abilityContextGenericAppAbilities,
  });
}
