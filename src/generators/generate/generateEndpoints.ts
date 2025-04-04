import { APP_REST_CLIENT_NAME } from "../const/deps.const";
import { ZOD_IMPORT } from "../const/zod.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getAppRestClientImportPath } from "../utils/generate/generate.utils";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateEndpoints({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const appRestClientImport: Import = {
    bindings: [APP_REST_CLIENT_NAME],
    from: getAppRestClientImportPath(resolver.options),
  };

  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const hasZodImport = endpointResponseSchemas.some((response) => !isNamedZodSchema(response));

  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: getUniqueArray(endpointResponseSchemas.filter(isNamedZodSchema)),
    zodSchemasAsTypes: getUniqueArray(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema)),
  });

  const hbsTemplate = getHbsTemplateDelegate(resolver, "endpoints");

  return hbsTemplate({
    appRestClientImport,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Endpoints, tag, options: resolver.options }),
    restClientName: APP_REST_CLIENT_NAME,
    endpoints,
  });
}
