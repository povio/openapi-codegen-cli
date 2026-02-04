import { Endpoint } from "@/generators/types/endpoint";
import { GenerateType } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isMutation, isQuery } from "@/generators/utils/query.utils";
import { capitalize, snakeToCamel } from "@/generators/utils/string.utils";
import { getEndpointTag } from "@/generators/utils/tag.utils";

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
