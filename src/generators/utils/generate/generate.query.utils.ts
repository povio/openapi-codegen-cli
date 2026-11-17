import { Endpoint } from "@/generators/types/endpoint";
import { isMutation, isQuery } from "@/generators/utils/query.utils";
import { capitalize, snakeToCamel } from "@/generators/utils/string.utils";

const operationNameByEndpoint = new WeakMap<Endpoint, string>();
const capitalizedOperationNameByEndpoint = new WeakMap<Endpoint, string>();

function getOperationName(endpoint: Endpoint) {
  let name = operationNameByEndpoint.get(endpoint);
  if (name === undefined) {
    name = snakeToCamel(endpoint.operationName);
    operationNameByEndpoint.set(endpoint, name);
  }
  return name;
}

function getCapitalizedOperationName(endpoint: Endpoint) {
  let name = capitalizedOperationNameByEndpoint.get(endpoint);
  if (name === undefined) {
    name = capitalize(getOperationName(endpoint));
    capitalizedOperationNameByEndpoint.set(endpoint, name);
  }
  return name;
}

export const getQueryName = (endpoint: Endpoint, mutation?: boolean) => {
  const addMutationSuffix = isQuery(endpoint) && isMutation(endpoint) && mutation;
  return `use${getCapitalizedOperationName(endpoint)}${addMutationSuffix ? "Mutation" : ""}`;
};

export const getInfiniteQueryName = (endpoint: Endpoint) => `use${getCapitalizedOperationName(endpoint)}Infinite`;

export const getQueryOptionsName = (endpoint: Endpoint) => `${getOperationName(endpoint)}QueryOptions`;

export const getInfiniteQueryOptionsName = (endpoint: Endpoint) => `${getOperationName(endpoint)}InfiniteQueryOptions`;

export const getPrefetchQueryName = (endpoint: Endpoint) => `prefetch${getCapitalizedOperationName(endpoint)}`;

export const getPrefetchInfiniteQueryName = (endpoint: Endpoint) =>
  `prefetch${getCapitalizedOperationName(endpoint)}Infinite`;
