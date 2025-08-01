import { APP_REST_CLIENT_NAME, ZOD_UTILS } from "src/generators/const/deps.const";
import {
  AXIOS_IMPORT,
  AXIOS_REQUEST_CONFIG_NAME,
  AXIOS_REQUEST_CONFIG_TYPE,
} from "src/generators/const/endpoints.const";
import { ZOD_IMPORT } from "src/generators/const/zod.const";
import { EndpointParameter } from "src/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "src/generators/types/generate";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getModelsImports } from "src/generators/utils/generate/generate.imports.utils";
import {
  getAppRestClientImportPath,
  getNamespaceName,
  getZodUtilsImportPath,
} from "src/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { isNamedZodSchema } from "src/generators/utils/zod-schema.utils";

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
  const hasAxiosImport = hasAxiosRequestConfig;
  const axiosImport: Import = {
    bindings: hasAxiosRequestConfig ? [AXIOS_REQUEST_CONFIG_TYPE] : [],
    from: AXIOS_IMPORT.from,
  };

  const generateParse = resolver.options.parseRequestParams;

  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const endpointParamsParseSchemas = endpointParams
    .filter((param) => !["Path", "Header"].includes(param.type))
    .map((param) => param.parameterSortingEnumSchemaName ?? param.zodSchema);
  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const zodSchemas = getUniqueArray([...endpointResponseSchemas, ...(generateParse ? endpointParamsParseSchemas : [])]);

  const hasZodImport = zodSchemas.some((schema) => !isNamedZodSchema(schema));

  const hasZodUtilsImport = resolver.options.parseRequestParams && endpointParamsParseSchemas.length > 0;
  const zodUtilsImport: Import = {
    bindings: [ZOD_UTILS.namespace],
    from: getZodUtilsImportPath(resolver.options),
  };

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: zodSchemas.filter(isNamedZodSchema),
    zodSchemasAsTypes: getUniqueArray(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema)),
  });

  const hbsTemplate = getHbsTemplateDelegate(resolver, "endpoints");

  return hbsTemplate({
    appRestClientImport,
    hasAxiosImport,
    axiosImport,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    hasZodUtilsImport,
    zodUtilsImport,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Endpoints, tag, options: resolver.options }),
    restClientName: APP_REST_CLIENT_NAME,
    hasAxiosRequestConfig,
    axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
    axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
    endpoints,
    generateParse,
  });
}
