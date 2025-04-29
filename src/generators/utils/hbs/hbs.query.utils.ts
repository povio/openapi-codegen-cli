import Handlebars from "handlebars";
import { getInfiniteQueryName, getQueryName, getTagKeys, getTagModuleName } from "../generate/generate.query.utils";
import { isInfiniteQuery, isQuery } from "../query.utils";
import { Endpoint } from "src/generators/types/endpoint";
import { INFINITE_QUERY_PARAMS } from "src/generators/const/queries.const";

enum QueryHelpers {
  QueryName = "queryName",
  IsQuery = "isQuery",
  InfiniteQueryName = "infiniteQueryName",
  IsInfiniteQuery = "isInfiniteQuery",
  TagModuleName = "tagModuleName",
  TagKeys = "tagKeys",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerIsQueryHelper();
  registerInfiniteQueryNameHelper();
  registerIsInfiniteQueryHelper();
  registerTagModuleNameHelper();
  registerTagKeysHelper();
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QueryName, getQueryName);
}

function registerInfiniteQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.InfiniteQueryName, getInfiniteQueryName);
}

function registerIsQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsQuery, isQuery);
}

function registerIsInfiniteQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsInfiniteQuery, (endpoint: Endpoint) =>
    isInfiniteQuery(endpoint, Object.values(INFINITE_QUERY_PARAMS)),
  );
}

function registerTagModuleNameHelper() {
  Handlebars.registerHelper(QueryHelpers.TagModuleName, getTagModuleName);
}

function registerTagKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.TagKeys, getTagKeys);
}
