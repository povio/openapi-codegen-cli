import { ACL_APP_ABILITIES, CASL_ABILITY_BINDING, CASL_ABILITY_IMPORT } from "src/generators/const/acl.const";
import { GenerateType, GenerateTypeParams, Import } from "src/generators/types/generate";
import { getAclData, getAppAbilitiesType } from "src/generators/utils/generate/generate.acl.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { getNamespaceName } from "src/generators/utils/namespace.utils";

export function generateAcl({ resolver, data, tag = "" }: GenerateTypeParams) {
  const aclData = getAclData({ resolver, data, tag });
  if (!aclData) {
    return;
  }

  const { hasAdditionalAbilityImports, modelsImports, endpoints } = aclData;

  const caslAbilityTupleImport: Import = {
    bindings: [
      CASL_ABILITY_BINDING.abilityTuple,
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject, CASL_ABILITY_BINDING.subject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
  };

  const hbsTemplate = getHbsTemplateDelegate(resolver, "acl");

  return hbsTemplate({
    caslAbilityTupleImport,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options }),
    endpoints,
  });
}

export function generateAppAcl({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const { appAbilitiesType, hasAdditionalAbilityImports, modelsImports } = getAppAbilitiesType({ resolver, data });

  const caslAbilityTupleImport: Import = {
    bindings: [
      CASL_ABILITY_BINDING.pureAbility,
      CASL_ABILITY_BINDING.abilityTuple,
      ...(!appAbilitiesType ? [CASL_ABILITY_BINDING.subjectType] : []),
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
  };

  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-acl");

  return hbsTemplate({
    caslAbilityTupleImport,
    modelsImports,
    appAbilitiesType,
    appAbilities: ACL_APP_ABILITIES,
    abilityTuple: CASL_ABILITY_BINDING.abilityTuple,
    subjectType: CASL_ABILITY_BINDING.subjectType,
  });
}
