import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { DEFAULT_HEADERS } from "../../const/endpoints.const";
import { Endpoint } from "../../types/endpoint";
import { isSchemaObject } from "../openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "../openapi.utils";
import { decapitalize, snakeToCamel } from "../string.utils";
import { isNamedZodSchema } from "../zod-schema.utils";
import { getNamespaceName } from "./generate.utils";
import { getImportedZodSchemaInferedTypeName } from "./generate.zod.utils";

export const getEndpointName = (endpoint: Endpoint) => decapitalize(snakeToCamel(endpoint.operationName));

export function getImportedEndpointName(endpoint: Endpoint, options: GenerateOptions) {
  const namespacePrefix = options.includeNamespaces
    ? `${getNamespaceName({ type: GenerateType.Endpoints, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getEndpointName(endpoint)}`;
}

export const getEndpointPath = (endpoint: Endpoint) => endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}");

export const getEndpointTag = (endpoint: Endpoint, options: GenerateOptions) =>
  endpoint.tags?.[0] ?? options.defaultTag;

export function mapEndpointParamsToFunctionParams({
  resolver,
  endpoint,
  options,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  options: GenerateOptions;
}): { name: string; type: string; required: boolean }[] {
  return endpoint.parameters
    .map((param) => {
      let type = "string";
      if (isNamedZodSchema(param.zodSchema)) {
        type = getImportedZodSchemaInferedTypeName({ resolver, zodSchemaName: param.zodSchema, options });
      } else if (param.parameterObject?.schema && isSchemaObject(param.parameterObject.schema)) {
        const openApiSchemaType = (param.parameterObject?.schema as OpenAPIV3.SchemaObject)?.type;
        if (openApiSchemaType && isPrimitiveType(openApiSchemaType)) {
          type = primitiveTypeToTsType(openApiSchemaType);
        }
      }

      return {
        name: param.name,
        type,
        paramType: param.type,
        required: param.parameterObject?.required ?? true,
      };
    })
    .sort((a, b) => {
      if (a.required === b.required) {
        const sortedParamTypes = ["Path", "Query", "Header", "Body"];
        return sortedParamTypes.indexOf(a.paramType) - sortedParamTypes.indexOf(b.paramType);
      }
      return a.required ? -1 : 1;
    });
}

export function getEndpointConfig(endpoint: Endpoint) {
  const params = endpoint.parameters.filter((param) => param.type === "Query");
  const headers = {
    ...(endpoint.requestFormat !== DEFAULT_HEADERS["Content-Type"] ? { "Content-Type": endpoint.requestFormat } : {}),
    ...(endpoint.responseFormat && endpoint.responseFormat !== DEFAULT_HEADERS.Accept
      ? { Accept: endpoint.responseFormat }
      : {}),
  };
  const endpointConfig = {
    ...(params.length > 0 ? { params } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
  };
  return endpointConfig;
}
