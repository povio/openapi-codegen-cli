import { Endpoint } from "src/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getNamespaceName } from "src/generators/utils/namespace.utils";
import { capitalize, snakeToCamel } from "src/generators/utils/string.utils";
import { getEndpointTag } from "src/generators/utils/tag.utils";
import { getModelsImports, mergeImports } from "./generate.imports.utils";

export const getAbilityFunctionName = (endpoint: Endpoint) =>
  `canUse${capitalize(snakeToCamel(endpoint.operationName))}`;

export const getImportedAbilityFunctionName = (endpoint: Endpoint, options: GenerateOptions) => {
  const namespacePrefix = options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Acl, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getAbilityFunctionName(endpoint)}`;
};

export const getAbilityAction = (endpoint: Endpoint) => endpoint.acl?.[0].action;

export const getAbilitySubject = (endpoint: Endpoint) => endpoint.acl?.[0].subject;

export const hasAbilityConditions = (endpoint: Endpoint) => !!getAbilityConditionsTypes(endpoint)?.length;

export const getAbilityConditionsTypes = (endpoint: Endpoint) =>
  endpoint.acl?.[0].conditionsTypes?.sort((a, b) => a.name.localeCompare(b.name));

export const getAbilityDescription = (endpoint: Endpoint) => endpoint.acl?.[0].description;

export const getAbilitySubjectTypes = (endpoint: Endpoint) => {
  const abilitySubject = getAbilitySubject(endpoint);
  const types: string[] = [`"${abilitySubject ?? ""}"`];

  if (hasAbilityConditions(endpoint)) {
    types.push(
      `ForcedSubject<"${abilitySubject}"> & { ${getAbilityConditionsTypes(endpoint)
        ?.map(
          (conditionType) =>
            `${conditionType.name}${conditionType.required ? "" : "?"}: ${conditionType.type ?? ""}${conditionType.zodSchemaName ?? ""},`,
        )
        .join(" ")} }`,
    );
  }

  return types;
};

export function getAclData({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints.filter(({ acl }) => acl && acl.length > 0);
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const hasAdditionalAbilityImports = endpoints.some(
    ({ acl }) => acl?.[0].conditions && Object.keys(acl[0].conditions).length > 0,
  );

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

  return { endpoints, hasAdditionalAbilityImports, modelsImports };
}

export const getAppAbilitiesType = ({ resolver, data }: Omit<GenerateTypeParams, "tag">) => {
  const appAbilitiesTypeMap: Map<string, Set<string>> = new Map();
  const modelsImportsArr: Import[][] = [];
  let hasAdditionalAbilityImports = false;

  data.forEach((_, tag) => {
    const aclData = getAclData({ resolver, data, tag });
    if (!aclData) {
      return;
    }

    const {
      modelsImports: tagModelsImports,
      hasAdditionalAbilityImports: tagHasAdditionalAbilityImports,
      endpoints,
    } = aclData;

    modelsImportsArr.push(tagModelsImports);
    hasAdditionalAbilityImports = hasAdditionalAbilityImports || tagHasAdditionalAbilityImports;

    endpoints.forEach((endpoint) => {
      const abilityAction = getAbilityAction(endpoint);
      if (abilityAction) {
        appAbilitiesTypeMap.set(
          abilityAction,
          new Set([...(appAbilitiesTypeMap.get(abilityAction) ?? []), ...getAbilitySubjectTypes(endpoint)]),
        );
      }
    });
  });

  const modelsImports = mergeImports(resolver.options, ...modelsImportsArr);
  const appAbilitiesType =
    appAbilitiesTypeMap.size > 0
      ? Object.fromEntries(
          Array.from(appAbilitiesTypeMap.entries()).map(([key, valueSet]) => [key, Array.from(valueSet)]),
        )
      : undefined;

  return { appAbilitiesType, modelsImports, hasAdditionalAbilityImports };
};
