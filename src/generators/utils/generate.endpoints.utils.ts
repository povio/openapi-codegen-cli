import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_HEADERS } from "../const/endpoints.const";
import { Endpoint } from "../types/endpoint";
import { GenerateData } from "../types/generate";
import { getZodSchemaInferedTypeName } from "./generate.zod.utils";
import { isSchemaObject } from "./openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "./openapi.utils";
import { decapitalize, snakeToCamel } from "./string.utils";
import { isNamedZodSchema } from "./zod-schema.utils";

export const getEndpointName = (endpoint: Endpoint) => decapitalize(snakeToCamel(endpoint.operationName));

export const getEndpointPath = (endpoint: Endpoint) => endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}");

export function mapEndpointParamsToFnParams(
  endpoint: Endpoint,
  schemaSuffix: string,
): { name: string; type: string; required: boolean }[] {
  return endpoint.parameters
    .map((param) => {
      let type = "string";
      if (isNamedZodSchema(param.schema)) {
        type = getZodSchemaInferedTypeName(param.schema, schemaSuffix);
      } else if (param.parameterObject?.schema && isSchemaObject(param.parameterObject.schema)) {
        const openApiSchemaType = (param.parameterObject?.schema as OpenAPIV3.SchemaObject)?.type;
        if (openApiSchemaType && isPrimitiveType(openApiSchemaType)) {
          type = primitiveTypeToTsType(openApiSchemaType);
        }
      }

      return {
        name: param.name,
        type,
        required: param.parameterObject?.required ?? true,
      };
    })
    .sort((a, b) => (a.required === b.required ? 0 : a.required ? -1 : 1));
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

export function getEndpointTag({ data, endpoint }: { data: GenerateData; endpoint: Endpoint }) {
  for (const [tag, { endpoints }] of data) {
    if (endpoints.find((e) => e.operationName === endpoint.operationName)) {
      return tag;
    }
  }
  return "";
}
