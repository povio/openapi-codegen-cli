import { REST_CLIENT_IMPORT, REST_CLIENT_NAME } from "../const/template.const";
import { ZOD_IMPORT } from "../const/zod.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { EndpointParameter } from "../types/endpoint";
import { GenerateData, GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateEndpoints({
  resolver,
  data,
  tag = "",
  options,
}: {
  resolver: SchemaResolver;
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
    resolver,
    tag,
    zodSchemas: Array.from(new Set(endpointResponseSchemas.filter(isNamedZodSchema))),
    zodSchemasAsTypes: Array.from(new Set(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema))),
    options,
  });

  const hbsTemplate = getHbsTemplateDelegate({ resolver, templateName: "endpoints", options });

  return hbsTemplate({
    restClientImport: REST_CLIENT_IMPORT,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: options.includeNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Endpoints, tag, options }),
    restClientName: REST_CLIENT_NAME,
    endpoints,
  });
}
