import Handlebars from "handlebars";
import { REST_CLIENT_IMPORT_FROM, REST_CLIENT_NAME } from "../const/endpoints.const";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import {
  setEndpointBodyHelper,
  setEndpointNameHelper,
  setEndpointPathHelper,
  setGenerateEndpointConfigHelper,
  setGenerateEndpointParamsHelper,
} from "../utils/handlebars.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateEndpoints({ endpoints, options }: { endpoints: Endpoint[]; options: GenerateOptions }) {
  const template = readHbsTemplateSync("endpoints");

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
  setGenerateEndpointParamsHelper(options);
  setEndpointPathHelper();
  setEndpointBodyHelper();
  setGenerateEndpointConfigHelper();

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({
    restClientName: REST_CLIENT_NAME,
    restClientImportFrom: REST_CLIENT_IMPORT_FROM,
    zodSchemaImports,
    zodSchemaTypeImports,
    hasZodImport,
    endpoints,
  });
}
