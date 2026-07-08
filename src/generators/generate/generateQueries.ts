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
import {
  ACL_PACKAGE_IMPORT_PATH,
  PACKAGE_IMPORT_PATH,
  ZOD_PACKAGE_IMPORT_PATH,
} from "@/generators/const/package.const";
import { QUERIES_MODULE_NAME, QUERY_HOOKS, QUERY_IMPORT } from "@/generators/const/queries.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint, EndpointParameter } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getUniqueArray } from "@/generators/utils/array.utils";
import {
  getAbilityConditionsTypes,
  getAbilityFunctionName,
  renderAclCheckCall,
} from "@/generators/utils/generate/generate.acl.utils";
import {
  getEndpointBody,
  getEndpointConfig,
  getEndpointName,
  getEndpointPath,
  hasEndpointConfig,
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
  renderMediaUploadMutationBody,
  requiresBody,
} from "@/generators/utils/generate/generate.endpoints.utils";
import { getSchemaDescriptions } from "@/generators/utils/generate/generate.openapi.utils";
import {
  getAclImports,
  getEndpointsImports,
  getModelsImports,
} from "@/generators/utils/generate/generate.imports.utils";
import {
  getInfiniteQueryName,
  getInfiniteQueryOptionsName,
  getPrefetchInfiniteQueryName,
  getPrefetchQueryName,
  getQueryName,
  getQueryOptionsName,
} from "@/generators/utils/generate/generate.query.utils";
import {
  getAppRestClientImportPath,
  getQueryModulesImportPath,
  getQueryTypesImportPath,
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
import { capitalize } from "@/generators/utils/string.utils";
import { getEndpointTag, shouldInlineEndpointsForTag } from "@/generators/utils/tag.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";
import { invalidVariableNameCharactersToCamel } from "@/generators/utils/js.utils";

const endpointParamMappingCache = new WeakMap<
  SchemaResolver,
  WeakMap<Endpoint, Map<string, ReturnType<typeof mapEndpointParamsToFunctionParams>>>
>();

export function generateQueries(params: GenerateTypeParams) {
  const { resolver, data, tag } = params;

  const mutationScopeOption = resolver.options.mutationScope;
  if (mutationScopeOption && typeof mutationScopeOption === "object") {
    if ("include" in mutationScopeOption && "exclude" in mutationScopeOption) {
      throw new Error("mutationScope cannot specify both 'include' and 'exclude'");
    }
  }

  const inlineEndpoints = shouldInlineEndpointsForTag(tag, resolver.options);
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }
  const endpointGroups = groupEndpoints(endpoints, resolver);

  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasAxiosDefaultImport = endpoints.some(({ mediaUpload }) => mediaUpload);
  const hasGetEndpoints = endpoints.some((endpoint) => endpoint.method === "get");
  const hasAxiosImport = hasAxiosRequestConfig || hasAxiosDefaultImport || hasGetEndpoints;
  const axiosImport: Import = {
    defaultImport: hasAxiosDefaultImport ? AXIOS_DEFAULT_IMPORT_NAME : undefined,
    bindings: [],
    typeBindings: hasAxiosImport ? [AXIOS_REQUEST_CONFIG_TYPE] : [],
    from: AXIOS_IMPORT.from,
  };

  const { queryEndpoints, infiniteQueryEndpoints, mutationEndpoints, aclEndpoints } = endpointGroups;
  const hasMutationDefaultOnError = resolver.options.mutationDefaultOnError && mutationEndpoints.length > 0;

  const queryImport: Import = {
    bindings: [
      ...(resolver.options.prefetchQueries && queryEndpoints.length > 0 ? ["QueryClient"] : []),
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
    bindings: [...(mutationEndpoints.length > 0 ? [MUTATION_EFFECTS.hookName] : [])],
    typeBindings: [...(mutationEndpoints.length > 0 ? [MUTATION_EFFECTS.optionsType] : [])],
    from: PACKAGE_IMPORT_PATH,
  };

  const hasAclCheck = resolver.options.checkAcl && aclEndpoints.length > 0;
  const aclCheckImport: Import = {
    bindings: [ACL_CHECK_HOOK],
    from: ACL_PACKAGE_IMPORT_PATH,
  };

  const queryTypesImport: Import = {
    bindings: [
      ...(queryEndpoints.length > 0 || infiniteQueryEndpoints.length > 0 || hasMutationDefaultOnError
        ? ["OpenApiQueryConfig"]
        : []),
    ],
    typeBindings: [
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
    bindings: ["useWorkspaceContext"],
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
    from: ZOD_PACKAGE_IMPORT_PATH,
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

  lines.push(renderQueryKeys({ resolver, queryEndpoints, tag }));
  lines.push("");

  for (const endpoint of endpoints) {
    const endpointInfo = endpointGroups.infoByEndpoint.get(endpoint);
    if (endpointInfo?.query) {
      lines.push(renderQueryOptions({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
      lines.push(renderQuery({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
      if (resolver.options.prefetchQueries) {
        lines.push(renderPrefetchQuery({ resolver, endpoint }));
        lines.push("");
      }
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
      lines.push(renderInfiniteQueryOptions({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
      lines.push(renderInfiniteQuery({ resolver, endpoint, inlineEndpoints }));
      lines.push("");
      if (resolver.options.prefetchQueries) {
        lines.push(renderPrefetchInfiniteQuery({ resolver, endpoint }));
        lines.push("");
      }
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
      .map(([optionName, optionValue]) => [optionName, optionValue]),
  );
  const cached = endpointCache.get(key);
  if (cached) {
    return cached;
  }

  const computed = mapEndpointParamsToFunctionParams(resolver, endpoint, options);
  endpointCache.set(key, computed);
  return computed;
}

function getWorkspaceContextAllowList(workspaceContext: SchemaResolver["options"]["workspaceContext"]) {
  return new Set(workspaceContext);
}

function renderImport(importData: Import) {
  const namedImports = [
    ...importData.bindings,
    ...(importData.typeBindings ?? []).map((binding) => (importData.typeOnly ? binding : `type ${binding}`)),
  ];
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(namedImports.length > 0 ? [`{ ${namedImports.join(", ")} }`] : []),
  ].join(", ");
  return `import${importData.typeOnly ? " type" : ""} ${names} from "${importData.from}";`;
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

function renderEndpointObjectArgs(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
  replacements?: Record<string, string>,
) {
  return getEndpointParamMapping(resolver, endpoint, options)
    .map((param) => {
      const replacement = replacements?.[param.name];
      return replacement && replacement !== param.name ? `${param.name}: ${replacement}` : param.name;
    })
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
  const allowList = getWorkspaceContextAllowList(resolver.options.workspaceContext);
  const endpointParams = getEndpointParamMapping(resolver, endpoint, {});
  const endpointParamNames = new Set(endpointParams.map((param) => param.name));
  const workspaceParamNames = endpointParams.filter((param) => param.paramType === "Path").map((param) => param.name);

  const aclParamNames = (getAbilityConditionsTypes(endpoint) ?? [])
    .map((condition) => invalidVariableNameCharactersToCamel(condition.name))
    .filter((name) => endpointParamNames.has(name));

  return getUniqueArray([...workspaceParamNames, ...aclParamNames]).filter((name) => allowList.has(name));
}

function getWorkspaceParamReplacements(resolver: SchemaResolver, endpoint: Endpoint) {
  return Object.fromEntries(
    getWorkspaceParamNames(resolver, endpoint).map((name) => [name, `normalize${capitalize(name)}`]),
  ) as Record<string, string>;
}

function getWorkspaceParamTypes(resolver: SchemaResolver, endpoint: Endpoint, modelNamespaceTag?: string) {
  const workspaceParamNames = new Set(getWorkspaceParamNames(resolver, endpoint));
  return Object.fromEntries(
    getEndpointParamMapping(resolver, endpoint, { modelNamespaceTag })
      .filter((param) => workspaceParamNames.has(param.name))
      .map((param) => [param.name, param.type]),
  ) as Record<string, string>;
}

function renderWorkspaceContextDestructure({
  replacements,
  paramTypes,
  indent,
}: {
  replacements: Record<string, string>;
  paramTypes: Record<string, string>;
  indent: string;
}) {
  const workspaceParamNames = Object.keys(replacements);
  if (workspaceParamNames.length === 0) {
    return [];
  }

  const workspaceParamBindings = workspaceParamNames.map((paramName) => `${paramName}: ${paramName}Workspace`);
  const workspaceContextType = workspaceParamNames
    .map((paramName) => `${paramName}?: ${paramTypes[paramName] ?? "unknown"}`)
    .join("; ");
  return [
    `${indent}const { ${workspaceParamBindings.join(", ")} } = useWorkspaceContext<{ ${workspaceContextType} }>();`,
  ];
}

function renderWorkspaceParamCoalescing({
  replacements,
  indent,
}: {
  replacements: Record<string, string>;
  indent: string;
}) {
  const workspaceParamNames = Object.keys(replacements);
  const lines: string[] = [];
  for (const paramName of workspaceParamNames) {
    lines.push(`${indent}const ${replacements[paramName]} = ${paramName} ?? ${paramName}Workspace;`);
    lines.push(`${indent}if (!${replacements[paramName]}) {`);
    lines.push(`${indent}  throw Error(\`${capitalize(paramName)} not provided\`);`);
    lines.push(`${indent}}`);
  }
  return lines;
}

function renderWorkspaceParamResolutions({
  replacements,
  paramTypes,
  indent,
}: {
  replacements: Record<string, string>;
  paramTypes: Record<string, string>;
  indent: string;
}) {
  return [
    ...renderWorkspaceContextDestructure({ replacements, paramTypes, indent }),
    ...renderWorkspaceParamCoalescing({ replacements, indent }),
  ];
}

function addAsteriskAfterNewLine(str: string) {
  return str.replace(/\n/g, "\n *");
}

function renderQueryJsDocs({
  resolver,
  endpoint,
  mode,
  tag,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  mode: "query" | "mutation" | "infiniteQuery";
  tag: string;
}) {
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
    modelNamespaceTag: tag,
  });
  for (const endpointParam of params) {
    lines.push(
      ` * @param { ${endpointParam.type} } ${endpointParam.name} ${renderEndpointParamDescription(endpointParam)}`,
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
    undefined,
    tag,
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

function renderQueryKeys({
  resolver,
  queryEndpoints,
  tag,
}: {
  resolver: SchemaResolver;
  queryEndpoints: Endpoint[];
  tag: string;
}) {
  if (queryEndpoints.length === 0) {
    return "";
  }

  const lines: string[] = [];
  lines.push("export const keys = {");
  lines.push(`    all: [${QUERIES_MODULE_NAME}] as const,`);
  for (const endpoint of queryEndpoints) {
    lines.push(
      `    ${getEndpointName(endpoint)}: (${renderEndpointParams(resolver, endpoint, {
        pathParamsRequiredOnly: true,
        modelNamespaceTag: tag,
      })}) => [...keys.all, "${endpoint.path}", ${renderEndpointArgs(resolver, endpoint, {})}] as const,`,
    );
    if (resolver.options.infiniteQueries && isInfiniteQuery(endpoint, resolver.options)) {
      lines.push(
        `    ${getEndpointName(endpoint)}Infinite: (${renderEndpointParams(resolver, endpoint, {
          excludePageParam: true,
          pathParamsRequiredOnly: true,
          modelNamespaceTag: tag,
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
    const hasRequestConfigParam = resolver.options.axiosRequestConfig || endpoint.method === "get";

    lines.push(
      `const ${getEndpointName(endpoint)} = (${endpointParams}${hasRequestConfigParam ? `${endpointParams ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}?: ${getRequestConfigType()}` : ""}) => {`,
    );
    lines.push(`  return ${APP_REST_CLIENT_NAME}.${endpoint.method}(`);
    lines.push(`    ${renderInlineRequestInfo(resolver, endpoint, tag)},`);
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

function renderInlineRequestInfo(resolver: SchemaResolver, endpoint: Endpoint, tag: string) {
  return `{ resSchema: ${getImportedZodSchemaName(resolver, endpoint.response, tag)} }`;
}

function getRequestConfigType() {
  return `${AXIOS_REQUEST_CONFIG_TYPE} & { allowInvalidResponseData?: boolean }`;
}

function renderRequestConfigWithSignal(hasRequestConfigParam: boolean) {
  return `{ ${hasRequestConfigParam ? `...${AXIOS_REQUEST_CONFIG_NAME}, ` : ""}signal }`;
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
      )})${getSortingPresenceChain(resolver, param)}`
    : `${getImportedZodSchemaName(resolver, param.zodSchema, modelNamespaceTag)}${addOptional ? ".optional()" : ""}`;
  const queryArgs = param.type === "Query" ? `, { type: "query", name: "${paramName}" }` : "";
  return `${ZOD_EXTENDED.namespace}.${ZOD_EXTENDED.exports.parse}(${schemaValue}, ${paramName}${queryArgs})`;
}

function getSortingPresenceChain(resolver: SchemaResolver, param: EndpointParameter) {
  const zodSchemaCode = resolver.getCodeByZodSchemaName(param.zodSchema) ?? param.zodSchema;

  if (zodSchemaCode.includes(".nullish()")) {
    return ".nullish()";
  }

  if (zodSchemaCode.includes(".nullable()")) {
    return ".nullable()";
  }

  return !(param.parameterObject ?? param.bodyObject)?.required ? ".optional()" : "";
}

function renderInlineEndpointConfig(resolver: SchemaResolver, endpoint: Endpoint, modelNamespaceTag?: string) {
  const endpointConfig = getEndpointConfig(endpoint);
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasRequestConfigParam = hasAxiosRequestConfig || endpoint.method === "get";
  const needsBlobConfig = endpoint.mediaDownload || endpoint.response === "z.instanceof(Blob)";
  if (Object.keys(endpointConfig).length === 0 && !needsBlobConfig) {
    return hasRequestConfigParam ? AXIOS_REQUEST_CONFIG_NAME : "";
  }

  const lines: string[] = [];
  lines.push("{");
  if (hasRequestConfigParam) {
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

function renderQueryOptions({
  resolver,
  endpoint,
  inlineEndpoints,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  inlineEndpoints: boolean;
}) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasRequestConfigParam = hasAxiosRequestConfig || endpoint.method === "get";
  const tag = getEndpointTag(endpoint, resolver.options);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    modelNamespaceTag: tag,
  });
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const endpointFunction = inlineEndpoints
    ? getEndpointName(endpoint)
    : getImportedEndpointName(endpoint, resolver.options);

  const lines: string[] = [];
  lines.push(
    `const ${getQueryOptionsName(endpoint)} = (${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }` : ""}${hasRequestConfigParam ? `${endpointParams ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}?: ${getRequestConfigType()}` : ""}) => ({`,
  );
  lines.push(`  queryKey: keys.${getEndpointName(endpoint)}(${endpointArgs}),`);
  const requestConfigWithSignal = renderRequestConfigWithSignal(hasRequestConfigParam);
  lines.push(
    `  queryFn: ({ signal }: { signal: AbortSignal }) => ${endpointFunction}(${endpointArgs}${hasRequestConfigParam ? `${endpointArgs ? ", " : ""}${requestConfigWithSignal}` : ""}),`,
  );
  lines.push("});");
  return lines.join("\n");
}

function renderInfiniteQueryOptions({
  resolver,
  endpoint,
  inlineEndpoints,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  inlineEndpoints: boolean;
}) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasRequestConfigParam = hasAxiosRequestConfig || endpoint.method === "get";
  const tag = getEndpointTag(endpoint, resolver.options);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    excludePageParam: true,
    modelNamespaceTag: tag,
  });
  const endpointArgsWithoutPage = renderEndpointArgs(resolver, endpoint, { excludePageParam: true });
  const endpointArgsWithPage = renderEndpointArgs(resolver, endpoint, { replacePageParam: true });
  const endpointFunction = inlineEndpoints
    ? getEndpointName(endpoint)
    : getImportedEndpointName(endpoint, resolver.options);

  const lines: string[] = [];
  lines.push(
    `const ${getInfiniteQueryOptionsName(endpoint)} = (${endpointParams ? `{ ${endpointArgsWithoutPage} }: { ${endpointParams} }` : ""}${hasRequestConfigParam ? `${endpointParams ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}?: ${getRequestConfigType()}` : ""}) => ({`,
  );
  lines.push(`  queryKey: keys.${getEndpointName(endpoint)}Infinite(${endpointArgsWithoutPage}),`);
  const requestConfigWithSignal = renderRequestConfigWithSignal(hasRequestConfigParam);
  lines.push(
    `  queryFn: ({ pageParam, signal }: { pageParam: number; signal: AbortSignal }) => ${endpointFunction}(${endpointArgsWithPage}${hasRequestConfigParam ? `, ${requestConfigWithSignal}` : ""}),`,
  );
  lines.push("  initialPageParam: 1,");
  lines.push(
    `  getNextPageParam: ({ ${resolver.options.infiniteQueryResponseParamNames.page}, ${resolver.options.infiniteQueryResponseParamNames.totalItems}, ${resolver.options.infiniteQueryResponseParamNames.limit}: limitParam }: Awaited<ReturnType<typeof ${endpointFunction}>>) => {`,
  );
  lines.push(`    const pageParam = ${resolver.options.infiniteQueryResponseParamNames.page} ?? 1;`);
  lines.push(
    `    return pageParam * limitParam < (${resolver.options.infiniteQueryResponseParamNames.totalItems} ?? 0) ? pageParam + 1 : null;`,
  );
  lines.push("  },");
  lines.push("});");
  return lines.join("\n");
}

function renderPrefetchQuery({ resolver, endpoint }: { resolver: SchemaResolver; endpoint: Endpoint }) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const tag = getEndpointTag(endpoint, resolver.options);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    modelNamespaceTag: tag,
  });
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});

  const lines: string[] = [];
  lines.push(
    `export const ${getPrefetchQueryName(endpoint)} = (queryClient: QueryClient, ${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }, ` : ""}${hasAxiosRequestConfig ? `${AXIOS_REQUEST_CONFIG_NAME}: ${AXIOS_REQUEST_CONFIG_TYPE}, ` : ""}options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {`,
  );
  lines.push(
    `  void queryClient.prefetchQuery({ ...${getQueryOptionsName(endpoint)}(${endpointParams ? `{ ${endpointArgs} }` : ""}${hasAxiosRequestConfig ? `${endpointParams ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""}), ...options });`,
  );
  lines.push("};");
  return lines.join("\n");
}

function renderPrefetchInfiniteQuery({ resolver, endpoint }: { resolver: SchemaResolver; endpoint: Endpoint }) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const tag = getEndpointTag(endpoint, resolver.options);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    excludePageParam: true,
    modelNamespaceTag: tag,
  });
  const endpointArgs = renderEndpointArgs(resolver, endpoint, { excludePageParam: true });
  const optionsArgs = `${endpointParams ? `{ ${endpointArgs} }` : ""}${hasAxiosRequestConfig ? `${endpointParams ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""}`;

  const lines: string[] = [];
  lines.push(
    `export const ${getPrefetchInfiniteQueryName(endpoint)} = (queryClient: QueryClient, ${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }, ` : ""}${hasAxiosRequestConfig ? `${AXIOS_REQUEST_CONFIG_NAME}: ${AXIOS_REQUEST_CONFIG_TYPE}, ` : ""}options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">): void => {`,
  );
  // options is cast to {} so it contributes no typed properties to the spread, letting TypeScript
  // infer TPageParam and TQueryFnData solely from the options factory (via initialPageParam and
  // queryFn). Without the cast, the options type defaults prefetchInfiniteQuery generics to unknown,
  // which conflicts with the generated queryFn expecting pageParam: number.
  lines.push(
    `  void queryClient.prefetchInfiniteQuery({ ...${getInfiniteQueryOptionsName(endpoint)}(${optionsArgs}), ...(options as {}) });`,
  );
  lines.push("};");
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
  const tag = getEndpointTag(endpoint, resolver.options);
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const workspaceParamTypes = getWorkspaceParamTypes(resolver, endpoint, tag);
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const resolvedEndpointArgs = renderEndpointObjectArgs(resolver, endpoint, {}, workspaceParamReplacements);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    optionalPathParams: resolver.options.workspaceContext,
    modelNamespaceTag: tag,
  });
  const queryOptionsName = getQueryOptionsName(endpoint);
  const hasQueryFnOverride = hasAclCheck;
  const requestConfig = `{ ${hasAxiosRequestConfig ? `...${AXIOS_REQUEST_CONFIG_NAME}, ` : ""}allowInvalidResponseData: queryConfig.allowInvalidResponseData }`;
  const queryOptionsArgs = `${resolvedEndpointArgs ? `{ ${resolvedEndpointArgs} }, ` : ""}${requestConfig}`;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "query", tag }));
  lines.push(
    `export const ${getQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }, ` : ""}options?: AppQueryOptions<typeof ${inlineEndpoints ? getEndpointName(endpoint) : getImportedEndpointName(endpoint, resolver.options)}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push(
    ...renderWorkspaceParamResolutions({
      replacements: workspaceParamReplacements,
      paramTypes: workspaceParamTypes,
      indent: "  ",
    }),
  );
  lines.push("  ");
  lines.push(`  return ${QUERY_HOOKS.query}({`);
  lines.push(`    ...${queryOptionsName}(${queryOptionsArgs}),`);
  if (hasQueryFnOverride) {
    lines.push("    queryFn: async ({ signal }: { signal: AbortSignal }) => {");
    if (hasAclCheck) {
      lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "    "));
    }
    lines.push(`      return ${queryOptionsName}(${queryOptionsArgs}).queryFn({ signal });`);
    lines.push("    },");
  }
  lines.push("    ...options,");
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
  const hasMutationDefaultOnError = resolver.options.mutationDefaultOnError;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const tag = getEndpointTag(endpoint, resolver.options);
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const workspaceParamTypes = getWorkspaceParamTypes(resolver, endpoint, tag);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    includeFileParam: true,
    optionalPathParams: resolver.options.workspaceContext,
    modelNamespaceTag: tag,
  });
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

  const isPost = endpoint.method === "post";
  const mutationScopeOption = resolver.options.mutationScope;
  const operationId = getEndpointName(endpoint);
  const scopeMatchKey = `${tag}/${operationId}`;
  let scopeEnabled = false;
  if (!isPost && mutationScopeOption) {
    if (mutationScopeOption === true) {
      scopeEnabled = true;
    } else if (typeof mutationScopeOption === "object" && "include" in mutationScopeOption) {
      scopeEnabled = mutationScopeOption.include.some((id) => id === operationId || id === scopeMatchKey);
    } else if (typeof mutationScopeOption === "object" && "exclude" in mutationScopeOption) {
      scopeEnabled = !mutationScopeOption.exclude.some((id) => id === operationId || id === scopeMatchKey);
    }
  }
  const scopePathParams = scopeEnabled
    ? mapEndpointParamsToFunctionParams(resolver, endpoint, {}).filter((p) => p.paramType === "Path")
    : [];
  const isScoped = scopePathParams.length > 0;

  const nonPathEndpointParams = isScoped
    ? renderEndpointParams(resolver, endpoint, {
        includeFileParam: true,
        optionalPathParams: resolver.options.workspaceContext,
        modelNamespaceTag: tag,
        excludePathParams: true,
      })
    : endpointParams;
  const nonPathMutationVariablesType = isScoped
    ? endpoint.mediaUpload
      ? `${nonPathEndpointParams}${nonPathEndpointParams ? "; " : ""}abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void`
      : nonPathEndpointParams
    : mutationVariablesType;

  const pathParamFirstArg = isScoped
    ? `{ ${scopePathParams.map((p) => p.name).join(", ")} }: { ${scopePathParams.map((p) => `${p.name}: ${p.type}`).join("; ")} }, `
    : "";
  const mutationOptionsTypeArg = isScoped
    ? nonPathMutationVariablesType
      ? `, { ${nonPathMutationVariablesType} }`
      : ""
    : `, { ${mutationVariablesType} }`;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "mutation", tag }));
  lines.push(
    `export const ${getQueryName(endpoint, true)} = (${pathParamFirstArg}options?: AppMutationOptions<typeof ${endpointFunction}${mutationOptionsTypeArg}>${hasMutationEffects ? ` & ${MUTATION_EFFECTS.optionsType}` : ""}${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  if (hasMutationDefaultOnError) {
    lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  }
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push(
    ...renderWorkspaceContextDestructure({
      replacements: workspaceParamReplacements,
      paramTypes: workspaceParamTypes,
      indent: "  ",
    }),
  );
  if (hasMutationEffects) {
    lines.push(
      `  const { runMutationEffects } = useMutationEffects<${QUERY_MODULE_ENUM}.${tag}>({ currentModule: ${QUERIES_MODULE_NAME} });`,
    );
  }
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.mutation}({`);

  const nonPathDestructuredArgs = isScoped
    ? renderEndpointArgs(resolver, endpoint, { includeFileParam: true, excludePathParams: true })
    : destructuredMutationArgs;
  const effectiveParams = isScoped ? nonPathEndpointParams : endpointParams;
  const effectiveArgs = isScoped ? nonPathDestructuredArgs : destructuredMutationArgs;
  const mutationFnArg =
    effectiveParams || endpoint.mediaUpload
      ? `{ ${effectiveArgs}${endpoint.mediaUpload ? `${effectiveArgs ? ", " : ""}abortController, onUploadProgress` : ""} }`
      : "";
  lines.push(
    `    mutationFn: ${endpoint.mediaUpload ? "async " : ""}(${mutationFnArg}) => ${hasMutationFnBody ? "{ " : ""}`,
  );
  lines.push(...renderWorkspaceParamCoalescing({ replacements: workspaceParamReplacements, indent: "      " }));
  if (hasAclCheck) {
    lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "      "));
  }
  if (endpoint.mediaUpload) {
    lines.push(
      ...renderMediaUploadMutationBody({ resolver, endpointFunction, resolvedEndpointArgs }).map(
        (line) => `      ${line}`,
      ),
    );
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

  if (isScoped) {
    const scopePathParamInterpolations = scopePathParams.map((p) => `:\${${p.name}}`).join("");
    lines.push(`    scope: { id: \`${getEndpointName(endpoint)}${scopePathParamInterpolations}\` },`);
  }
  lines.push("    ...options,");
  if (hasMutationDefaultOnError) {
    lines.push("    onError: options?.onError ?? queryConfig.onError,");
  }
  if (hasMutationEffects) {
    lines.push("    onSuccess: async (resData, variables, onMutateResult, context) => {");
    if (updateQueryEndpoints.length > 0) {
      const scopedPathParamNames = new Set(scopePathParams.map((p) => p.name));
      const variablesDestructure = destructuredVariables.filter((v) => !scopedPathParamNames.has(v));
      if (variablesDestructure.length > 0) {
        lines.push(`      const { ${variablesDestructure.join(", ")} } = variables;`);
      }
      lines.push(...renderWorkspaceParamCoalescing({ replacements: workspaceParamReplacements, indent: "      " }));
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
  const tag = getEndpointTag(endpoint, resolver.options);
  const workspaceParamReplacements = resolver.options.workspaceContext
    ? getWorkspaceParamReplacements(resolver, endpoint)
    : {};
  const workspaceParamTypes = getWorkspaceParamTypes(resolver, endpoint, tag);
  const endpointParams = renderEndpointParams(resolver, endpoint, {
    excludePageParam: true,
    optionalPathParams: resolver.options.workspaceContext,
    modelNamespaceTag: tag,
  });
  const endpointArgsWithoutPage = renderEndpointArgs(resolver, endpoint, { excludePageParam: true });
  const resolvedEndpointArgsWithoutPage = renderEndpointObjectArgs(
    resolver,
    endpoint,
    { excludePageParam: true },
    workspaceParamReplacements,
  );
  const queryOptionsName = getInfiniteQueryOptionsName(endpoint);
  const requestConfig = `{ ${hasAxiosRequestConfig ? `...${AXIOS_REQUEST_CONFIG_NAME}, ` : ""}allowInvalidResponseData: queryConfig.allowInvalidResponseData }`;
  const queryOptionsArgs = `${resolvedEndpointArgsWithoutPage ? `{ ${resolvedEndpointArgsWithoutPage} }, ` : ""}${requestConfig}`;
  const hasQueryFnOverride = hasAclCheck;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "infiniteQuery", tag }));
  lines.push(
    `export const ${getInfiniteQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgsWithoutPage} }: { ${endpointParams} }, ` : ""}options?: AppInfiniteQueryOptions<typeof ${inlineEndpoints ? getEndpointName(endpoint) : getImportedEndpointName(endpoint, resolver.options)}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push(
    ...renderWorkspaceParamResolutions({
      replacements: workspaceParamReplacements,
      paramTypes: workspaceParamTypes,
      indent: "  ",
    }),
  );
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.infiniteQuery}({`);
  lines.push(`    ...${queryOptionsName}(${queryOptionsArgs}),`);
  if (hasQueryFnOverride) {
    lines.push("    queryFn: async ({ pageParam, signal }: { pageParam: number; signal: AbortSignal }) => {");
    lines.push(renderAclCheckCall(resolver, endpoint, workspaceParamReplacements, "      "));
    lines.push(`      return ${queryOptionsName}(${queryOptionsArgs}).queryFn({ pageParam, signal });`);
    lines.push("    },");
  }
  lines.push("    ...options,");
  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}
