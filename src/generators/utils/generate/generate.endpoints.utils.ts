import { OpenAPIV3 } from "openapi-types";

import { BODY_PARAMETER_NAME, DEFAULT_HEADERS } from "../../const/endpoints.const";
import type { SchemaResolver } from "../../core/SchemaResolver.class";
import type { Endpoint } from "../../types/endpoint";
import { GenerateType } from "../../types/generate";
import type { GenerateOptions } from "../../types/options";
import { invalidVariableNameCharactersToCamel, isValidPropertyName } from "../js.utils";
import { getNamespaceName } from "../namespace.utils";
import { isPrimitiveType } from "../openapi.utils";
import { isSchemaObject } from "../openapi-schema.utils";
import { isQuery } from "../query.utils";
import { decapitalize, snakeToCamel } from "../string.utils";
import { getEndpointTag } from "../tag.utils";
import { primitiveTypeToTsType } from "../ts.utils";
import { isNamedZodSchema } from "../zod-schema.utils";
import { getImportedZodSchemaInferedTypeName } from "./generate.zod.utils";

export const getEndpointName = (endpoint: Endpoint) => decapitalize(snakeToCamel(endpoint.operationName));

export function getImportedEndpointName(endpoint: Endpoint, options: GenerateOptions) {
  const namespacePrefix = options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Endpoints, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getEndpointName(endpoint)}`;
}

export const requiresBody = (endpoint: Endpoint) => endpoint.method !== OpenAPIV3.HttpMethods.GET;

export const getEndpointBody = (endpoint: Endpoint) => endpoint.parameters.find((param) => param.type === "Body");

export const hasEndpointConfig = (endpoint: Endpoint, resolver: SchemaResolver) => {
  const endpointConfig = getEndpointConfig(endpoint);
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  return Object.keys(endpointConfig).length > 0 || hasAxiosRequestConfig;
};

export const getEndpointPath = (endpoint: Endpoint) => endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}");

export function mapEndpointParamsToFunctionParams(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options?: {
    excludeBodyParam?: boolean;
    excludePageParam?: boolean;
    replacePageParam?: boolean;
    includeFileParam?: boolean;
    includeOnlyRequiredParams?: boolean;
    pathParamsRequiredOnly?: boolean;
  },
) {
  const params = endpoint.parameters.map((param) => {
    let type = "string";
    if (isNamedZodSchema(param.zodSchema)) {
      type = getImportedZodSchemaInferedTypeName(resolver, param.zodSchema);
    } else if (param.parameterObject?.schema && isSchemaObject(param.parameterObject.schema)) {
      const openApiSchemaType = (param.parameterObject?.schema as OpenAPIV3.SchemaObject)?.type;
      if (openApiSchemaType && isPrimitiveType(openApiSchemaType)) {
        type = primitiveTypeToTsType(openApiSchemaType);
      }
    }

    return {
      name: invalidVariableNameCharactersToCamel(param.name),
      type,
      paramType: param.type,
      required: param.parameterObject?.required ?? true,
      parameterObject: param.parameterObject,
      bodyObject: param.bodyObject,
    };
  });

  if (options?.includeFileParam && endpoint.mediaUpload) {
    params.push({
      name: "file",
      type: "File",
      paramType: "Body",
      required: false,
      parameterObject: undefined,
      bodyObject: undefined,
    });
  }

  return params
    .sort((a, b) => {
      if (a.required === b.required) {
        const sortedParamTypes = ["Path", "Body", "Query", "Header"];
        return sortedParamTypes.indexOf(a.paramType) - sortedParamTypes.indexOf(b.paramType);
      }
      return a.required ? -1 : 1;
    })
    .filter(
      (param) =>
        (!options?.excludeBodyParam || param.name !== BODY_PARAMETER_NAME) &&
        (!options?.excludePageParam || param.name !== resolver.options.infiniteQueryParamNames.page) &&
        (!options?.includeOnlyRequiredParams || param.required),
    )
    .map((param) => ({
      ...param,
      name:
        options?.replacePageParam && param.name === resolver.options.infiniteQueryParamNames.page
          ? "pageParam"
          : param.name,
      required: param.required && (param.paramType === "Path" || !options?.pathParamsRequiredOnly),
    }));
}

export function getEndpointConfig(endpoint: Endpoint) {
  const params = endpoint.parameters
    .filter((param) => param.type === "Query")
    .map((param) => {
      const paramPropertyName = isValidPropertyName(param.name) ? param.name : `"${param.name}"`;
      const paramVariableName = invalidVariableNameCharactersToCamel(param.name);
      return {
        ...param,
        name: paramPropertyName,
        value: paramVariableName,
      };
    });

  const headers: Record<string, string> = {};
  if (endpoint.requestFormat !== DEFAULT_HEADERS["Content-Type"]) {
    headers["Content-Type"] = `'${endpoint.requestFormat}'`;
  }
  if (endpoint.responseFormat && endpoint.responseFormat !== DEFAULT_HEADERS.Accept) {
    headers.Accept = `'${endpoint.responseFormat}'`;
  }
  endpoint.parameters
    .filter((param) => param.type === "Header")
    .forEach((param) => {
      headers[param.name] = invalidVariableNameCharactersToCamel(param.name);
    });

  const endpointConfig = {
    ...(params.length > 0 ? { params } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
  };
  return endpointConfig;
}

export function getUpdateQueryEndpoints(endpoint: Endpoint, endpoints: Endpoint[]) {
  return endpoints.filter(
    (e) =>
      isQuery(e) &&
      e.parameters
        .filter((param) => param.parameterObject?.required)
        .every((pathParam) => endpoint.parameters.some((param) => param.name === pathParam.name)) &&
      e.response === endpoint.response,
  );
}
