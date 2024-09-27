import Handlebars from "handlebars";
import { GenerateOptions } from "../types/options";

enum CommonHelpers {
  COMMA_SEPARATED = "commaSeparated",
}

export function registerCommonHbsHelpers(options: GenerateOptions) {
  registerCommaSeparatedListHelper();
}

function registerCommaSeparatedListHelper() {
  Handlebars.registerHelper(CommonHelpers.COMMA_SEPARATED, (list: string[]) => list.join(", "));
}
