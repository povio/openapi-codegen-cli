import Handlebars from "handlebars";

enum CommonHelpers {
  IsEqual = "isEqual",
  CommaSeparated = "commaSeparated",
  AddAsteriskAfterNewLine = "addAsteriskAfterNewLine",
}

export function registerCommonHbsHelpers() {
  registerIsEqualHelper();
  registerCommaSeparatedListHelper();
  registerAddAsteriskAfterNewLineHelper();
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
