import { APP_REST_CLIENT_NAME } from "../const/deps.const";
import { AXIOS_IMPORT, AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "../const/endpoints.const";
import { ZOD_IMPORT } from "../const/zod.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import { getAppRestClientImportPath, getNamespaceName } from "../utils/generate/generate.utils";
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

  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;

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
    hasAxiosImport: hasAxiosRequestConfig,
    axiosImport: AXIOS_IMPORT,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Endpoints, tag, options: resolver.options }),
    restClientName: APP_REST_CLIENT_NAME,
    hasAxiosRequestConfig,
    axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
    axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
    endpoints,
  });
}
