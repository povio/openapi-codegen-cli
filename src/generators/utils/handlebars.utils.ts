import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { generateEndpointArgs } from "../generate/generateEndpointArgs";
import { generateEndpointConfig } from "../generate/generateEndpointConfig";
import { generateEndpointParams } from "../generate/generateEndpointParams";
import { generateQuery } from "../generate/generateQuery";
import { generateQueryKeys } from "../generate/generateQueryKeys";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { isSchemaObject } from "./openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "./openapi.utils";
import { capitalize, decapitalize, snakeToCamel } from "./string.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "./zod-schema.utils";

export function setZodSchemaInferedTypeNameHelper({ schemaSuffix }: GenerateOptions) {
  Handlebars.registerHelper("getZodSchemaInferedTypeName", (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, schemaSuffix),
  );
}

export function setEndpointNameHelper() {
  Handlebars.registerHelper("getEndpointName", (endpoint: Endpoint) =>
    decapitalize(snakeToCamel(endpoint.operationName)),
  );
}

export function setEndpointParamsHelper({ schemaSuffix }: GenerateOptions) {
  Handlebars.registerHelper("getEndpointParams", (endpoint: Endpoint) => {
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
  });
}

export function setGenerateEndpointParamsHelper(options: GenerateOptions) {
  Handlebars.registerHelper("generateEndpointParams", (endpoint: Endpoint) =>
    generateEndpointParams(endpoint, options),
  );
}

export function setGenerateEndpointArgsHelper(options: GenerateOptions) {
  Handlebars.registerHelper("generateEndpointArgs", (endpoint: Endpoint) => generateEndpointArgs(endpoint, options));
}

export function setEndpointPathHelper() {
  Handlebars.registerHelper("getEndpointPath", (endpoint: Endpoint) =>
    endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}"),
  );
}

export function setEndpointBodyHelper() {
  Handlebars.registerHelper("getEndpointBody", (endpoint: Endpoint) =>
    endpoint.parameters.find((params) => params.type === "Body"),
  );
}

export function setGenerateEndpointConfigHelper() {
  Handlebars.registerHelper("generateEndpointConfig", (endpoint: Endpoint) => generateEndpointConfig(endpoint));
}

export function setGenerateQueryKeysHelper(options: GenerateOptions) {
  Handlebars.registerHelper("generateQueryKeys", (endpoints: Endpoint[]) => generateQueryKeys(endpoints, options));
}

export function setQueryNameHelper() {
  Handlebars.registerHelper(
    "getQueryName",
    (endpoint: Endpoint) => `use${capitalize(snakeToCamel(endpoint.operationName))}`,
  );
}

export function setGenerateQueryHelper(options: GenerateOptions) {
  Handlebars.registerHelper("generateQuery", (endpoint: Endpoint) => generateQuery(endpoint, options));
}

export function setHasMoreThanOneParameterHelper() {
  Handlebars.registerHelper("hasMoreThanOneParameter", (endpoint: Endpoint) => endpoint.parameters.length > 1);
}
