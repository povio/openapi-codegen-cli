import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "src/generators/types/endpoint";
import { GenerateOptions } from "src/generators/types/options";
import {
  getAbilityAction,
  getAbilityConditionsTypes,
  getAbilityDescription,
  getAbilityFunctionName,
  getAbilitySubject,
  getAbilityTypeName,
  getImportedAbilityFunctionName,
  getTagAllAbilitiesName,
  hasAbilityConditions,
} from "src/generators/utils/generate/generate.acl.utils";

enum AclHelpers {
  AbilityTypeName = "abilityTypeName",
  AbilityFunctionName = "abilityFunctionName",
  ImportedAbilityFunctionName = "importedAbilityFunctionName",
  AbilityAction = "ablityAction",
  AbilitySubject = "ablitySubject",
  HasAbilityConditions = "hasAbilityConditions",
  AbilityConditionsTypes = "abilityConditionsTypes",
  AbilityDescription = "abilityDescription",
  TagAllAbilitiesName = "tagAllAbilitiesName",
}

export function registerAclHbsHelpers(resolver: SchemaResolver) {
  registerAbilityTypeNameHelper();
  registerAbilityFunctionNameHelper();
  registerImportedAbilityFunctionNameHelper(resolver.options);
  registerAbilityActionHelper();
  registerAbilitySubjectHelper();
  registerHasAbilityConditionsHelper();
  registerAbilityConditionsTypesHelper();
  registerAbilityDescriptionHelper();
  registerTagAllAbilitiesNameHelper();
}

function registerAbilityTypeNameHelper() {
  Handlebars.registerHelper(AclHelpers.AbilityTypeName, getAbilityTypeName);
}

function registerAbilityFunctionNameHelper() {
  Handlebars.registerHelper(AclHelpers.AbilityFunctionName, getAbilityFunctionName);
}

function registerImportedAbilityFunctionNameHelper(options: GenerateOptions) {
  Handlebars.registerHelper(AclHelpers.ImportedAbilityFunctionName, (endpoint: Endpoint) =>
    getImportedAbilityFunctionName(endpoint, options),
  );
}

function registerAbilityActionHelper() {
  Handlebars.registerHelper(AclHelpers.AbilityAction, getAbilityAction);
}

function registerAbilitySubjectHelper() {
  Handlebars.registerHelper(AclHelpers.AbilitySubject, getAbilitySubject);
}

function registerHasAbilityConditionsHelper() {
  Handlebars.registerHelper(AclHelpers.HasAbilityConditions, hasAbilityConditions);
}

function registerAbilityConditionsTypesHelper() {
  Handlebars.registerHelper(AclHelpers.AbilityConditionsTypes, getAbilityConditionsTypes);
}

function registerAbilityDescriptionHelper() {
  Handlebars.registerHelper(AclHelpers.AbilityDescription, getAbilityDescription);
}

function registerTagAllAbilitiesNameHelper() {
  Handlebars.registerHelper(AclHelpers.TagAllAbilitiesName, getTagAllAbilitiesName);
}
