import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint } from "@/generators/types/endpoint";

import { isGetEndpoint, isPaginatedGetEndpoint } from "./endpoint.utils";
import { isCursorPaginatedGetEndpoint, mapEndpointParamsToFunctionParams } from "./generate/generate.endpoints.utils";

export const isQuery = (endpoint: Endpoint) => isGetEndpoint(endpoint);

export const isMutation = (endpoint: Endpoint) => !isGetEndpoint(endpoint) || !!endpoint.mediaDownload;

export const isInfiniteQuery = (resolver: SchemaResolver, endpoint: Endpoint) =>
  isPaginatedGetEndpoint(endpoint, resolver.options) || isCursorPaginatedGetEndpoint(resolver, endpoint);

export const getDestructuredVariables = (
  resolver: SchemaResolver,
  endpoint: Endpoint,
  updateQueryEndpoints: Endpoint[],
) => {
  const requiredUpdateQueryParams = updateQueryEndpoints.reduce(
    (acc, updateEndpoint) => [
      ...acc,
      ...mapEndpointParamsToFunctionParams(resolver, updateEndpoint, { includeOnlyRequiredParams: true }).map(
        (param) => param.name,
      ),
    ],
    [] as string[],
  );

  return mapEndpointParamsToFunctionParams(resolver, endpoint, {
    includeOnlyRequiredParams: true,
    excludeBodyParam: true,
  })
    .filter((param) => requiredUpdateQueryParams.includes(param.name))
    .map((param) => param.name);
};
