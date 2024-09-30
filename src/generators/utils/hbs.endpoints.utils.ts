import Handlebars from "handlebars";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { getEndpointName, getEndpointPath, mapEndpointParamsToFnParams } from "./generate.endpoints.utils";

enum EndpointsHelpers {
  ENDPOINT_NAME = "endpointName",
  ENDPOINT_PARAMS = "endpointParams",
  ENDPOINT_PATH = "endpointPath",
  ENDPOINT_BODY = "endpointBody",
  ENDPOINT_ARGS = "endpointArgs",
  MORE_THAN_ONE_PARAMETER = "moreThanOneParameter",
}

export function registerEndpointsHbsHelpers(options: GenerateOptions) {
  registerEndpointNameHelper();
  registerEndpointParamsHelper(options);
  registerEndpointPathHelper();
  registerEndpointBodyHelper();
  registerEndpointArgsHelper(options);
  registerMoreThanOneParameterHelper();
}

function registerEndpointNameHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_NAME, getEndpointName);
}

function registerEndpointPathHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_PATH, getEndpointPath);
}

function registerEndpointBodyHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_BODY, (endpoint: Endpoint) =>
    endpoint.parameters.find((params) => params.type === "Body"),
  );
}

function registerEndpointParamsHelper({ schemaSuffix }: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_PARAMS, (endpoint: Endpoint) =>
    mapEndpointParamsToFnParams(endpoint, schemaSuffix),
  );
}

function registerEndpointArgsHelper(options: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_ARGS, (endpoint: Endpoint) =>
    mapEndpointParamsToFnParams(endpoint, options.schemaSuffix)
      .map((param) => param.name)
      .join(", "),
  );
}

function registerMoreThanOneParameterHelper() {
  Handlebars.registerHelper(
    EndpointsHelpers.MORE_THAN_ONE_PARAMETER,
    (endpoint: Endpoint) => endpoint.parameters.length > 1,
  );
}
