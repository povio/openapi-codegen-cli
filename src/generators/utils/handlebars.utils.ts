import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { decapitalize, snakeToCamel } from "./string.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "./zod/zod-schema.utils";

export const setZodSchemaInferedTypeNameHelper = (schemaSuffix: string) => {
  Handlebars.registerHelper("getZodSchemaInferedTypeName", (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, schemaSuffix),
  );
};

export const setEndpointNameHelper = () => {
  Handlebars.registerHelper("getEndpointName", (alias: string) => decapitalize(snakeToCamel(alias)));
};

export const setEndpointParamsHelper = (schemaSuffix: string) => {
  Handlebars.registerHelper("getEndpointParams", (endpointParams: EndpointParameter[]) =>
    endpointParams.map((param) => ({
      name: param.name,
      type: isNamedZodSchema(param.schema)
        ? getZodSchemaInferedTypeName(param.schema, schemaSuffix)
        : (param.openApiObject?.schema as OpenAPIV3.SchemaObject)?.type ?? "string",
      required: param.openApiObject?.required ?? true,
    })),
  );
};

export const setEndpointPathHelper = () => {
  Handlebars.registerHelper("getEndpointPath", (path: string) => path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}"));
};

export const setEndpointBodyHelper = () => {
  Handlebars.registerHelper("getEndpointBody", (endpointParams: EndpointParameter[]) =>
    endpointParams.find((params) => params.type === "Body"),
  );
};

export const setEndpointConfigHelper = () => {
  Handlebars.registerHelper("getEndpointConfig", (endpoint: Endpoint) => {
    const params = endpoint.parameters.filter((param) => param.type === "Query");
    const headers = {
      "Content-Type": endpoint.requestFormat,
      ...(endpoint.responseFormat ? { Accept: endpoint.responseFormat } : {}),
    };
    return { params, headers };
  });
};
