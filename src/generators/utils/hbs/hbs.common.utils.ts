import Handlebars from "handlebars";

enum CommonHelpers {
  IS_EQUAL = "isEqual",
  COMMA_SEPARATED = "commaSeparated",
  ADD_ASTERISK_AFTER_NEW_LINE = "addAsteriskAfterNewLine",
}

export function registerCommonHbsHelpers() {
  registerIsEqualHelper();
  registerCommaSeparatedListHelper();
  registerAddAsteriskAfterNewLineHelper();
}

function registerIsEqualHelper() {
  Handlebars.registerHelper(CommonHelpers.IS_EQUAL, (a: any, b: any) => a === b);
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.COMMA_SEPARATED, (list: string[]) => list.join(", "));
}

function registerAddAsteriskAfterNewLineHelper() {
  Handlebars.registerHelper(CommonHelpers.ADD_ASTERISK_AFTER_NEW_LINE, (str: string) => str.replace(/\n/g, "\n *"));
}
