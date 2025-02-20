import { ACL_ALL_ABILITIES, CASL_ABILITY_BINDING, CASL_ABILITY_IMPORT } from "../const/acl.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getTagAllAbilitiesName } from "../utils/generate/generate.acl.utils";
import { getAclImports, getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

export function generateAcl({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints.filter(({ acl }) => acl && acl.length > 0);
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const caslAbilityTupleImport: Import = {
    ...CASL_ABILITY_IMPORT,
    bindings: [
      CASL_ABILITY_BINDING.abilityTuple,
      ...(endpoints.filter(({ acl }) => acl?.[0].conditions)
        ? [CASL_ABILITY_BINDING.forcedSubject, CASL_ABILITY_BINDING.subject]
        : []),
    ],
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
    includeNamespace: resolver.options.includeNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options }),
    endpoints,
  });
}

export function generateAppAcl(resolver: SchemaResolver, tags: string[]) {
  const caslAbilityTupleImport: Import = {
    ...CASL_ABILITY_IMPORT,
    bindings: [CASL_ABILITY_BINDING.pureAbility],
  };

  const imports = getAclImports({
    tags,
    entityName: ACL_ALL_ABILITIES,
    getAliasEntityName: getTagAllAbilitiesName,
    options: resolver.options,
  });

  const namespaces = tags.map((tag) => getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options }));

  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-acl");

  return hbsTemplate({
    caslAbilityTupleImport,
    imports,
    allAbilities: ACL_ALL_ABILITIES,
    includeNamespace: resolver.options.includeNamespaces,
    tags,
    namespaces,
  });
}
