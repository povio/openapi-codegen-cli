import { FILE_ACTION_QUERY_OPTIONS, INVALIDATE_QUERIES, QUERY_OPTIONS_TYPES } from "../const/deps.const";
import { AXIOS_DEFAULT_IMPORT_NAME, AXIOS_IMPORT } from "../const/endpoints.const";
import { INFINITE_QUERY_PARAMS, QUERIES_MODULE_NAME, QUERY_HOOKS, QUERY_IMPORT } from "../const/queries.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getEndpointsImports, getModelsImports } from "../utils/generate/generate.imports.utils";
import {
  getFileActionImportPath,
  getInvalidateQueriesImportPath,
  getNamespaceName,
  getQueryTypesImportPath,
} from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isInfiniteQuery, isMutation, isQuery } from "../utils/query.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateQueries({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const hasAxiosDefaultImport = resolver.options.fileActions && endpoints.some(({ fileUpload }) => fileUpload);
  const hasAxiosImport = resolver.options.axiosRequestConfig || hasAxiosDefaultImport;
  const axiosImport: Import = {
    defaultImport: hasAxiosDefaultImport ? AXIOS_DEFAULT_IMPORT_NAME : undefined,
    bindings: resolver.options.axiosRequestConfig ? AXIOS_IMPORT.bindings : [],
    from: AXIOS_IMPORT.from,
  };

  const queryEndpoints = endpoints.filter(isQuery);
  const infiniteQueryEndpoints = queryEndpoints.filter((endpoint) =>
    isInfiniteQuery(endpoint, Object.values(INFINITE_QUERY_PARAMS)),
  );
  const mutationEndpoints = endpoints.filter(isMutation);

  const queryImport: Import = {
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(resolver.options.infiniteQueries && infiniteQueryEndpoints.length > 0 ? [QUERY_HOOKS.infiniteQuery] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation, QUERY_HOOKS.queryClient] : []),
    ],
    from: QUERY_IMPORT.from,
  };

  const hasInvalidateQueriesImport = resolver.options.invalidateQueryOptions && mutationEndpoints.length > 0;
  const invalidateQueriesImport: Import = {
    bindings: Object.values(INVALIDATE_QUERIES),
    from: getInvalidateQueriesImportPath(resolver.options),
  };

  const hasFileActionImport = resolver.options.fileActions && queryEndpoints.some(({ fileDownload }) => fileDownload);
  const fileActionImport: Import = {
    bindings: Object.values(FILE_ACTION_QUERY_OPTIONS),
    from: getFileActionImportPath(resolver.options),
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

  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
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

  const hbsTemplate = getHbsTemplateDelegate(resolver, "queries");

  return hbsTemplate({
    hasAxiosImport,
    axiosImport,
    queryImport,
    hasInvalidateQueriesImport,
    invalidateQueriesImport,
    hasFileActionImport,
    fileActionImport,
    queryTypesImport,
    modelsImports,
    endpointsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    queriesModuleName: QUERIES_MODULE_NAME,
    endpoints,
    queryEndpoints,
    generateInfiniteQueries: resolver.options.infiniteQueries,
  });
}
