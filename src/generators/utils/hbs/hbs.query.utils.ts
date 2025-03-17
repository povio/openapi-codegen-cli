import Handlebars from "handlebars";
import {
  getAllQueryKeys,
  getEndpointAllQueryKey,
  getEndpointPathQueryKeys,
  getQueryName,
} from "../generate/generate.query.utils";
import { isQuery } from "../queries.utils";

enum QueryHelpers {
  QueryName = "queryName",
  AllQueryKeys = "allQueryKeys",
  EndpointPathQueryKeys = "endpointPathQueryKeys",
  EndpointAllQueryKey = "endpointAllQueryKey",
  IsQuery = "isQuery",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerQueryKeysHelper();
  registerEndpointPathQueryKeysHelper();
  registerEndpointAllQueryKeyHelper();
  registerIsQueryHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QueryName, getQueryName);
}

function registerQueryKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.AllQueryKeys, getAllQueryKeys);
}

function registerEndpointPathQueryKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.EndpointPathQueryKeys, getEndpointPathQueryKeys);
}

function registerEndpointAllQueryKeyHelper() {
  Handlebars.registerHelper(QueryHelpers.EndpointAllQueryKey, getEndpointAllQueryKey);
}

function registerIsQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsQuery, isQuery);
}
