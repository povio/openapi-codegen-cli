import { ACL_ALL_ABILITIES } from "src/generators/const/acl.const";
import { Endpoint } from "../../types/endpoint";
import { capitalize, snakeToCamel } from "../string.utils";

export const getAbilityTypeName = (endpoint: Endpoint) =>
  `Use${capitalize(snakeToCamel(endpoint.operationName))}Ability`;

export const getAbilityFunctionName = (endpoint: Endpoint) =>
  `canUse${capitalize(snakeToCamel(endpoint.operationName))}`;

export const getAbilityAction = (endpoint: Endpoint) => endpoint.acl?.[0].action;

export const getAbilitySubject = (endpoint: Endpoint) => endpoint.acl?.[0].subject;

export const hasAbilityConditions = (endpoint: Endpoint) => !!getAbilityConditionsTypes(endpoint)?.length;

export const getAbilityConditionsTypes = (endpoint: Endpoint) => endpoint.acl?.[0].conditionsTypes;

export const getAbilityDescription = (endpoint: Endpoint) => endpoint.acl?.[0].description;

export const getTagAllAbilitiesName = (tag: string) => `${capitalize(tag)}${ACL_ALL_ABILITIES}`;
