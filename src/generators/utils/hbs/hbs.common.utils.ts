import Handlebars from "handlebars";

import { capitalize } from "@/generators/utils/string.utils";

enum CommonHelpers {
  IsEqual = "isEqual",
  CommaSeparated = "commaSeparated",
  Union = "union",
  AddAsteriskAfterNewLine = "addAsteriskAfterNewLine",
  JSONStringify = "jsonStringify",
  Capitalize = "capitalize",
}

export function registerCommonHbsHelpers() {
  registerIsEqualHelper();
  registerCommaSeparatedListHelper();
  registerUnionHelper();
  registerAddAsteriskAfterNewLineHelper();
  registerJsonStringifyHelper();
  registerCapitalizeHelper();
}

function registerIsEqualHelper() {
  Handlebars.registerHelper(CommonHelpers.IsEqual, (a: unknown, b: unknown) => a === b);
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.CommaSeparated, (list: string[]) => list.join(", "));
}

function registerUnionHelper() {
  Handlebars.registerHelper(CommonHelpers.Union, (list: string[]) => list.join(" | "));
}

function registerAddAsteriskAfterNewLineHelper() {
  Handlebars.registerHelper(CommonHelpers.AddAsteriskAfterNewLine, (str: string) => str.replace(/\n/g, "\n *"));
}

function registerJsonStringifyHelper() {
  Handlebars.registerHelper(CommonHelpers.JSONStringify, (obj: unknown) => JSON.stringify(obj, null, 2));
}

function registerCapitalizeHelper() {
  Handlebars.registerHelper(CommonHelpers.Capitalize, capitalize);
}
