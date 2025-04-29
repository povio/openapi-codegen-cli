import { QUERIES_MODULE_NAME } from "src/generators/const/queries.const";
import { Endpoint } from "../../types/endpoint";
import { capitalize, snakeToCamel } from "../string.utils";

export const getQueryName = (endpoint: Endpoint) => `use${capitalize(snakeToCamel(endpoint.operationName))}`;

export const getInfiniteQueryName = (endpoint: Endpoint) =>
  `use${capitalize(snakeToCamel(endpoint.operationName))}Infinite`;

export const getTagModuleName = (tag: string) => `${capitalize(tag)}${capitalize(QUERIES_MODULE_NAME)}`;

export const getTagKeys = (tag: string) => `${capitalize(tag)}Keys`;
