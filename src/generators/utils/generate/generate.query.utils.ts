import { Endpoint } from "src/generators/types/endpoint";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getNamespaceName } from "src/generators/utils/namespace.utils";
import { isMutation, isQuery } from "src/generators/utils/query.utils";
import { capitalize, snakeToCamel } from "src/generators/utils/string.utils";
import { getEndpointTag } from "src/generators/utils/tag.utils";

export const getQueryName = (endpoint: Endpoint, mutation?: boolean) => {
  const addMutationSuffix = isQuery(endpoint) && isMutation(endpoint) && mutation;
  return `use${capitalize(snakeToCamel(endpoint.operationName))}${addMutationSuffix ? "Mutation" : ""}`;
};

export const getInfiniteQueryName = (endpoint: Endpoint) =>
  `use${capitalize(snakeToCamel(endpoint.operationName))}Infinite`;

export const getImportedQueryName = (endpoint: Endpoint, options: GenerateOptions) => {
  const namespacePrefix = options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Queries, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getQueryName(endpoint)}`;
};

export const getImportedInfiniteQueryName = (endpoint: Endpoint, options: GenerateOptions) => {
  const namespacePrefix = options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Queries, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getInfiniteQueryName(endpoint)}`;
};
