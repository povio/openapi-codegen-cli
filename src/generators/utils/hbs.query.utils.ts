import Handlebars from "handlebars";
import { getQueryName } from "./generate.query.utils";

enum QueryHelpers {
  QUERY_NAME = "queryName",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QUERY_NAME, getQueryName);
}
