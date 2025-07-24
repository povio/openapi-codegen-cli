import Handlebars from "handlebars";
import { capitalize } from "../string.utils";

enum CommonHelpers {
  IsEqual = "isEqual",
  CommaSeparated = "commaSeparated",
  AddAsteriskAfterNewLine = "addAsteriskAfterNewLine",
  JSONStringify = "jsonStringify",
  Capitalize = "capitalize",
}

export function registerCommonHbsHelpers() {
  registerIsEqualHelper();
  registerCommaSeparatedListHelper();
  registerAddAsteriskAfterNewLineHelper();
  registerJsonStringifyHelper();
  registerCapitalizeHelper();
}

function registerIsEqualHelper() {
  Handlebars.registerHelper(CommonHelpers.IsEqual, (a: any, b: any) => a === b);
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.CommaSeparated, (list: string[]) => list.join(", "));
}

function registerAddAsteriskAfterNewLineHelper() {
  Handlebars.registerHelper(CommonHelpers.AddAsteriskAfterNewLine, (str: string) => str.replace(/\n/g, "\n *"));
}

function registerJsonStringifyHelper() {
  Handlebars.registerHelper(CommonHelpers.JSONStringify, (obj: any) => JSON.stringify(obj, null, 2));
}

function registerCapitalizeHelper() {
  Handlebars.registerHelper(CommonHelpers.Capitalize, capitalize);
}
