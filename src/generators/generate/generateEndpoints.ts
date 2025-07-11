import { APP_REST_CLIENT_NAME, ZOD_EXTENDED } from "../const/deps.const";
import { AXIOS_IMPORT, AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "../const/endpoints.const";
import { ZOD_IMPORT } from "../const/zod.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import {
  getAppRestClientImportPath,
  getNamespaceName,
  getZodExtendedImportPath,
} from "../utils/generate/generate.utils";
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

  const hasZodExtendedImport = resolver.options.parseRequestParams && endpointParamsParseSchemas.length > 0;
  const zodExtendedImport: Import = {
    bindings: [ZOD_EXTENDED.name],
    from: getZodExtendedImportPath(resolver.options),
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
    hasZodExtendedImport,
    zodExtendedImport,
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
