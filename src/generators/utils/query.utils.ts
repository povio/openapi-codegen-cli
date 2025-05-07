import { INFINITE_QUERY_PARAMS } from "../const/queries.const";
import { Endpoint } from "../types/endpoint";

export const isQuery = (endpoint: Endpoint) => endpoint.method === "get";

export const isMutation = (endpoint: Endpoint) => endpoint.method !== "get" || !!endpoint.fileDownload;

export const isInfiniteQuery = (endpoint: Endpoint, infiniteQueryParams?: string[]) =>
  isQuery(endpoint) &&
  (infiniteQueryParams ?? Object.values(INFINITE_QUERY_PARAMS)).every((infiniteQueryParam) =>
    endpoint.parameters.some((param) => param.name === infiniteQueryParam && param.type === "Query"),
  );
