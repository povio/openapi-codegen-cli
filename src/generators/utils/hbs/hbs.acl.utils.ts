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
  getAbilitySubjectTypes,
  getImportedAbilityFunctionName,
  hasAbilityConditions,
} from "src/generators/utils/generate/generate.acl.utils";

enum AclHelpers {
  AbilityFunctionName = "abilityFunctionName",
  ImportedAbilityFunctionName = "importedAbilityFunctionName",
  AbilityAction = "ablityAction",
  AbilitySubject = "ablitySubject",
  HasAbilityConditions = "hasAbilityConditions",
  AbilityConditionsTypes = "abilityConditionsTypes",
  AbilityDescription = "abilityDescription",
  AbilitySubjectTypes = "abilitySubjectTypes",
}

export function registerAclHbsHelpers(resolver: SchemaResolver) {
  registerAbilityFunctionNameHelper();
  registerImportedAbilityFunctionNameHelper(resolver.options);
  registerAbilityActionHelper();
  registerAbilitySubjectHelper();
  registerHasAbilityConditionsHelper();
  registerAbilityConditionsTypesHelper();
  registerAbilityDescriptionHelper();
  registerAbilitySubjectTypesHelper();
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

function registerAbilitySubjectTypesHelper() {
  Handlebars.registerHelper(AclHelpers.AbilitySubjectTypes, getAbilitySubjectTypes);
}
