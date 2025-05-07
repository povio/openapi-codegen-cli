import Handlebars from "handlebars";
import { getInfiniteQueryName, getQueryName, getTagKeys, getTagModuleName } from "../generate/generate.query.utils";
import { isInfiniteQuery, isMutation, isQuery } from "../query.utils";
import { Endpoint } from "src/generators/types/endpoint";

enum QueryHelpers {
  QueryName = "queryName",
  IsQuery = "isQuery",
  IsMutation = "isMutation",
  InfiniteQueryName = "infiniteQueryName",
  IsInfiniteQuery = "isInfiniteQuery",
  TagModuleName = "tagModuleName",
  TagKeys = "tagKeys",
}

export function registerQueryHbsHelpers() {
  registerQueryNameHelper();
  registerIsQueryHelper();
  registerIsMutationHelper();
  registerInfiniteQueryNameHelper();
  registerIsInfiniteQueryHelper();
  registerTagModuleNameHelper();
  registerTagKeysHelper();
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

function registerIsInfiniteQueryHelper() {
  Handlebars.registerHelper(QueryHelpers.IsInfiniteQuery, (endpoint: Endpoint) => isInfiniteQuery(endpoint));
}

function registerTagModuleNameHelper() {
  Handlebars.registerHelper(QueryHelpers.TagModuleName, getTagModuleName);
}

function registerTagKeysHelper() {
  Handlebars.registerHelper(QueryHelpers.TagKeys, getTagKeys);
}
