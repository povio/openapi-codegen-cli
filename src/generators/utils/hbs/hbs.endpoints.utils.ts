import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "../../types/endpoint";
import { GenerateOptions } from "../../types/options";
import {
  getEndpointName,
  getEndpointPath,
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
} from "../generate/generate.endpoints.utils";
import { isSchemaObject } from "../openapi-schema.utils";
import { isParamMediaTypeAllowed } from "../openapi.utils";
import { camelToSpaceSeparated, capitalize } from "../string.utils";

enum EndpointsHelpers {
  EndpointName = "endpointName",
  ImportedEndpointName = "importedEndpointName",
  EndpointParams = "endpointParams",
  EndpointPath = "endpointPath",
  EndpointBody = "endpointBody",
  EndpointArgs = "endpointArgs",
  EndpointParamDescription = "endpointParamDescription",
}

export function registerEndpointsHbsHelpers(resolver: SchemaResolver) {
  registerEndpointNameHelper();
  registerImportedEndpointNameHelper(resolver.options);
  registerEndpointParamsHelper(resolver);
  registerEndpointPathHelper();
  registerEndpointBodyHelper();
  registerEndpointArgsHelper(resolver);
  registerEndpointParamDescriptionHelper();
}

function registerEndpointNameHelper() {
  Handlebars.registerHelper(EndpointsHelpers.EndpointName, getEndpointName);
}

function registerImportedEndpointNameHelper(options: GenerateOptions) {
  Handlebars.registerHelper(EndpointsHelpers.ImportedEndpointName, (endpoint: Endpoint) =>
    getImportedEndpointName(endpoint, options),
  );
}

function registerEndpointPathHelper() {
  Handlebars.registerHelper(EndpointsHelpers.EndpointPath, getEndpointPath);
}

function registerEndpointBodyHelper() {
  Handlebars.registerHelper(EndpointsHelpers.EndpointBody, (endpoint: Endpoint) =>
    endpoint.parameters.find((params) => params.type === "Body"),
  );
}

function registerEndpointParamsHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(EndpointsHelpers.EndpointParams, (endpoint: Endpoint) =>
    mapEndpointParamsToFunctionParams(resolver, endpoint),
  );
}

function registerEndpointArgsHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(EndpointsHelpers.EndpointArgs, (endpoint: Endpoint) =>
    mapEndpointParamsToFunctionParams(resolver, endpoint)
      .map((param) => param.name)
      .join(", "),
  );
}

function registerEndpointParamDescriptionHelper() {
  Handlebars.registerHelper(
    EndpointsHelpers.EndpointParamDescription,
    (endpointParam: ReturnType<typeof mapEndpointParamsToFunctionParams>[0]) => {
      const strs = [`${endpointParam.paramType} parameter`];

      const description = endpointParam.parameterObject?.description || endpointParam.bodyObject?.description;
      if (description) {
        strs.push(description);
      }

      let schema: OpenAPIV3.SchemaObject | undefined = undefined;
      let mediaTypeObject: OpenAPIV3.MediaTypeObject | undefined = undefined;
      if (endpointParam.parameterObject?.schema && isSchemaObject(endpointParam.parameterObject.schema)) {
        schema = endpointParam.parameterObject?.schema;
      }
      if (endpointParam.bodyObject?.content) {
        const mediaTypes = Object.keys(endpointParam.bodyObject.content ?? {});
        const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
        if (matchingMediaType) {
          mediaTypeObject = endpointParam.bodyObject.content[matchingMediaType];
          if (mediaTypeObject.schema && isSchemaObject(mediaTypeObject.schema)) {
            schema = mediaTypeObject.schema;
          }
        }
      }

      if (schema) {
        const schemaKeys: (keyof OpenAPIV3.SchemaObject)[] = [
          "description",
          "minimum",
          "exclusiveMinimum",
          "maximum",
          "exclusiveMaximum",
          "minItems",
          "minLength",
          "minProperties",
          "maxItems",
          "maxLength",
          "maxProperties",
          "example",
        ];
        schemaKeys
          .filter((key) => schema[key])
          .forEach((key) => {
            strs.push(`${capitalize(camelToSpaceSeparated(key))}: \`${schema[key]}\``);
          });
      }

      if (mediaTypeObject?.example) {
        strs.push(`Example: \`${mediaTypeObject.example}\``);
      }

      return strs.join(". ");
    },
  );
}
