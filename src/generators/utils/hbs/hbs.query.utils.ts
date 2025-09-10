import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "src/generators/types/endpoint";
import { getInfiniteQueryName, getQueryName } from "src/generators/utils/generate/generate.query.utils";
import { isInfiniteQuery, isMutation, isQuery } from "src/generators/utils/query.utils";

enum QueryHelpers {
  QueryName = "queryName",
  IsQuery = "isQuery",
  IsMutation = "isMutation",
  InfiniteQueryName = "infiniteQueryName",
  IsInfiniteQuery = "isInfiniteQuery",
}

export function registerQueryHbsHelpers(resolver: SchemaResolver) {
  registerQueryNameHelper();
  registerIsQueryHelper();
  registerIsMutationHelper();
  registerInfiniteQueryNameHelper();
  registerIsInfiniteQueryHelper(resolver);
}

function registerQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.QueryName, (endpoint: Endpoint, options: { hash: { mutation?: boolean } }) =>
    getQueryName(endpoint, options.hash.mutation),
  );
}

function registerInfiniteQueryNameHelper() {
  Handlebars.registerHelper(QueryHelpers.InfiniteQueryName, getInfiniteQueryName);
}

function registerIsQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsQuery, isQuery);
}

function registerIsMutationHelper() {
  Handlebars.registerHelper(QueryHelpers.IsMutation, isMutation);
}

function registerIsInfiniteQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(QueryHelpers.IsInfiniteQuery, (endpoint: Endpoint) =>
    isInfiniteQuery(endpoint, resolver.options),
  );
}
