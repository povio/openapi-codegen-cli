import { Endpoint } from "../../types/endpoint";
import { isMutation, isQuery } from "../query.utils";
import { capitalize, snakeToCamel } from "../string.utils";

export const getQueryName = (endpoint: Endpoint, mutation?: boolean) => {
  const addMutationSuffix = isQuery(endpoint) && isMutation(endpoint) && mutation;
  return `use${capitalize(snakeToCamel(endpoint.operationName))}${addMutationSuffix ? "Mutation" : ""}`;
};

export const getInfiniteQueryName = (endpoint: Endpoint) =>
  `use${capitalize(snakeToCamel(endpoint.operationName))}Infinite`;
