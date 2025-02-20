import Handlebars from "handlebars";
import {
  getAbilityAction,
  getAbilityConditionsTypes,
  getAbilityFunctionName,
  getAbilitySubject,
  getAbilityTypeName,
  getTagAllAbilitiesName,
  hasAbilityConditions,
} from "../generate/generate.acl.utils";

enum AclHelpers {
  ABILITY_TYPE_NAME = "abilityTypeName",
  ABILITY_FUNCTION_NAME = "abilityFunctionName",
  ABILITY_ACTION = "ablityAction",
  ABILITY_SUBJECT = "ablitySubject",
  HAS_ABILITY_CONDITIONS = "hasAbilityConditions",
  ABILITY_CONDITIONS_TYPES = "abilityConditionsTypes",
  TAG_ALL_ABILITIES_NAME = "tagAllAbilitiesName",
}

export function registerAclHbsHelpers() {
  registerAbilityTypeNameHelper();
  registerAbilityFunctionNameHelper();
  registerAbilityActionHelper();
  registerAbilitySubjectHelper();
  registerHasAbilityConditionsHelper();
  registerAbilityConditionsTypesHelper();
  registerTagAllAbilitiesNameHelper();
}

function registerAbilityTypeNameHelper() {
  Handlebars.registerHelper(AclHelpers.ABILITY_TYPE_NAME, getAbilityTypeName);
}

function registerAbilityFunctionNameHelper() {
  Handlebars.registerHelper(AclHelpers.ABILITY_FUNCTION_NAME, getAbilityFunctionName);
}

function registerAbilityActionHelper() {
  Handlebars.registerHelper(AclHelpers.ABILITY_ACTION, getAbilityAction);
}

function registerAbilitySubjectHelper() {
  Handlebars.registerHelper(AclHelpers.ABILITY_SUBJECT, getAbilitySubject);
}

function registerHasAbilityConditionsHelper() {
  Handlebars.registerHelper(AclHelpers.HAS_ABILITY_CONDITIONS, hasAbilityConditions);
}

function registerAbilityConditionsTypesHelper() {
  Handlebars.registerHelper(AclHelpers.ABILITY_CONDITIONS_TYPES, getAbilityConditionsTypes);
}

function registerTagAllAbilitiesNameHelper() {
  Handlebars.registerHelper(AclHelpers.TAG_ALL_ABILITIES_NAME, getTagAllAbilitiesName);
}
