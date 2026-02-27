import { APP_REST_CLIENT_NAME, ZOD_EXTENDED } from "@/generators/const/deps.const";
import { AXIOS_IMPORT, AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "@/generators/const/endpoints.const";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { Endpoint, EndpointParameter } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getUniqueArray } from "@/generators/utils/array.utils";
import { getModelsImports } from "@/generators/utils/generate/generate.imports.utils";
import {
  getEndpointBody,
  getEndpointConfig,
  getEndpointName,
  getEndpointPath,
  hasEndpointConfig,
  mapEndpointParamsToFunctionParams,
  requiresBody,
} from "@/generators/utils/generate/generate.endpoints.utils";
import { getAppRestClientImportPath, getZodExtendedImportPath } from "@/generators/utils/generate/generate.utils";
import { shouldInlineEndpointsForTag } from "@/generators/utils/tag.utils";
import { getImportedZodSchemaName } from "@/generators/utils/generate/generate.zod.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

export function generateEndpoints({ resolver, data, tag }: GenerateTypeParams) {
  if (shouldInlineEndpointsForTag(tag, resolver.options)) {
    return;
  }

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

  const endpointParams = endpoints.flatMap((endpoint) => endpoint.parameters) as EndpointParameter[];
  const endpointParamsParseSchemas = endpointParams
    .filter((param) => !["Path", "Header"].includes(param.type))
    .map((param) => param.parameterSortingEnumSchemaName ?? param.zodSchema);
  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const zodSchemas = getUniqueArray([...endpointResponseSchemas, ...(generateParse ? endpointParamsParseSchemas : [])]);

  const hasZodImport = zodSchemas.some((schema) => !isNamedZodSchema(schema));

  const hasZodExtendedImport = resolver.options.parseRequestParams && endpointParamsParseSchemas.length > 0;
  const zodExtendedImport: Import = {
    bindings: [ZOD_EXTENDED.namespace],
    from: getZodExtendedImportPath(resolver.options),
  };

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: zodSchemas.filter(isNamedZodSchema),
    zodSchemasAsTypes: getUniqueArray(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema)),
  });

  const lines: string[] = [];
  lines.push(renderImport(appRestClientImport));
  if (hasAxiosImport) {
    lines.push(renderImport(axiosImport));
  }
  if (hasZodImport) {
    lines.push(renderImport(ZOD_IMPORT));
  }
  if (hasZodExtendedImport) {
    lines.push(renderImport(zodExtendedImport));
  }
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  lines.push("");

  if (resolver.options.tsNamespaces) {
    lines.push(
      `export namespace ${getNamespaceName({ type: GenerateType.Endpoints, tag, options: resolver.options })} {`,
    );
  }

  for (const endpoint of endpoints) {
    const endpointParamOptions = { modelNamespaceTag: tag };
    const endpointParams = renderEndpointParams(resolver, endpoint, endpointParamOptions);
    const endpointArgs = renderEndpointArgs(resolver, endpoint, endpointParamOptions);
    const endpointBody = getEndpointBody(endpoint);
    const hasUndefinedEndpointBody = requiresBody(endpoint) && !endpointBody && hasEndpointConfig(endpoint, resolver);
    const endpointConfig = renderEndpointConfig(resolver, endpoint, tag);

    lines.push(
      `export const ${getEndpointName(endpoint)} = (${endpointParams}${hasAxiosRequestConfig ? `${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
    );
    lines.push(`    return ${APP_REST_CLIENT_NAME}.${endpoint.method}(`);
    lines.push(`        { resSchema: ${getImportedZodSchemaName(resolver, endpoint.response, tag)} },`);
    lines.push(`        \`${getEndpointPath(endpoint)}\`,`);

    if (endpointBody) {
      lines.push(
        `        ${generateParse ? renderEndpointParamParse(resolver, endpointBody, endpointBody.name, tag) : endpointBody.name},`,
      );
    } else if (hasUndefinedEndpointBody) {
      lines.push("        undefined,");
    }

    lines.push(`        ${endpointConfig}`);
    lines.push("    )");
    lines.push("};");
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderImport(importData: Import) {
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
}

function renderEndpointParams(
  resolver: GenerateTypeParams["resolver"],
  endpoint: Parameters<typeof mapEndpointParamsToFunctionParams>[1],
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
) {
  return mapEndpointParamsToFunctionParams(resolver, endpoint, options)
    .map((param) => `${param.name}${param.required ? "" : "?"}: ${param.type}, `)
    .join("");
}

function renderEndpointArgs(
  resolver: GenerateTypeParams["resolver"],
  endpoint: Parameters<typeof mapEndpointParamsToFunctionParams>[1],
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
) {
  return mapEndpointParamsToFunctionParams(resolver, endpoint, options)
    .map((param) => param.name)
    .join(", ");
}

function renderEndpointParamParse(
  resolver: GenerateTypeParams["resolver"],
  param: EndpointParameter,
  paramName: string,
  modelNamespaceTag?: string,
) {
  const addOptional =
    !(param.parameterObject ?? param.bodyObject)?.required &&
    (Boolean(param.parameterSortingEnumSchemaName) || isNamedZodSchema(param.zodSchema));
  const schemaValue = param.parameterSortingEnumSchemaName
    ? `${ZOD_EXTENDED.namespace}.${ZOD_EXTENDED.exports.sortExp}(${getImportedZodSchemaName(
        resolver,
        param.parameterSortingEnumSchemaName,
        modelNamespaceTag,
      )})${addOptional ? ".optional()" : ""}`
    : `${getImportedZodSchemaName(resolver, param.zodSchema, modelNamespaceTag)}${addOptional ? ".optional()" : ""}`;
  const queryArgs = param.type === "Query" ? `, { type: "query", name: "${paramName}" }` : "";
  return `${ZOD_EXTENDED.namespace}.${ZOD_EXTENDED.exports.parse}(${schemaValue}, ${paramName}${queryArgs})`;
}

function renderEndpointConfig(
  resolver: GenerateTypeParams["resolver"],
  endpoint: Endpoint,
  modelNamespaceTag?: string,
) {
  const endpointConfig = getEndpointConfig(endpoint);
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  if (Object.keys(endpointConfig).length === 0) {
    return hasAxiosRequestConfig ? AXIOS_REQUEST_CONFIG_NAME : "";
  }

  const lines: string[] = [];
  lines.push("{");
  if (hasAxiosRequestConfig) {
    lines.push(`    ...${AXIOS_REQUEST_CONFIG_NAME},`);
  }
  if (endpointConfig.params) {
    lines.push("    params: {");
    for (const param of endpointConfig.params) {
      const value = resolver.options.parseRequestParams
        ? renderEndpointParamParse(resolver, param, param.value, modelNamespaceTag)
        : param.value;
      lines.push(`        ${param.name}: ${value},`);
    }
    lines.push("    },");
  }
  if (endpointConfig.headers) {
    lines.push("    headers: {");
    for (const [key, value] of Object.entries(endpointConfig.headers)) {
      lines.push(`        '${key}': ${value},`);
    }
    lines.push("    },");
  }
  if (endpoint.response === "z.instanceof(Blob)") {
    lines.push('    responseType: "blob",');
  }
  if (endpoint.mediaDownload) {
    lines.push("    rawResponse: true,");
  }
  lines.push("}");
  return lines.join("\n        ");
}
