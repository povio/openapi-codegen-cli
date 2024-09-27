import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { getEndpointName, getZodSchemaInferedTypeName } from "./generate.utils";
import { isSchemaObject } from "./openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "./openapi.utils";
import { isNamedZodSchema } from "./zod-schema.utils";

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
  Handlebars.registerHelper(EndpointsHelpers.ENDPOINT_PATH, (endpoint: Endpoint) =>
    endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}"),
  );
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

function mapEndpointParamsToFnParams(
  endpoint: Endpoint,
  schemaSuffix: string,
): { name: string; type: string; required: boolean }[] {
  return endpoint.parameters
    .map((param) => {
      let type = "string";
      if (isNamedZodSchema(param.schema)) {
        type = getZodSchemaInferedTypeName(param.schema, schemaSuffix);
      } else if (param.openApiObject?.schema && isSchemaObject(param.openApiObject.schema)) {
        const openApiSchemaType = (param.openApiObject?.schema as OpenAPIV3.SchemaObject)?.type;
        if (openApiSchemaType && isPrimitiveType(openApiSchemaType)) {
          type = primitiveTypeToTsType(openApiSchemaType);
        }
      }

      return {
        name: param.name,
        type,
        required: param.openApiObject?.required ?? true,
      };
    })
    .sort((a, b) => (a.required === b.required ? 0 : a.required ? -1 : 1));
}
