import { REST_CLIENT_NAME } from "../const/endpoints.const";
import { REST_CLIENT_IMPORT, ZOD_IMPORT } from "../const/imports.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateData } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getModelsImports } from "../utils/generate.imports.utils";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateEndpoints({
  data,
  tag = "",
  options,
}: {
  data: GenerateData;
  tag?: string;
  options: GenerateOptions;
}) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const hasZodImport = endpointResponseSchemas.some((response) => !isNamedZodSchema(response));

  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const modelsImports = getModelsImports({
    data,
    tag,
    zodSchemas: Array.from(new Set(endpointResponseSchemas.filter(isNamedZodSchema))),
    zodSchemasAsTypes: Array.from(new Set(endpointParams.map((param) => param.schema).filter(isNamedZodSchema))),
    options,
  });

  const hbsTemplate = getHbsTemplateDelegate({ templateName: "endpoints", options });

  return hbsTemplate({
    restClientImport: REST_CLIENT_IMPORT,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    modelsImports,
    restClientName: REST_CLIENT_NAME,
    endpoints,
  });
}
