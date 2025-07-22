import { ACL_ALL_ABILITIES } from "src/generators/const/acl.const";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { Endpoint } from "../../types/endpoint";
import { capitalize, snakeToCamel } from "../string.utils";
import { getEndpointTag } from "./generate.endpoints.utils";
import { getNamespaceName } from "./generate.utils";

export const getAbilityTypeName = (endpoint: Endpoint) =>
  `Use${capitalize(snakeToCamel(endpoint.operationName))}Ability`;

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

export const getAbilityConditionsTypes = (endpoint: Endpoint) => endpoint.acl?.[0].conditionsTypes;

export const getAbilityDescription = (endpoint: Endpoint) => endpoint.acl?.[0].description;

export const getTagAllAbilitiesName = (tag: string) => `${capitalize(tag)}${ACL_ALL_ABILITIES}`;
