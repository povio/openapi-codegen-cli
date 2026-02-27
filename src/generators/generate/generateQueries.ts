import { ACL_CHECK_HOOK } from "@/generators/const/acl.const";
import {
  APP_REST_CLIENT_NAME,
  MUTATION_EFFECTS,
  QUERY_MODULE_ENUM,
  QUERY_OPTIONS_TYPES,
  ZOD_EXTENDED,
} from "@/generators/const/deps.const";
import {
  AXIOS_DEFAULT_IMPORT_NAME,
  AXIOS_IMPORT,
  AXIOS_REQUEST_CONFIG_NAME,
  AXIOS_REQUEST_CONFIG_TYPE,
} from "@/generators/const/endpoints.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { QUERIES_MODULE_NAME, QUERY_HOOKS, QUERY_IMPORT } from "@/generators/const/queries.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint, EndpointParameter } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getUniqueArray } from "@/generators/utils/array.utils";
import {
  getAbilityConditionsTypes,
  getAbilityFunctionName,
  getImportedAbilityFunctionName,
  hasAbilityConditions,
} from "@/generators/utils/generate/generate.acl.utils";
import {
  getEndpointBody,
  getEndpointConfig,
  getEndpointName,
  getEndpointPath,
  hasEndpointConfig,
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
  requiresBody,
} from "@/generators/utils/generate/generate.endpoints.utils";
import { getSchemaDescriptions } from "@/generators/utils/generate/generate.openapi.utils";
import {
  getAclImports,
  getEndpointsImports,
  getModelsImports,
} from "@/generators/utils/generate/generate.imports.utils";
import { getInfiniteQueryName, getQueryName } from "@/generators/utils/generate/generate.query.utils";
import {
  getAppRestClientImportPath,
  getAclCheckImportPath,
  getMutationEffectsImportPath,
  getQueryModulesImportPath,
  getQueryTypesImportPath,
  getZodExtendedImportPath,
} from "@/generators/utils/generate/generate.utils";
import {
  getImportedZodSchemaInferedTypeName,
  getImportedZodSchemaName,
} from "@/generators/utils/generate/generate.zod.utils";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isSchemaObject } from "@/generators/utils/openapi-schema.utils";
import { isParamMediaTypeAllowed } from "@/generators/utils/openapi.utils";
import { getDestructuredVariables, isInfiniteQuery, isMutation, isQuery } from "@/generators/utils/query.utils";
import { shouldInlineEndpointsForTag } from "@/generators/utils/tag.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";
import { invalidVariableNameCharactersToCamel } from "@/generators/utils/js.utils";

const endpointParamMappingCache = new WeakMap<
  SchemaResolver,
  WeakMap<Endpoint, Map<string, ReturnType<typeof mapEndpointParamsToFunctionParams>>>
>();

