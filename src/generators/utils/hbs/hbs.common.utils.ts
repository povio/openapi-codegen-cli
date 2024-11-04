import Handlebars from "handlebars";

enum CommonHelpers {
  IS_EQUAL = "isEqual",
  COMMA_SEPARATED = "commaSeparated",
}

export function registerCommonHbsHelpers() {
  registerIsEqualHelper();
  registerCommaSeparatedListHelper();
}

function registerIsEqualHelper() {
  Handlebars.registerHelper(CommonHelpers.IS_EQUAL, (a: any, b: any) => a === b);
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.COMMA_SEPARATED, (list: string[]) => list.join(", "));
}
