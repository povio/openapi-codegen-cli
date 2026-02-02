import Handlebars from "handlebars";
import { ACL_CHECK_HOOK, CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { MUTATION_EFFECTS, ZOD_EXTENDED } from "src/generators/const/deps.const";
import { AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "src/generators/const/endpoints.const";
import { QUERIES_MODULE_NAME, QUERY_HOOKS } from "src/generators/const/queries.const";
import { BLOB_SCHEMA } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { DynamicColumnsConfig, DynamicInputsConfig } from "src/generators/types/builder-config";
import { Endpoint, EndpointParameter } from "src/generators/types/endpoint";
import { GenerateZodSchemaData, Import } from "src/generators/types/generate";
import { getAbilityConditionsTypes, hasAbilityConditions } from "src/generators/utils/generate/generate.acl.utils";
import {
  getEndpointBody,
  getEndpointConfig,
  getUpdateQueryEndpoints,
  hasEndpointConfig,
  mapEndpointParamsToFunctionParams,
  requiresBody,
} from "src/generators/utils/generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { getDestructuredVariables, isInfiniteQuery, isMutation, isQuery } from "src/generators/utils/query.utils";
import { isNamedZodSchema } from "src/generators/utils/zod-schema.utils";

enum PartialsHelpers {
  ModelJsDocs = "genModelJsDocs",
  Import = "genImport",
  EndpointParams = "genEndpointParams",
  HasUndefinedEndpointBody = "hasUndefinedEndpointBody",
  EndpointConfig = "genEndpointConfig",
  EndpointParamParse = "genEndpointParamParse",
  QueryKeys = "genQueryKeys",
  Query = "genQuery",
  Mutation = "genMutation",
  InfiniteQuery = "genInfiniteQuery",
  QueryJsDocs = "genQueryJsDocs",
  CaslAbilityType = "genCaslAbilityType",
  CaslAbilityFunction = "genCaslAbilityFunction",
  CaslAbilityQuery = "genCaslAbilityQuery",
  AclCheckCall = "genAclCheckCall",
  InputsConfig = "genInputsConfig",
  ColumnsConfig = "genColumnsConfig",
}

export function registerPartialsHbsHelpers(resolver: SchemaResolver) {
  registerGenerateModelJsDocsHelper();
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
  registerHasUndefinedEndpointBodyHelper(resolver);
  registerGenerateEndpointConfigHelper(resolver);
  registerGenerateEndpointParamParseHelper();
  registerGenerateQueryKeysHelper(resolver);
  registerGenerateQueryHelper(resolver);
  registerGenerateMutationHelper(resolver);
  registerGenerateInfiniteQueryHelper(resolver);
  registerGenerateQueryJsDocsHelper(resolver);
  registerGenerateCaslAbilityTypeHelper();
  registerGenerateCaslAbilityFunctionHelper();
  registerGenerateCaslAbilityQueryHelper();
  registerGenerateAclCheckCallHelper();
  registerGenerateInputsConfigHelper();
  registerGenerateColumnsConfigHelper();
}

function registerGenerateModelJsDocsHelper() {
  Handlebars.registerHelper(
    PartialsHelpers.ModelJsDocs,
    (name: string, zodSchema: GenerateZodSchemaData, tag: string) =>
      getHbsPartialTemplateDelegate("model-js-docs")({ name, zodSchema, tag }),
  );
}

function registerImportHelper() {
  Handlebars.registerHelper(PartialsHelpers.Import, (genImport: Import) =>
    getHbsPartialTemplateDelegate("import")({ import: genImport }),
  );
}

function registerGenerateEndpointParamsHelper() {
  Handlebars.registerHelper(
    PartialsHelpers.EndpointParams,
    (endpoint: Endpoint, options: { hash: Parameters<typeof mapEndpointParamsToFunctionParams>[2] }) =>
      getHbsPartialTemplateDelegate("endpoint-params")({ endpoint, options }),
  );
}

function registerHasUndefinedEndpointBodyHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(
    PartialsHelpers.HasUndefinedEndpointBody,
    (endpoint: Endpoint) =>
      requiresBody(endpoint) && !getEndpointBody(endpoint) && hasEndpointConfig(endpoint, resolver),
  );
}

function registerGenerateEndpointConfigHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.EndpointConfig, (endpoint: Endpoint) => {
    const endpointConfig = getEndpointConfig(endpoint);
    const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
    if (Object.keys(endpointConfig).length === 0) {
      return hasAxiosRequestConfig ? AXIOS_REQUEST_CONFIG_NAME : "";
    }

    return getHbsPartialTemplateDelegate("endpoint-config")({
      endpointConfig,
      hasAxiosRequestConfig,
      hasBlobResponse: endpoint.response === BLOB_SCHEMA,
      hasFileDownload: endpoint.mediaDownload,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      generateParse: resolver.options.parseRequestParams,
    });
  });
}

function registerGenerateEndpointParamParseHelper() {
  Handlebars.registerHelper(PartialsHelpers.EndpointParamParse, (param: EndpointParameter, paramName: string) =>
    getHbsPartialTemplateDelegate("endpoint-param-parse")({
      param,
      paramName,
      isQuery: param.type === "Query",
      zodExtendedNamespace: ZOD_EXTENDED.namespace,
      parse: ZOD_EXTENDED.exports.parse,
      sortExp: ZOD_EXTENDED.exports.sortExp,
      addOptional:
        !(param.parameterObject ?? param.bodyObject)?.required &&
        (param.parameterSortingEnumSchemaName || isNamedZodSchema(param.zodSchema)),
    }),
  );
}

function registerGenerateQueryKeysHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.QueryKeys, (queryEndpoints: Endpoint[]) => {
    if (queryEndpoints.length === 0) {
      return "";
    }

    return getHbsPartialTemplateDelegate("query-keys")({
      queryEndpoints,
      queriesModuleName: QUERIES_MODULE_NAME,
      generateInfiniteQueries: resolver.options.infiniteQueries,
    });
  });
}

function registerGenerateQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.Query, (endpoint: Endpoint) => {
    if (!isQuery(endpoint)) {
      return;
    }

    const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
    const hasAclCheck = resolver.options.checkAcl && endpoint.acl;

    return getHbsPartialTemplateDelegate("query-use-query")({
      endpoint,
      queryHook: QUERY_HOOKS.query,
      hasQueryFn:
        mapEndpointParamsToFunctionParams(resolver, endpoint).length > 0 || hasAxiosRequestConfig || hasAclCheck,
      hasQueryFnBody: hasAclCheck,
      hasAxiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
      hasAclCheck,
      aclCheckHook: ACL_CHECK_HOOK,
    });
  });
}

function registerGenerateMutationHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.Mutation, (endpoint: Endpoint, queryEndpoints: Endpoint[]) => {
    if (!isMutation(endpoint)) {
      return;
    }

    const updateQueryEndpoints = getUpdateQueryEndpoints(endpoint, queryEndpoints);
    const destructuredVariables = getDestructuredVariables(resolver, endpoint, updateQueryEndpoints);
    const hasAclCheck = resolver.options.checkAcl && endpoint.acl;

    return getHbsPartialTemplateDelegate("query-use-mutation")({
      endpoint,
      queryHook: QUERY_HOOKS.mutation,
      queriesModuleName: QUERIES_MODULE_NAME,
      hasAxiosRequestConfig: resolver.options.axiosRequestConfig,
      hasMutationFnBody: endpoint.mediaUpload || hasAclCheck,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
      hasMutationEffects: resolver.options.mutationEffects,
      mutationEffectsType: MUTATION_EFFECTS.optionsType,
      updateQueryEndpoints,
      destructuredVariables,
      hasAclCheck,
      aclCheckHook: ACL_CHECK_HOOK,
    });
  });
}

function registerGenerateInfiniteQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.InfiniteQuery, (endpoint: Endpoint) => {
    if (!resolver.options.infiniteQueries || !isInfiniteQuery(endpoint, resolver.options)) {
      return;
    }

    const hasAclCheck = resolver.options.checkAcl && endpoint.acl;

    return getHbsPartialTemplateDelegate("query-use-infinite-query")({
      endpoint,
      infiniteQueryHook: QUERY_HOOKS.infiniteQuery,
      hasQueryFnBody: hasAclCheck,
      pageParamName: resolver.options.infiniteQueryResponseParamNames.page,
      totalItemsName: resolver.options.infiniteQueryResponseParamNames.totalItems,
      limitParamName: resolver.options.infiniteQueryResponseParamNames.limit,
      hasAxiosRequestConfig: resolver.options.axiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
      hasAclCheck,
      aclCheckHook: ACL_CHECK_HOOK,
    });
  });
}

function registerGenerateQueryJsDocsHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(
    PartialsHelpers.QueryJsDocs,
    (endpoint: Endpoint, options: { hash: { query?: boolean; mutation?: boolean; infiniteQuery?: boolean } }) =>
      getHbsPartialTemplateDelegate("query-js-docs")({
        endpoint,
        query: options.hash.query,
        mutation: options.hash.mutation,
        infiniteQuery: options.hash.infiniteQuery,
        hasMutationEffects: resolver.options.mutationEffects,
        mutationEffectsType: MUTATION_EFFECTS.optionsType,
      }),
  );
}

function registerGenerateCaslAbilityTypeHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityType, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("casl-ability-type")({
      endpoint,
      abilityTuple: CASL_ABILITY_BINDING.abilityTuple,
    }),
  );
}

function registerGenerateCaslAbilityFunctionHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityFunction, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("casl-ability-function")({ endpoint }),
  );
}

function registerGenerateCaslAbilityQueryHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityQuery, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("casl-ability-query")({ endpoint }),
  );
}

function registerGenerateAclCheckCallHelper() {
  Handlebars.registerHelper(PartialsHelpers.AclCheckCall, (endpoint: Endpoint) => {
    const checkParams = getAbilityConditionsTypes(endpoint)?.map((condition) => condition.name);
    const params = new Set(endpoint.parameters.map((param) => param.name));
    const hasAllCheckParams = checkParams?.every((param) => params.has(param));

    return getHbsPartialTemplateDelegate("acl-check-call")({
      endpoint,
      generateAclCheckParams: hasAbilityConditions(endpoint) && hasAllCheckParams,
    });
  });
}

function registerGenerateInputsConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.InputsConfig, (inputsConfig: DynamicInputsConfig) =>
    getHbsPartialTemplateDelegate("inputs-config")({ inputsConfig }),
  );
}

function registerGenerateColumnsConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.ColumnsConfig, (columnsConfig: DynamicColumnsConfig) =>
    getHbsPartialTemplateDelegate("columns-config")({ columnsConfig }),
  );
}
