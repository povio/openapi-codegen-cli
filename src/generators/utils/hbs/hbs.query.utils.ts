import Handlebars from "handlebars";
import { getInfiniteQueryName, getQueryName } from "../generate/generate.query.utils";
import { isInfiniteQuery, isQuery } from "../query.utils";
import { Endpoint } from "src/generators/types/endpoint";
import { INFINITE_QUERY_PARAMS } from "src/generators/const/query.const";

enum QueryHelpers {
  QueryName = "queryName",
  IsQuery = "isQuery",
  InfiniteQueryName = "infiniteQueryName",
  IsInfiniteQuery = "isInfiniteQuery",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerIsQueryHelper();
  registerInfiniteQueryNameHelper();
  registerIsInfiniteQueryHelper();
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
