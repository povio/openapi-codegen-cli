import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { isSchemaObject } from "./openapi/openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "./openapi/openapi.utils";
import { decapitalize, snakeToCamel } from "./string.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "./zod/zod-schema.utils";

export function setZodSchemaInferedTypeNameHelper(schemaSuffix: string) {
  Handlebars.registerHelper("getZodSchemaInferedTypeName", (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, schemaSuffix),
  );
}

export function setEndpointNameHelper() {
  Handlebars.registerHelper("getEndpointName", (alias: string) => decapitalize(snakeToCamel(alias)));
}

export function setEndpointParamsHelper(schemaSuffix: string) {
  Handlebars.registerHelper("getEndpointParams", (endpointParams: EndpointParameter[]) =>
    endpointParams
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
      .sort((a, b) => (a.required === b.required ? 0 : a.required ? -1 : 1)),
  );
}

export function setEndpointPathHelper() {
  Handlebars.registerHelper("getEndpointPath", (path: string) => path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}"));
}

export function setEndpointBodyHelper() {
  Handlebars.registerHelper("getEndpointBody", (endpointParams: EndpointParameter[]) =>
    endpointParams.find((params) => params.type === "Body"),
  );
}

export function setEndpointConfigHelper() {
  Handlebars.registerHelper("getEndpointConfig", (endpoint: Endpoint) => {
    const params = endpoint.parameters.filter((param) => param.type === "Query");
    const headers = {
      "Content-Type": endpoint.requestFormat,
      ...(endpoint.responseFormat ? { Accept: endpoint.responseFormat } : {}),
    };
    return { params, headers };
  });
}
