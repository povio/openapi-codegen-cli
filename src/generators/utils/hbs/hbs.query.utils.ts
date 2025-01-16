import Handlebars from "handlebars";
import { getAllQueryKeys, getEndpointPathQueryKeys, getQueryName } from "../generate/generate.query.utils";

enum QueryHelpers {
  QUERY_NAME = "queryName",
  ALL_QUERY_KEYS = "allQueryKeys",
  ENDPOINT_PATH_QUERY_KEYS = "endpointPathQueryKeys",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerQueryKeysHelper();
  registerEndpointPathQueryKeysHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QUERY_NAME, getQueryName);
}

function registerQueryKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.ALL_QUERY_KEYS, getAllQueryKeys);
}

function registerEndpointPathQueryKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.ENDPOINT_PATH_QUERY_KEYS, getEndpointPathQueryKeys);
}
