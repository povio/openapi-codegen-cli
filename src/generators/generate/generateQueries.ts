import { ACL_CHECK_HOOK } from "@/generators/const/acl.const";
import { MUTATION_EFFECTS, QUERY_MODULE_ENUM, QUERY_OPTIONS_TYPES } from "@/generators/const/deps.const";
import {
  AXIOS_DEFAULT_IMPORT_NAME,
  AXIOS_IMPORT,
  AXIOS_REQUEST_CONFIG_NAME,
  AXIOS_REQUEST_CONFIG_TYPE,
} from "@/generators/const/endpoints.const";
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
  getEndpointName,
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
} from "@/generators/utils/generate/generate.endpoints.utils";
import { getSchemaDescriptions } from "@/generators/utils/generate/generate.openapi.utils";
import {
  getAclImports,
  getEndpointsImports,
  getModelsImports,
} from "@/generators/utils/generate/generate.imports.utils";
import { getInfiniteQueryName, getQueryName } from "@/generators/utils/generate/generate.query.utils";
import {
  getAclCheckImportPath,
  getMutationEffectsImportPath,
  getQueryModulesImportPath,
  getQueryTypesImportPath,
} from "@/generators/utils/generate/generate.utils";
import { getImportedZodSchemaInferedTypeName } from "@/generators/utils/generate/generate.zod.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isSchemaObject } from "@/generators/utils/openapi-schema.utils";
import { isParamMediaTypeAllowed } from "@/generators/utils/openapi.utils";
import { getDestructuredVariables, isInfiniteQuery, isMutation, isQuery } from "@/generators/utils/query.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

const endpointParamMappingCache = new WeakMap<
  SchemaResolver,
  WeakMap<Endpoint, Map<string, ReturnType<typeof mapEndpointParamsToFunctionParams>>>
>();

