import Handlebars from "handlebars";
import { getQueryName } from "../generate/generate.query.utils";
import { isQuery } from "../queries.utils";

enum QueryHelpers {
  QueryName = "queryName",
  IsQuery = "isQuery",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerIsQueryHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QueryName, getQueryName);
}

function registerIsQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsQuery, isQuery);
}
