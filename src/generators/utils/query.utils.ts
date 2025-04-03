import { Endpoint } from "../types/endpoint";

export const isQuery = (endpoint: Endpoint) => endpoint.method === "get";

export const isMutation = (endpoint: Endpoint) => endpoint.method !== "get";

export const isInfiniteQuery = (endpoint: Endpoint, infiniteQueryParams: string[]) => {
  return (
    isQuery(endpoint) &&
    infiniteQueryParams.every((infiniteQueryParam) =>
      endpoint.parameters.some((param) => param.name === infiniteQueryParam && param.type === "Query"),
    )
  );
};
