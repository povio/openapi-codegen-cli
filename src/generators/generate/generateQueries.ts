import { QUERY_OPTIONS_TYPES } from "../const/deps.const";
import { AXIOS_IMPORT } from "../const/endpoints.const";
import { INFINITE_QUERY_PARAMS, QUERY_HOOKS, QUERY_IMPORT } from "../const/query.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getEndpointsImports, getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName, getQueryTypesImportPath } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isInfiniteQuery, isMutation, isQuery } from "../utils/query.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateQueries({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const hasAxiosImport = resolver.options.axiosRequestConfig;

  const queryEndpoints = endpoints.filter(isQuery);
  const infiniteQueryEndpoints = queryEndpoints.filter((endpoint) =>
    isInfiniteQuery(endpoint, Object.values(INFINITE_QUERY_PARAMS)),
  );
  const mutationEndpoints = endpoints.filter(isMutation);

  const queryImport: Import = {
    ...QUERY_IMPORT,
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(resolver.options.infiniteQueries && infiniteQueryEndpoints.length > 0 ? [QUERY_HOOKS.infiniteQuery] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation] : []),
      ...(queryEndpoints.length > 0 && mutationEndpoints.length > 0 ? [QUERY_HOOKS.queryClient] : []),
    ],
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
    axiosImport: AXIOS_IMPORT,
    queryImport,
    queryTypesImport,
    modelsImports,
    endpointsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    endpoints,
    queryEndpoints,
    generateInfiniteQueries: resolver.options.infiniteQueries,
  });
}
