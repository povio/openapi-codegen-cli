import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "../../types/endpoint";
import { GenerateOptions } from "../../types/options";
import {
  getEndpointName,
  getEndpointPath,
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
} from "../generate/generate.endpoints.utils";

enum EndpointsHelpers {
  ENDPOINT_NAME = "endpointName",
  IMPORTED_ENDPOINT_NAME = "importedEndpointName",
  ENDPOINT_PARAMS = "endpointParams",
  ENDPOINT_PATH = "endpointPath",
  ENDPOINT_BODY = "endpointBody",
  ENDPOINT_ARGS = "endpointArgs",
  MORE_THAN_ONE_PARAMETER = "moreThanOneParameter",
}

export function registerEndpointsHbsHelpers(resolver: SchemaResolver, options: GenerateOptions) {
  registerEndpointNameHelper();
  registerImportedEndpointNameHelper(options);
  registerEndpointParamsHelper(resolver, options);
  registerEndpointPathHelper();
  registerEndpointBodyHelper();
  registerEndpointArgsHelper(resolver, options);
  registerMoreThanOneParameterHelper();
}

function registerEndpointNameHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_NAME, getEndpointName);
}

function registerImportedEndpointNameHelper(options: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.IMPORTED_ENDPOINT_NAME, (endpoint: Endpoint) =>
    getImportedEndpointName(endpoint, options),
  );
}

function registerEndpointPathHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_PATH, getEndpointPath);
}

function registerEndpointBodyHelper() {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_BODY, (endpoint: Endpoint) =>
    endpoint.parameters.find((params) => params.type === "Body"),
  );
}

function registerEndpointParamsHelper(resolver: SchemaResolver, options: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_PARAMS, (endpoint: Endpoint) =>
    mapEndpointParamsToFunctionParams({ resolver, endpoint, options }),
  );
}

function registerEndpointArgsHelper(resolver: SchemaResolver, options: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_ARGS, (endpoint: Endpoint) =>
    mapEndpointParamsToFunctionParams({ resolver, endpoint, options })
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
