import {
  ACL_ALL_ABILITIES,
  ACL_APP_ABILITIES,
  CASL_ABILITY_BINDING,
  CASL_ABILITY_IMPORT,
} from "src/generators/const/acl.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType, GenerateTypeParams, Import } from "src/generators/types/generate";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getTagAllAbilitiesName } from "src/generators/utils/generate/generate.acl.utils";
import { getEntityImports, getModelsImports } from "src/generators/utils/generate/generate.imports.utils";
import { getNamespaceName } from "src/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";

export function generateAcl({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints.filter(({ acl }) => acl && acl.length > 0);
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const hasAdditionalAbilityImports = endpoints.some(
    ({ acl }) => acl?.[0].conditions && Object.keys(acl[0].conditions).length > 0,
  );
  const caslAbilityTupleImport: Import = {
    bindings: [
      CASL_ABILITY_BINDING.abilityTuple,
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject, CASL_ABILITY_BINDING.subject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
  };

  const aclZodSchemas = endpoints.reduce((acc, endpoint) => {
    const zodSchemas = endpoint.acl?.[0].conditionsTypes?.reduce(
      (acc, propertyType) => [...acc, ...(propertyType?.zodSchemaName ? [propertyType.zodSchemaName] : [])],
      [] as string[],
    );
    return [...acc, ...(zodSchemas ?? [])];
  }, [] as string[]);

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemasAsTypes: getUniqueArray(aclZodSchemas),
  });

  const hbsTemplate = getHbsTemplateDelegate(resolver, "acl");

  return hbsTemplate({
    caslAbilityTupleImport,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options }),
    endpoints,
  });
}

export function generateAppAcl(resolver: SchemaResolver, tags: string[]) {
  const caslAbilityTupleImport: Import = {
    bindings: [
      CASL_ABILITY_BINDING.pureAbility,
      ...(tags.length === 0 ? [CASL_ABILITY_BINDING.subjectType, CASL_ABILITY_BINDING.abilityTuple] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
  };

  const imports = getEntityImports({
    tags,
    entityName: ACL_ALL_ABILITIES,
    getAliasEntityName: getTagAllAbilitiesName,
    type: GenerateType.Acl,
    options: resolver.options,
  });

  const namespaces = tags.map((tag) => getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options }));

  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-acl");

  return hbsTemplate({
    caslAbilityTupleImport,
    imports,
    allAbilities: ACL_ALL_ABILITIES,
    appAbilities: ACL_APP_ABILITIES,
    includeNamespace: resolver.options.tsNamespaces,
    tags,
    namespaces,
    abilityTuple: CASL_ABILITY_BINDING.abilityTuple,
    subjectType: CASL_ABILITY_BINDING.subjectType,
  });
}