export function generateQueries(params: GenerateTypeParams) {
  const { resolver, data, tag } = params;
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
      ...(queryEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.query] : []),
      ...(resolver.options.infiniteQueries && infiniteQueryEndpoints.length > 0
        ? [QUERY_OPTIONS_TYPES.infiniteQuery]
        : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.mutation] : []),
    ],
    from: getQueryTypesImportPath(resolver.options),
  };

  const endpointParams = endpoints.flatMap((endpoint) => endpoint.parameters) as EndpointParameter[];
  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemasAsTypes: getUniqueArray(endpointParams.map((param) => param.zodSchema).filter(isNamedZodSchema)),
  });

  const endpointsImports = getEndpointsImports({
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

  lines.push(
    `export const ${QUERIES_MODULE_NAME} = ${hasMutationEffects ? `${QUERY_MODULE_ENUM}.${tag}` : `"${namespace}"`};`,
  );
  lines.push("");

  lines.push(renderQueryKeys({ resolver, queryEndpoints }));
  lines.push("");

  for (const endpoint of endpoints) {
    const endpointInfo = endpointGroups.infoByEndpoint.get(endpoint);
    if (endpointInfo?.query) {
      lines.push(renderQuery({ resolver, endpoint }));
      lines.push("");
    }
    if (endpointInfo?.mutation) {
      lines.push(
        renderMutation({
          resolver,
          endpoint,
          precomputed: endpointGroups.mutationDataByEndpoint.get(endpoint),
        }),
      );
      lines.push("");
    }
    if (endpointInfo?.infiniteQuery) {
      lines.push(renderInfiniteQuery({ resolver, endpoint }));
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
) {
  return getEndpointParamMapping(resolver, endpoint, options)
    .map((param) => param.name)
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

function renderAclCheckCall(resolver: SchemaResolver, endpoint: Endpoint) {
  const checkParams = getAbilityConditionsTypes(endpoint)?.map((condition) => condition.name);
  const paramNames = new Set(endpoint.parameters.map((param) => param.name));
  const hasAllCheckParams = checkParams?.every((param) => paramNames.has(param));
  const args = hasAbilityConditions(endpoint) && hasAllCheckParams ? `{ ${(checkParams ?? []).join(", ")} } ` : "";
  return `checkAcl(${getImportedAbilityFunctionName(endpoint, resolver.options)}(${args}));`;
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

function renderQuery({ resolver, endpoint }: { resolver: SchemaResolver; endpoint: Endpoint }) {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const endpointParams = renderEndpointParams(resolver, endpoint, {});
  const hasQueryFn = endpointArgs.length > 0 || hasAxiosRequestConfig || hasAclCheck;
  const hasQueryFnBody = Boolean(hasAclCheck);
  const importedEndpoint = getImportedEndpointName(endpoint, resolver.options);

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "query" }));
  lines.push(
    `export const ${getQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgs} }: { ${endpointParams} }, ` : ""}options?: AppQueryOptions<typeof ${importedEndpoint}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push("  ");
  lines.push(`  return ${QUERY_HOOKS.query}({`);
  lines.push(`    queryKey: keys.${getEndpointName(endpoint)}(${endpointArgs}),`);
  if (hasQueryFn) {
    lines.push(`    queryFn: () => ${hasQueryFnBody ? "{ " : ""}`);
    if (hasAclCheck) {
      lines.push(`    ${renderAclCheckCall(resolver, endpoint)}`);
    }
    lines.push(
      `    ${hasQueryFnBody ? "return " : ""}${importedEndpoint}(${endpointArgs}${hasAxiosRequestConfig ? `${endpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""})${hasQueryFnBody ? " }" : ""},`,
    );
  } else {
    lines.push(`    queryFn: ${importedEndpoint},`);
  }
  lines.push("    ...options,");
  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}

function renderMutation({
  resolver,
  endpoint,
  precomputed,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  precomputed?: { updateQueryEndpoints: Endpoint[]; destructuredVariables: string[] };
}) {
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const hasMutationEffects = resolver.options.mutationEffects;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const endpointParams = renderEndpointParams(resolver, endpoint, { includeFileParam: true });
  const endpointArgs = renderEndpointArgs(resolver, endpoint, {});
  const destructuredMutationArgs = renderEndpointArgs(resolver, endpoint, { includeFileParam: true });
  const importedEndpoint = getImportedEndpointName(endpoint, resolver.options);

  const updateQueryEndpoints = precomputed?.updateQueryEndpoints ?? [];
  const destructuredVariables =
    precomputed?.destructuredVariables ?? getDestructuredVariables(resolver, endpoint, updateQueryEndpoints);
  const hasMutationFnBody = endpoint.mediaUpload || hasAclCheck;

  const mutationVariablesType = endpoint.mediaUpload
    ? `${endpointParams}${endpointParams ? "; " : ""}abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void`
    : endpointParams;

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "mutation" }));
  lines.push(
    `export const ${getQueryName(endpoint, true)} = (options?: AppMutationOptions<typeof ${importedEndpoint}, { ${mutationVariablesType} }>${hasMutationEffects ? ` & ${MUTATION_EFFECTS.optionsType}` : ""}${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
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
  if (hasAclCheck) {
    lines.push(`      ${renderAclCheckCall(resolver, endpoint)}`);
  }
  if (endpoint.mediaUpload) {
    lines.push(
      `      const uploadInstructions = await ${importedEndpoint}(${endpointArgs}${hasAxiosRequestConfig ? `${endpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""});`,
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
      `      ${hasMutationFnBody ? "return " : ""}${importedEndpoint}(${endpointArgs}${hasAxiosRequestConfig ? `${endpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""})`,
    );
  }
  if (hasMutationFnBody) {
    lines.push("    },");
  } else {
    lines.push(",");
  }

  lines.push("    ...options,");
  if (hasMutationEffects) {
    lines.push("    onSuccess: async (resData, variables, onMutateResult, context) => {");
    if (updateQueryEndpoints.length > 0) {
      if (destructuredVariables.length > 0) {
        lines.push(`      const { ${destructuredVariables.join(", ")} } = variables;`);
      }
      lines.push(
        `      const updateKeys = [${updateQueryEndpoints
          .map(
            (e) =>
              `keys.${getEndpointName(e)}(${renderEndpointArgs(resolver, e, {
                includeOnlyRequiredParams: true,
              })})`,
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
    const infiniteQuery = resolver.options.infiniteQueries && query && isInfiniteQuery(endpoint, resolver.options);

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

function renderInfiniteQuery({ resolver, endpoint }: { resolver: SchemaResolver; endpoint: Endpoint }) {
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const endpointParams = renderEndpointParams(resolver, endpoint, { excludePageParam: true });
  const endpointArgsWithoutPage = renderEndpointArgs(resolver, endpoint, { excludePageParam: true });
  const endpointArgsWithPage = renderEndpointArgs(resolver, endpoint, { replacePageParam: true });
  const importedEndpoint = getImportedEndpointName(endpoint, resolver.options);
  const hasQueryFnBody = Boolean(hasAclCheck);

  const lines: string[] = [];
  lines.push(renderQueryJsDocs({ resolver, endpoint, mode: "infiniteQuery" }));
  lines.push(
    `export const ${getInfiniteQueryName(endpoint)} = <TData>(${endpointParams ? `{ ${endpointArgsWithoutPage} }: { ${endpointParams} }, ` : ""}options?: AppInfiniteQueryOptions<typeof ${importedEndpoint}, TData>${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}?: ${AXIOS_REQUEST_CONFIG_TYPE}` : ""}) => {`,
  );
  if (hasAclCheck) {
    lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  }
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.infiniteQuery}({`);
  lines.push(`    queryKey: keys.${getEndpointName(endpoint)}Infinite(${endpointArgsWithoutPage}),`);
  lines.push(`    queryFn: ({ pageParam }) => ${hasQueryFnBody ? "{ " : ""}`);
  if (hasAclCheck) {
    lines.push(`    ${renderAclCheckCall(resolver, endpoint)}`);
  }
  lines.push(
    `    ${hasQueryFnBody ? "return " : ""}${importedEndpoint}(${endpointArgsWithPage}${hasAxiosRequestConfig ? `, ${AXIOS_REQUEST_CONFIG_NAME}` : ""})${hasQueryFnBody ? " }" : ""},`,
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
  lines.push("  });");
  lines.push("};");
  return lines.join("\n");
}
