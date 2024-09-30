import Handlebars from "handlebars";

enum CommonHelpers {
  COMMA_SEPARATED = "commaSeparated",
}

export function registerCommonHbsHelpers() {
  registerCommaSeparatedListHelper();
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.COMMA_SEPARATED, (list: string[]) => list.join(", "));
}