export function generateQueries(params: GenerateTypeParams) {
  const { resolver, data, tag } = params;
  const inlineEndpoints = shouldInlineEndpointsForTag(tag, resolver.options);
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }
  const endpointGroups = groupEndpoints(endpoints, resolver);

  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasAxiosDefaultImport = endpoints.some(({ mediaUpload }) => mediaUpload);
  const hasAxiosImport = hasAxiosRequestConfig || hasAxiosDefaultImport;
  const axiosImport: Import = {
    defaultImport: hasAxiosDefaultImport ? AXIOS_DEFAULT_IMPORT_NAME : undefined,
    bindings: hasAxiosRequestConfig ? [AXIOS_REQUEST_CONFIG_TYPE] : [],
    from: AXIOS_IMPORT.from,
  };

  const { queryEndpoints, infiniteQueryEndpoints, mutationEndpoints, aclEndpoints } = endpointGroups;

  const queryImport: Import = {
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(resolver.options.infiniteQueries && infiniteQueryEndpoints.length > 0 ? [QUERY_HOOKS.infiniteQuery] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation] : []),
    ],
    from: QUERY_IMPORT.from,
  };

  const hasMutationEffects = resolver.options.mutationEffects;
  const queryModulesImport: Import = {
    bindings: [QUERY_MODULE_ENUM],
    from: getQueryModulesImportPath(resolver.options),
  };

  const hasMutationEffectsImport = hasMutationEffects && mutationEndpoints.length > 0;
  const mutationEffectsImport: Import = {
    bindings: [...(mutationEndpoints.length > 0 ? [MUTATION_EFFECTS.optionsType, MUTATION_EFFECTS.hookName] : [])],
    from: getMutationEffectsImportPath(resolver.options),
  };

  const hasAclCheck = resolver.options.checkAcl && aclEndpoints.length > 0;
  const aclCheckImport: Import = {
    bindings: [ACL_CHECK_HOOK],
    from: getAclCheckImportPath(resolver.options),
  };

  const queryTypesImport: Import = {
    bindings: [
      "OpenApiQueryConfig",
      ...(queryEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.query] : []),
      ...(resolver.options.infiniteQueries && infiniteQueryEndpoints.length > 0
        ? [QUERY_OPTIONS_TYPES.infiniteQuery]
        : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.mutation] : []),
    ],
    from: getQueryTypesImportPath(resolver.options),
  };

  const hasWorkspaceContext =
    resolver.options.workspaceContext &&
    endpoints.some((endpoint) => getWorkspaceParamNames(resolver, endpoint).length > 0);
  const workspaceContextImport: Import = {
    bindings: ["OpenApiWorkspaceContext"],
    from: PACKAGE_IMPORT_PATH,
  };

  const endpointParams = endpoints.flatMap((endpoint) => endpoint.parameters) as EndpointParameter[];
  const endpointParamsParseSchemas = endpointParams
    .filter((param) => !["Path", "Header"].includes(param.type))
    .map((param) => param.parameterSortingEnumSchemaName ?? param.zodSchema);
  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const endpointRuntimeSchemas = getUniqueArray([
    ...endpointResponseSchemas,
    ...(resolver.options.parseRequestParams ? endpointParamsParseSchemas : []),
  ]);
  const hasZodImport = inlineEndpoints && endpointRuntimeSchemas.some((schema) => !isNamedZodSchema(schema));
  const hasZodExtendedImport =
    inlineEndpoints && resolver.options.parseRequestParams && endpointParamsParseSchemas.length > 0;
  const appRestClientImport: Import = {
    bindings: [APP_REST_CLIENT_NAME],
    from: getAppRestClientImportPath(resolver.options),
  };
  const zodExtendedImport: Import = {
    bindings: [ZOD_EXTENDED.namespace],
    from: getZodExtendedImportPath(resolver.options),
  };

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: inlineEndpoints ? endpointRuntimeSchemas.filter(isNamedZodSchema) : [],
    zodSchemasAsTypes: getUniqueArray(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema)),
  });

  const endpointsImports = inlineEndpoints
    ? []
    : getEndpointsImports({
        tag,
        endpoints,
        options: resolver.options,
      });

  const aclImports = getAclImports({
    tag,
    endpoints: aclEndpoints,
    options: resolver.options,
  });

  const namespace = getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options });
  const lines: string[] = [];

  if (hasAxiosImport) {
    lines.push(renderImport(axiosImport));
  }
  if (inlineEndpoints) {
    lines.push(renderImport(appRestClientImport));
    if (hasZodImport) {
      lines.push(renderImport(ZOD_IMPORT));
    }
    if (hasZodExtendedImport) {
      lines.push(renderImport(zodExtendedImport));
    }
  }
  lines.push(renderImport(queryImport));
  if (hasMutationEffects) {
    lines.push(renderImport(queryModulesImport));
  }
  if (hasMutationEffectsImport) {
    lines.push(renderImport(mutationEffectsImport));
  }
  if (hasAclCheck) {
    lines.push(renderImport(aclCheckImport));
    for (const aclImport of aclImports) {
      lines.push(renderImport(aclImport));
    }
  }
  lines.push(renderImport(queryTypesImport));
  if (hasWorkspaceContext) {
    lines.push(renderImport(workspaceContextImport));
  }
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  for (const endpointsImport of endpointsImports) {
    lines.push(renderImport(endpointsImport));
  }
  lines.push("");

  if (resolver.options.tsNamespaces) {
    lines.push(`export namespace ${namespace} {`);
  }

  if (inlineEndpoints) {
    lines.push(...renderInlineEndpoints({ resolver, endpoints, tag }));
    lines.push("");
  }

  lines.push(
    `export const ${QUERIES_MODULE_NAME} = ${hasMutationEffects ? `${QUERY_MODULE_ENUM}.${tag}` : `"${namespace}"`};`,
  );
  lines.push("");

  lines.push(renderQueryKeys({ resolver, queryEndpoints }));
  lines.push("");

  for (const endpoint of endpoints) {
    const endpointInfo = endpointGroups.infoByEndpoint.get(endpoint);
    if (endpointInfo?.query) {
      lines.push(renderQuery({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
    }
    if (endpointInfo?.mutation) {
      lines.push(
        renderMutation({
          resolver,
          endpoint,
          inlineEndpoints,
          precomputed: endpointGroups.mutationDataByEndpoint.get(endpoint),
        }),
      );
      lines.push("");
    }
    if (endpointInfo?.infiniteQuery) {
      lines.push(renderInfiniteQuery({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
    }
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function getEndpointParamMapping(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
) {
  let resolverCache = endpointParamMappingCache.get(resolver);
  if (!resolverCache) {
    resolverCache = new WeakMap();
    endpointParamMappingCache.set(resolver, resolverCache);
  }

  let endpointCache = resolverCache.get(endpoint);
  if (!endpointCache) {
    endpointCache = new Map();
    resolverCache.set(endpoint, endpointCache);
  }

  const key = JSON.stringify(
    Object.entries(options ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([optionName, optionValue]) => [optionName, Boolean(optionValue)]),
  );
  const cached = endpointCache.get(key);
  if (cached) {
    return cached;
  }

  const computed = mapEndpointParamsToFunctionParams(resolver, endpoint, options);
  endpointCache.set(key, computed);
  return computed;
}

function renderImport(importData: Import) {
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
}

function renderEndpointParams(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
) {
  return getEndpointParamMapping(resolver, endpoint, options)
    .map((param) => `${param.name}${param.required ? "" : "?"}: ${param.type}`)
    .join(", ");
}

function renderEndpointArgs(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
  replacements?: Record<string, string>,
) {
  return getEndpointParamMapping(resolver, endpoint, options)
    .map((param) => replacements?.[param.name] ?? param.name)
    .join(", ");
}

function renderEndpointParamDescription(endpointParam: ReturnType<typeof mapEndpointParamsToFunctionParams>[0]) {
  const strs = [`${endpointParam.paramType} parameter`];
  const description = endpointParam.parameterObject?.description || endpointParam.bodyObject?.description;
  if (description) {
    strs.push(description);
  }

  let schema: any = undefined;
  let mediaTypeObject: any = undefined;
  if (endpointParam.parameterObject?.schema && isSchemaObject(endpointParam.parameterObject.schema)) {
    schema = endpointParam.parameterObject?.schema;
  }
  if (endpointParam.bodyObject?.content) {
    const mediaTypes = Object.keys(endpointParam.bodyObject.content ?? {});
    const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
    if (matchingMediaType) {
      mediaTypeObject = endpointParam.bodyObject.content[matchingMediaType];
      if (mediaTypeObject.schema && isSchemaObject(mediaTypeObject.schema)) {
        schema = mediaTypeObject.schema;
      }
    }
  }

  if (schema) {
    strs.push(...getSchemaDescriptions(schema));
  }
  if (mediaTypeObject?.example) {
    strs.push(`Example: \`${mediaTypeObject.example}\``);
  }
  return strs.join(". ");
}

function getWorkspaceParamNames(resolver: SchemaResolver, endpoint: Endpoint) {
  const endpointParams = getEndpointParamMapping(resolver, endpoint, {});
  const endpointParamNames = new Set(endpointParams.map((param) => param.name));
  const workspaceParamNames = endpointParams.filter((param) => param.paramType === "Path").map((param) => param.name);

  const aclParamNames = (getAbilityConditionsTypes(endpoint) ?? [])
    .map((condition) => invalidVariableNameCharactersToCamel(condition.name))
    .filter((name) => endpointParamNames.has(name));

  return getUniqueArray([...workspaceParamNames, ...aclParamNames]);
}

function getWorkspaceParamReplacements(resolver: SchemaResolver, endpoint: Endpoint) {
  return Object.fromEntries(
    getWorkspaceParamNames(resolver, endpoint).map((name) => [name, `${name}FromWorkspace`]),
  ) as Record<string, string>;
}

function renderWorkspaceParamResolutions({
  replacements,
  indent,
}: {
  replacements: Record<string, string>;
  indent: string;
}) {
  const workspaceParamNames = Object.keys(replacements);
  if (workspaceParamNames.length === 0) {
    return [];
  }

  const lines = [`${indent}const workspaceContext = OpenApiWorkspaceContext.useContext();`];
  for (const paramName of workspaceParamNames) {
    lines.push(
      `${indent}const ${replacements[paramName]} = OpenApiWorkspaceContext.resolveParam(workspaceContext, "${paramName}", ${paramName});`,
    );
  }
  return lines;
}

function renderAclCheckCall(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  replacements?: Record<string, string>,
  indent = "",
) {
  const checkParams = getAbilityConditionsTypes(endpoint)?.map((condition) =>
    invalidVariableNameCharactersToCamel(condition.name),
  );
  const paramNames = new Set(endpoint.parameters.map((param) => invalidVariableNameCharactersToCamel(param.name)));
  const hasAllCheckParams = checkParams?.every((param) => paramNames.has(param));
  const args =
    hasAbilityConditions(endpoint) && hasAllCheckParams
      ? `{ ${(checkParams ?? [])
          .map((param) => {
            const resolvedParam = replacements?.[param] ?? param;
            return resolvedParam === param ? param : `${param}: ${resolvedParam}`;
          })
          .join(", ")} } `
      : "";
  return `${indent}checkAcl(${getImportedAbilityFunctionName(endpoint, resolver.options)}(${args}));`;
}

function addAsteriskAfterNewLine(str: string) {
  return str.replace(/\n/g, "\n *");
}

function renderQueryJsDocs({
  resolver,
  endpoint,
  mode,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  mode: "query" | "mutation" | "infiniteQuery";
}) {
  // TODO(perf-migration): parity mismatch vs legacy HBS around infinite-query JSDoc param lines
  // for some endpoints; keep experimental renderer opt-in until this is resolved.
  const lines: string[] = ["/** "];

  if (mode === "infiniteQuery") {
    lines.push(` * Infinite query \`${getInfiniteQueryName(endpoint)}${endpoint.summary ? "" : ""}`);
  } else if (mode === "query") {
    lines.push(
      ` * Query \`${getQueryName(endpoint)}\`${endpoint.summary && endpoint.mediaDownload ? " - recommended when file should be cached" : ""}`,
    );
  } else {
    lines.push(
      ` * Mutation \`${getQueryName(endpoint, true)}\`${endpoint.summary && endpoint.mediaDownload ? " - recommended when file should not be cached" : ""}`,
    );
  }

  if (endpoint.summary) {
    lines.push(` * @summary ${addAsteriskAfterNewLine(endpoint.summary)}`);
  }
  if (endpoint.description) {
    lines.push(` * @description ${addAsteriskAfterNewLine(endpoint.description)}`);
  }
  if (endpoint.acl) {
    lines.push(` * @permission Requires \`${getAbilityFunctionName(endpoint)}\` ability `);
  }

  const params = getEndpointParamMapping(resolver, endpoint, {
    ...(mode !== "infiniteQuery" ? { includeFileParam: true } : {}),
  });
  for (const endpointParam of params) {
    const source = mode === "mutation" ? "mutation" : "object";
    lines.push(
      ` * @param { ${endpointParam.type} } ${source}.${endpointParam.name} ${renderEndpointParamDescription(endpointParam)}`,
    );
  }

  if (mode === "query") {
    lines.push(" * @param { AppQueryOptions } options Query options");
  } else if (mode === "mutation") {
    lines.push(
      ` * @param { AppMutationOptions${resolver.options.mutationEffects ? ` & ${MUTATION_EFFECTS.optionsType}` : ""} } options Mutation options`,
    );
  } else {
    lines.push(" * @param { AppInfiniteQueryOptions } options Infinite query options");
  }

  const withAxiosResponse = endpoint.mediaDownload && mode !== "infiniteQuery";
  const resultType = `${withAxiosResponse ? "AxiosResponse<" : ""}${getImportedZodSchemaInferedTypeName(
    resolver,
    endpoint.response,
  )}${withAxiosResponse ? ">" : ""}`;

  if (mode === "query") {
    lines.push(` * @returns { UseQueryResult<${resultType}> } ${endpoint.responseDescription ?? ""}`);
  } else if (mode === "mutation") {
    lines.push(` * @returns { UseMutationResult<${resultType}> } ${endpoint.responseDescription ?? ""}`);
  } else {
    lines.push(` * @returns { UseInfiniteQueryResult<${resultType}> } ${endpoint.responseDescription ?? ""}`);
  }

  lines.push(` * @statusCodes [${endpoint.responseStatusCodes.join(", ")}]`);
  lines.push(" */");
  return lines.join("\n");
}

function renderQueryKeys({ resolver, queryEndpoints }: { resolver: SchemaResolver; queryEndpoints: Endpoint[] }) {
  if (queryEndpoints.length === 0) {
    return "";
  }

  const lines: string[] = [];
  lines.push("export const keys = {");
  lines.push(`    all: [${QUERIES_MODULE_NAME}] as const,`);
  for (const endpoint of queryEndpoints) {
    lines.push(
      `    ${getEndpointName(endpoint)}: (${renderEndpointParams(resolver, endpoint, { pathParamsRequiredOnly: true })}) => [...keys.all, "${endpoint.path}", ${renderEndpointArgs(
        resolver,
        endpoint,
        {},
      )}] as const,`,
    );
    if (resolver.options.infiniteQueries && isInfiniteQuery(endpoint, resolver.options)) {
      lines.push(
        `    ${getEndpointName(endpoint)}Infinite: (${renderEndpointParams(resolver, endpoint, {
          excludePageParam: true,
          pathParamsRequiredOnly: true,
        })}) => [...keys.all, "${endpoint.path}", "infinite", ${renderEndpointArgs(resolver, endpoint, {
          excludePageParam: true,
        })}] as const,`,
      );
    }
  }
  lines.push("};");
  return lines.join("\n");
}

function renderInlineEndpoints({
  resolver,
  endpoints,
  tag,
}: {
  resolver: SchemaResolver;
  endpoints: Endpoint[];
  tag: string;
}) {
  const lines: string[] = [];
  for (const endpoint of endpoints) {
    const endpointParams = renderEndpointParams(resolver, endpoint, { modelNamespaceTag: tag });
    const endpointBody = getEndpointBody(endpoint);
    const hasUndefinedEndpointBody = requiresBody(endpoint) && !endpointBody && hasEndpointConfig(endpoint, resolver);
    const endpointConfig = renderInlineEndpointConfig(resolver, endpoint, tag);

    lines.push(
      `const ${getEndpointName(endpoint)} = (${endpointParams}${resolver.options.axiosRequestConfig ? `${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
    );
    lines.push(`  return ${APP_REST_CLIENT_NAME}.${endpoint.method}(`);
    lines.push(`    { resSchema: ${getImportedZodSchemaName(resolver, endpoint.response, tag)} },`);
    lines.push(`    \`${getEndpointPath(endpoint)}\`,`);

    if (endpointBody) {
      lines.push(
        `    ${resolver.options.parseRequestParams ? renderInlineEndpointParamParse(resolver, endpointBody, endpointBody.name, tag) : endpointBody.name},`,
      );
    } else if (hasUndefinedEndpointBody) {
      lines.push("    undefined,");
    }

    lines.push(`    ${endpointConfig}`);
    lines.push("  );");
    lines.push("};");
    lines.push("");
  }
  return lines;
}

function renderInlineEndpointParamParse(
  resolver: SchemaResolver,
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

function renderInlineEndpointConfig(resolver: SchemaResolver, endpoint: Endpoint, modelNamespaceTag?: string) {
  const endpointConfig = getEndpointConfig(endpoint);
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  if (Object.keys(endpointConfig).length === 0) {
    return hasAxiosRequestConfig ? AXIOS_REQUEST_CONFIG_NAME : "";
  }

  const lines: string[] = [];
  lines.push("{");
  if (hasAxiosRequestConfig) {
    lines.push(`      ...${AXIOS_REQUEST_CONFIG_NAME},`);
  }
  if (endpointConfig.params) {
    lines.push("      params: {");
    for (const param of endpointConfig.params) {
      const value = resolver.options.parseRequestParams
        ? renderInlineEndpointParamParse(resolver, param, param.value, modelNamespaceTag)
        : param.value;
      lines.push(`        ${param.name}: ${value},`);
    }
    lines.push("      },");
  }
  if (endpointConfig.headers) {
    lines.push("      headers: {");
    for (const [key, value] of Object.entries(endpointConfig.headers)) {
      lines.push(`        '${key}': ${value},`);
    }
    lines.push("      },");
  }
  if (endpoint.response === "z.instanceof(Blob)") {
    lines.push('      responseType: "blob",');
  }
  if (endpoint.mediaDownload) {
    lines.push("      rawResponse: true,");
  }
  lines.push("    }");
  return lines.join("\n");
}

function renderQuery({
  resolver,
  endpoint,
  inlineEndpoints,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  inlineEndpoints: boolean;
}) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const resolvedEndpointArgs = renderEndpointArgs(resolver, endpoint, {}, workspaceParamReplacements);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    optionalPathParams: resolver.options.workspaceContext,
  });
  const hasQueryFn = endpointArgs.length > 0 || hasAxiosRequestConfig || hasAclCheck;
  const hasQueryFnBody = Boolean(hasAclCheck) || Object.keys(workspaceParamReplacements).length > 0;
  const importedEndpoint = inlineEndpoints
    ? getEndpointName(endpoint)
    : getImportedEndpointName(endpoint, resolver.options);

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "query" }));
  lines.push(
    `export const ${getQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }, ` : ""}options?: AppQueryOptions<typeof ${importedEndpoint}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push(...renderWorkspaceParamResolutions({ replacements: workspaceParamReplacements, indent: "  " }));
  lines.push("  ");
  lines.push(`  return ${QUERY_HOOKS.query}({`);
  lines.push(`    queryKey: keys.${getEndpointName(endpoint)}(${resolvedEndpointArgs}),`);
  if (hasQueryFn) {
    lines.push(`    queryFn: () => ${hasQueryFnBody ? "{ " : ""}`);
    if (hasAclCheck) {
      lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "    "));
    }
    lines.push(
      `    ${hasQueryFnBody ? "return " : ""}${importedEndpoint}(${resolvedEndpointArgs}${hasAxiosRequestConfig ? `${resolvedEndpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""})${hasQueryFnBody ? " }" : ""},`,
    );
  } else {
    lines.push(`    queryFn: ${importedEndpoint},`);
  }
  lines.push("    ...options,");
  lines.push("    onError: options?.onError ?? queryConfig.onError,");
  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}

function renderMutation({
  resolver,
  endpoint,
  inlineEndpoints,
  precomputed,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  inlineEndpoints: boolean;
  precomputed?: { updateQueryEndpoints: Endpoint[]; destructuredVariables: string[] };
}) {
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const hasMutationEffects = resolver.options.mutationEffects;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    includeFileParam: true,
    optionalPathParams: resolver.options.workspaceContext,
  });
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const resolvedEndpointArgs = renderEndpointArgs(resolver, endpoint, {}, workspaceParamReplacements);
  const destructuredMutationArgs = renderEndpointArgs(resolver, endpoint, { includeFileParam: true });
  const endpointFunction = inlineEndpoints
    ? getEndpointName(endpoint)
    : getImportedEndpointName(endpoint, resolver.options);

  const updateQueryEndpoints = precomputed?.updateQueryEndpoints ?? [];
  const destructuredVariables =
    precomputed?.destructuredVariables ?? getDestructuredVariables(resolver, endpoint, updateQueryEndpoints);
  const hasMutationFnBody = endpoint.mediaUpload || hasAclCheck || Object.keys(workspaceParamReplacements).length > 0;

  const mutationVariablesType = endpoint.mediaUpload
    ? `${endpointParams}${endpointParams ? "; " : ""}abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void`
    : endpointParams;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "mutation" }));
  lines.push(
    `export const ${getQueryName(endpoint, true)} = (options?: AppMutationOptions<typeof ${endpointFunction}, { ${mutationVariablesType} }>${hasMutationEffects ? ` & ${MUTATION_EFFECTS.optionsType}` : ""}${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  if (Object.keys(workspaceParamReplacements).length > 0) {
    lines.push("  const workspaceContext = OpenApiWorkspaceContext.useContext();");
  }
  if (hasMutationEffects) {
    lines.push(`  const { runMutationEffects } = useMutationEffects({ currentModule: ${QUERIES_MODULE_NAME} });`);
  }
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.mutation}({`);

  const mutationFnArg = endpointParams
    ? `{ ${destructuredMutationArgs}${endpoint.mediaUpload ? `${destructuredMutationArgs ? ", " : ""}abortController, onUploadProgress` : ""} }`
    : "";
  lines.push(
    `    mutationFn: ${endpoint.mediaUpload ? "async " : ""}(${mutationFnArg}) => ${hasMutationFnBody ? "{ " : ""}`,
  );
  for (const [paramName, resolvedParamName] of Object.entries(workspaceParamReplacements)) {
    lines.push(
      `      const ${resolvedParamName} = OpenApiWorkspaceContext.resolveParam(workspaceContext, "${paramName}", ${paramName});`,
    );
  }
  if (hasAclCheck) {
    lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "      "));
  }
  if (endpoint.mediaUpload) {
    lines.push(
      `      const uploadInstructions = await ${endpointFunction}(${resolvedEndpointArgs}${hasAxiosRequestConfig ? `${resolvedEndpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""});`,
    );
    lines.push("      ");
    lines.push("      if (file && uploadInstructions.url) {");
    lines.push('        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";');
    lines.push("        let dataToSend: File | FormData = file;");
    lines.push('        if (method === "post") {');
    lines.push("          dataToSend = new FormData();");
    lines.push("          if (uploadInstructions.fields) {");
    lines.push("            for (const [key, value] of uploadInstructions.fields) {");
    lines.push("              dataToSend.append(key, value);");
    lines.push("            }");
    lines.push("          }");
    lines.push('          dataToSend.append("file", file);');
    lines.push("        }");
    lines.push("        await axios[method](uploadInstructions.url, dataToSend, {");
    lines.push("          headers: {");
    lines.push('            "Content-Type": file.type,');
    lines.push("          },");
    lines.push("          signal: abortController?.signal,");
    lines.push("          onUploadProgress: onUploadProgress");
    lines.push(
      "          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })",
    );
    lines.push("          : undefined,");
    lines.push("        });");
    lines.push("      }");
    lines.push("      ");
    lines.push("      return uploadInstructions;");
  } else {
    lines.push(
      `      ${hasMutationFnBody ? "return " : ""}${endpointFunction}(${resolvedEndpointArgs}${hasAxiosRequestConfig ? `${resolvedEndpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""})`,
    );
  }
  if (hasMutationFnBody) {
    lines.push("    },");
  } else {
    lines.push(",");
  }

  lines.push("    ...options,");
  lines.push("    onError: options?.onError ?? queryConfig.onError,");
  if (hasMutationEffects) {
    lines.push("    onSuccess: async (resData, variables, onMutateResult, context) => {");
    if (updateQueryEndpoints.length > 0) {
      if (destructuredVariables.length > 0) {
        lines.push(`      const { ${destructuredVariables.join(", ")} } = variables;`);
      }
      for (const [paramName, resolvedParamName] of Object.entries(workspaceParamReplacements)) {
        lines.push(
          `      const ${resolvedParamName} = OpenApiWorkspaceContext.resolveParam(workspaceContext, "${paramName}", ${paramName});`,
        );
      }
      lines.push(
        `      const updateKeys = [${updateQueryEndpoints
          .map(
            (e) =>
              `keys.${getEndpointName(e)}(${renderEndpointArgs(
                resolver,
                e,
                {
                  includeOnlyRequiredParams: true,
                },
                workspaceParamReplacements,
              )})`,
          )
          .join(", ")}];`,
      );
      lines.push(`      await runMutationEffects(resData, variables, options, updateKeys);`);
    } else {
      lines.push("      await runMutationEffects(resData, variables, options);");
    }
    lines.push("      options?.onSuccess?.(resData, variables, onMutateResult, context);");
    lines.push("    },");
  }

  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}

function groupEndpoints(endpoints: Endpoint[], resolver: SchemaResolver) {
  const queryEndpoints: Endpoint[] = [];
  const mutationEndpoints: Endpoint[] = [];
  const infiniteQueryEndpoints: Endpoint[] = [];
  const aclEndpoints: Endpoint[] = [];
  const infoByEndpoint = new Map<Endpoint, { query: boolean; mutation: boolean; infiniteQuery: boolean }>();
  const mutationDataByEndpoint = new Map<
    Endpoint,
    { updateQueryEndpoints: Endpoint[]; destructuredVariables: string[] }
  >();

  for (const endpoint of endpoints) {
    const query = isQuery(endpoint);
    const mutation = isMutation(endpoint);
    const infiniteQuery = Boolean(
      resolver.options.infiniteQueries && query && isInfiniteQuery(endpoint, resolver.options),
    );

    if (query) {
      queryEndpoints.push(endpoint);
    }
    if (mutation) {
      mutationEndpoints.push(endpoint);
    }
    if (infiniteQuery) {
      infiniteQueryEndpoints.push(endpoint);
    }
    if (endpoint.acl) {
      aclEndpoints.push(endpoint);
    }

    infoByEndpoint.set(endpoint, { query, mutation, infiniteQuery });
  }

  for (const endpoint of mutationEndpoints) {
    const updateQueryEndpoints = queryEndpoints.filter(
      (queryEndpoint) =>
        queryEndpoint.parameters
          .filter((param) => param.parameterObject?.required)
          .every((pathParam) => endpoint.parameters.some((param) => param.name === pathParam.name)) &&
        queryEndpoint.response === endpoint.response,
    );

    mutationDataByEndpoint.set(endpoint, {
      updateQueryEndpoints,
      destructuredVariables: getDestructuredVariables(resolver, endpoint, updateQueryEndpoints),
    });
  }

  return {
    queryEndpoints,
    mutationEndpoints,
    infiniteQueryEndpoints,
    aclEndpoints,
    infoByEndpoint,
    mutationDataByEndpoint,
  };
}

function renderInfiniteQuery({
  resolver,
  endpoint,
  inlineEndpoints,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  inlineEndpoints: boolean;
}) {
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    excludePageParam: true,
    optionalPathParams: resolver.options.workspaceContext,
  });
  const endpointArgsWithoutPage = renderEndpointArgs(resolver, endpoint, { excludePageParam: true });
  const resolvedEndpointArgsWithoutPage = renderEndpointArgs(
    resolver,
    endpoint,
    { excludePageParam: true },
    workspaceParamReplacements,
  );
  const endpointArgsWithPage = renderEndpointArgs(resolver, endpoint, { replacePageParam: true });
  const resolvedEndpointArgsWithPage = renderEndpointArgs(
    resolver,
    endpoint,
    { replacePageParam: true },
    workspaceParamReplacements,
  );
  const endpointFunction = inlineEndpoints
    ? getEndpointName(endpoint)
    : getImportedEndpointName(endpoint, resolver.options);
  const hasQueryFnBody = Boolean(hasAclCheck) || Object.keys(workspaceParamReplacements).length > 0;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "infiniteQuery" }));
  lines.push(
    `export const ${getInfiniteQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgsWithoutPage} }: { ${endpointParams} }, ` : ""}options?: AppInfiniteQueryOptions<typeof ${endpointFunction}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push(...renderWorkspaceParamResolutions({ replacements: workspaceParamReplacements, indent: "  " }));
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.infiniteQuery}({`);
  lines.push(`    queryKey: keys.${getEndpointName(endpoint)}Infinite(${resolvedEndpointArgsWithoutPage}),`);
  lines.push(`    queryFn: ({ pageParam }) => ${hasQueryFnBody ? "{ " : ""}`);
  if (hasAclCheck) {
    lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "    "));
  }
  lines.push(
    `    ${hasQueryFnBody ? "return " : ""}${endpointFunction}(${resolvedEndpointArgsWithPage}${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}` : ""})${hasQueryFnBody ? " }" : ""},`,
  );
  lines.push("    initialPageParam: 1,");
  lines.push(
    `    getNextPageParam: ({ ${resolver.options.infiniteQueryResponseParamNames.page}, ${resolver.options.infiniteQueryResponseParamNames.totalItems}, ${resolver.options.infiniteQueryResponseParamNames.limit}: limitParam }) => {`,
  );
  lines.push(`      const pageParam = ${resolver.options.infiniteQueryResponseParamNames.page} ?? 1;`);
  lines.push(
    `      return pageParam * limitParam < ${resolver.options.infiniteQueryResponseParamNames.totalItems} ? pageParam + 1 : null;`,
  );
  lines.push("    },");
  lines.push("    ...options,");
  lines.push("    onError: options?.onError ?? queryConfig.onError,");
  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}
