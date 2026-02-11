import { ACL_APP_ABILITIES, ACL_CHECK_HOOK, CASL_ABILITY_BINDING, CASL_ABILITY_IMPORT } from "@/generators/const/acl.const";
import {
  ABILITY_CONTEXT,
  ABILITY_CONTEXT_IMPORT,
  ERROR_HANDLERS,
} from "@/generators/const/deps.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Import } from "@/generators/types/generate";
import { getAppAbilitiesImportPath } from "@/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";

export function generateAclCheck(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "acl-check");

  const abilityTupleImport: Import = {
    bindings: [CASL_ABILITY_BINDING.abilityTuple],
    from: CASL_ABILITY_IMPORT.from,
    typeOnly: true,
  };

  const errorHandlingImport: Import = {
    bindings: [`type ${ERROR_HANDLERS.ErrorHandler}`, ERROR_HANDLERS.SharedErrorHandler],
    from: PACKAGE_IMPORT_PATH,
  };

  const appAbilitiesImport: Import = {
    bindings: [ACL_APP_ABILITIES],
    from: getAppAbilitiesImportPath(resolver.options),
    typeOnly: true,
  };

  return hbsTemplate({
    abilityTupleImport,
    appAbilitiesImport,
    errorHandlingImport,
    abilityContextImport: ABILITY_CONTEXT_IMPORT,
    abilityContext: ABILITY_CONTEXT,
    appAbilities: ACL_APP_ABILITIES,
    abilityTuple: CASL_ABILITY_BINDING.abilityTuple,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    aclCheckHook: ACL_CHECK_HOOK,
    hasGenericAppAbilities: resolver.options.abilityContextGenericAppAbilities,
  });
}
