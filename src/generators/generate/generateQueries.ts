import { QUERY_HOOKS, QUERY_IMPORT } from "../const/query.const";
import { QUERY_OPTIONS_TYPES } from "../const/deps.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "../types/generate";
import { getUniqueArray } from "../utils/array.utils";
import { getEndpointsImports, getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isMutation, isQuery } from "../utils/queries.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";
import { getQueryTypesImportPath } from "../utils/deps.utils";

export function generateQueries({ resolver, data, tag = "" }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const queryEndpoints = endpoints.filter(isQuery);
  const mutationEndpoints = endpoints.filter(isMutation);

  const queryImport: Import = {
    ...QUERY_IMPORT,
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation] : []),
      ...(queryEndpoints.length > 0 && mutationEndpoints.length > 0 ? [QUERY_HOOKS.queryClient] : []),
    ],
  };

  const queryTypesImport: Import = {
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.query] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_OPTIONS_TYPES.mutation] : []),
    ],
    from: getQueryTypesImportPath(resolver.options),
  };

  const endpointParams = [...queryEndpoints, ...mutationEndpoints].reduce(
    (prev, curr) => [...prev, ...curr.parameters],
    [] as EndpointParameter[],
  );
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
    queryImport,
    queryTypesImport,
    modelsImports,
    endpointsImports,
    includeNamespace: resolver.options.includeNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    endpoints,
    queryEndpoints,
  });
}
