import { ACL_CHECK_HOOK } from "@/generators/const/acl.const";
import { MUTATION_EFFECTS, QUERY_MODULE_ENUM, QUERY_OPTIONS_TYPES } from "@/generators/const/deps.const";
import { AXIOS_DEFAULT_IMPORT_NAME, AXIOS_IMPORT, AXIOS_REQUEST_CONFIG_TYPE } from "@/generators/const/endpoints.const";
import { QUERIES_MODULE_NAME, QUERY_HOOKS, QUERY_IMPORT } from "@/generators/const/queries.const";
import { EndpointParameter } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getUniqueArray } from "@/generators/utils/array.utils";
import {
  getAclImports,
  getEndpointsImports,
  getModelsImports,
} from "@/generators/utils/generate/generate.imports.utils";
import {
  getAclCheckImportPath,
  getMutationEffectsImportPath,
  getQueryModulesImportPath,
} from "@/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isInfiniteQuery, isMutation, isQuery } from "@/generators/utils/query.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

export function generateQueries({ resolver, data, tag }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const hasAxiosDefaultImport = endpoints.some(({ mediaUpload }) => mediaUpload);
  const hasAxiosImport = hasAxiosRequestConfig || hasAxiosDefaultImport;
  const axiosImport: Import = {
    defaultImport: hasAxiosDefaultImport ? AXIOS_DEFAULT_IMPORT_NAME : undefined,
    bindings: hasAxiosRequestConfig ? [AXIOS_REQUEST_CONFIG_TYPE] : [],
    from: AXIOS_IMPORT.from,
  };

  const queryEndpoints = endpoints.filter(isQuery);
  const infiniteQueryEndpoints = queryEndpoints.filter((endpoint) => isInfiniteQuery(endpoint, resolver.options));
  const mutationEndpoints = endpoints.filter(isMutation);

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
    bindings: mutationEndpoints.length > 0 ? [MUTATION_EFFECTS.optionsType, MUTATION_EFFECTS.hookName] : [],
    from: getMutationEffectsImportPath(resolver.options),
  };

  const aclEndpoints = endpoints.filter((endpoint) => endpoint.acl);
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
    from: resolver.options.queryTypesImportPath,
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

  const aclImports = getAclImports({
    tag,
    endpoints: aclEndpoints,
    options: resolver.options,
  });

  const hbsTemplate = getHbsTemplateDelegate(resolver, "queries");

  return hbsTemplate({
    hasAxiosImport,
    axiosImport,
    queryImport,
    hasMutationEffects,
    queryModulesImport,
    hasMutationEffectsImport,
    mutationEffectsImport,
    hasAclCheck,
    aclCheckImport,
    queryTypesImport,
    modelsImports,
    endpointsImports,
    aclImports,
    includeNamespace: resolver.options.tsNamespaces,
    tag,
    namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    queriesModuleName: QUERIES_MODULE_NAME,
    queryModuleEnum: QUERY_MODULE_ENUM,
    endpoints,
    queryEndpoints,
  });
}
