import { OpenAPIV3 } from "openapi-types";
import { Endpoint, ExtendedEndpoint } from "src/generators/types/endpoint";
import { GenerateOptions } from "src/generators/types/options";

export const isGetEndpoint = (endpoint: Endpoint) => endpoint.method === OpenAPIV3.HttpMethods.GET;

export const isPaginatedGetEndpoint = (endpoint: Endpoint, options: GenerateOptions) =>
  isGetEndpoint(endpoint) &&
  Object.values(options.infiniteQueryParamNames).every((infiniteQueryParam) =>
    endpoint.parameters.some((param) => param.name === infiniteQueryParam && param.type === "Query"),
  );

export const isReadAllEndpoint = (endpoint: ExtendedEndpoint, options: GenerateOptions) =>
  endpoint.method === OpenAPIV3.HttpMethods.GET &&
  !isPathSegmentParam(endpoint.pathSegments.at(-1)) &&
  isPaginatedGetEndpoint(endpoint, options);

export const isReadEndpoint = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.method === OpenAPIV3.HttpMethods.GET && hasMatchingPathWithTrailingParam(endpoint, readAllEndpoint);

export const isCreateEndpoint = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.method === OpenAPIV3.HttpMethods.POST && hasMatchingPathWithoutTrailingParam(endpoint, readAllEndpoint);

export const isUpdateEndpoint = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  [OpenAPIV3.HttpMethods.PUT, OpenAPIV3.HttpMethods.PATCH].includes(endpoint.method) &&
  hasMatchingPathWithTrailingParam(endpoint, readAllEndpoint);

export const isDeleteEndpoint = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.method === OpenAPIV3.HttpMethods.DELETE && hasMatchingPathWithTrailingParam(endpoint, readAllEndpoint);

export const isBulkDeleteEndpoint = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.method === OpenAPIV3.HttpMethods.DELETE && hasMatchingPathWithoutTrailingParam(endpoint, readAllEndpoint);

export const getPathSegments = (path: string) => path.split("/").filter(Boolean);

export const isPathSegmentParam = (pathSegment?: string) => pathSegment?.startsWith(":");

const hasMatchingPath = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  readAllEndpoint.pathSegments.every(
    (segment, index) =>
      (isPathSegmentParam(segment) && isPathSegmentParam(endpoint.pathSegments[index])) ||
      segment === endpoint.pathSegments[index],
  );

const hasMatchingPathWithoutTrailingParam = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.pathSegments.length === readAllEndpoint.pathSegments.length && hasMatchingPath(endpoint, readAllEndpoint);

const hasMatchingPathWithTrailingParam = (endpoint: ExtendedEndpoint, readAllEndpoint: ExtendedEndpoint) =>
  endpoint.pathSegments.length - 1 === readAllEndpoint.pathSegments.length &&
  isPathSegmentParam(endpoint.pathSegments.at(-1)) &&
  hasMatchingPath(endpoint, readAllEndpoint);
