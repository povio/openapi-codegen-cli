import Handlebars from "handlebars";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { capitalize, snakeToCamel } from "./string.utils";

enum QueryHelpers {
  QUERY_NAME = "queryName",
}

export function registerQueryHbssHelpers(options: GenerateOptions) {
  registerQueryNameHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(
    QueryHelpers.QUERY_NAME,
    (endpoint: Endpoint) => `use${capitalize(snakeToCamel(endpoint.operationName))}`,
  );
}
