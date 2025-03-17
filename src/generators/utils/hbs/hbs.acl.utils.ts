import Handlebars from "handlebars";
import {
  getAbilityAction,
  getAbilityConditionsTypes,
  getAbilityDescription,
  getAbilityFunctionName,
  getAbilitySubject,
  getAbilityTypeName,
  getTagAllAbilitiesName,
  hasAbilityConditions,
} from "../generate/generate.acl.utils";

enum AclHelpers {
  AbilityTypeName = "abilityTypeName",
  AbilityFunctionName = "abilityFunctionName",
  AbilityAction = "ablityAction",
  AbilitySubject = "ablitySubject",
  HasAbilityConditions = "hasAbilityConditions",
  AbilityConditionsTypes = "abilityConditionsTypes",
  AbilityDescription = "abilityDescription",
  TagAllAbilitiesName = "tagAllAbilitiesName",
}

export function registerAclHbsHelpers() {
  registerAbilityTypeNameHelper();
  registerAbilityFunctionNameHelper();
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
