import { INFINITE_QUERY_PARAMS } from "../const/queries.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { Endpoint } from "../types/endpoint";
import { mapEndpointParamsToFunctionParams } from "./generate/generate.endpoints.utils";

export const isQuery = (endpoint: Endpoint) => endpoint.method === "get";

export const isMutation = (endpoint: Endpoint) => endpoint.method !== "get" || !!endpoint.mediaDownload;

export const isInfiniteQuery = (endpoint: Endpoint, infiniteQueryParams?: string[]) =>
  isQuery(endpoint) &&
  (infiniteQueryParams ?? Object.values(INFINITE_QUERY_PARAMS)).every((infiniteQueryParam) =>
    endpoint.parameters.some((param) => param.name === infiniteQueryParam && param.type === "Query"),
  );

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
