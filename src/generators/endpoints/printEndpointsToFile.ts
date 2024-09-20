import fs from "fs";
import Handlebars from "handlebars";
import { OpenAPIV3 } from "openapi-types";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { isSchemaObject } from "../utils/openapi-schema.utils";
import { isPrimitiveType, primitiveTypeToTsType } from "../utils/openapi.utils";
import { decapitalize, snakeToCamel } from "../utils/string.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "../utils/zod-schema.utils";

export function printEndpointsToFile({
  endpoints,
  output,
  options,
}: {
  endpoints: Endpoint[];
  output: string;
  options: GenerateOptions;
}) {
  const template = fs.readFileSync("src/generators/templates/endpoints.hbs", "utf-8");

  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const zodSchemaImports = [...new Set(endpointResponseSchemas.filter(isNamedZodSchema))];
  const hasZodImport = endpointResponseSchemas.some((response) => !isNamedZodSchema(response));
  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const zodSchemaTypeImports = [
    ...new Set(
      endpointParams
        .map((param) => param.schema)
        .filter(isNamedZodSchema)
        .map((name) => getZodSchemaInferedTypeName(name, options.schemaSuffix)),
    ),
  ];

  setEndpointNameHelper();
  setEndpointParamsHelper(options.schemaSuffix);
  setEndpointPathHelper();
  setEndpointBodyHelper();
  setEndpointConfigHelper();
  const hbsTemplate = Handlebars.compile(template);

  fs.writeFileSync(
    `${output}/endpoints.ts`,
    hbsTemplate({ zodSchemaImports, zodSchemaTypeImports, hasZodImport, endpoints }),
  );
}

function setEndpointNameHelper() {
  Handlebars.registerHelper("getEndpointName", (alias: string) => decapitalize(snakeToCamel(alias)));
}

function setEndpointParamsHelper(schemaSuffix: string) {
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

function setEndpointPathHelper() {
  Handlebars.registerHelper("getEndpointPath", (path: string) => path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}"));
}

function setEndpointBodyHelper() {
  Handlebars.registerHelper("getEndpointBody", (endpointParams: EndpointParameter[]) =>
    endpointParams.find((params) => params.type === "Body"),
  );
}

function setEndpointConfigHelper() {
  Handlebars.registerHelper("getEndpointConfig", (endpoint: Endpoint) => {
    const params = endpoint.parameters.filter((param) => param.type === "Query");
    const headers = {
      "Content-Type": endpoint.requestFormat,
      ...(endpoint.responseFormat ? { Accept: endpoint.responseFormat } : {}),
    };
    return { params, headers };
  });
}
