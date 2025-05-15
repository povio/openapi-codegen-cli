import Handlebars from "handlebars";
import { CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { INVALIDATE_QUERIES, ZOD_EXTENDED } from "src/generators/const/deps.const";
import { AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "src/generators/const/endpoints.const";
import { BLOB_SCHEMA } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { INFINITE_QUERY_RESPONSE_PARAMS, QUERIES_MODULE_NAME, QUERY_HOOKS } from "../../const/queries.const";
import { Endpoint } from "../../types/endpoint";
import { GenerateZodSchemaData, Import } from "../../types/generate";
import { getEndpointConfig, mapEndpointParamsToFunctionParams } from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isInfiniteQuery, isMutation, isQuery } from "../query.utils";

enum PartialsHelpers {
  ModelJsDocs = "genModelJsDocs",
  Import = "genImport",
  EndpointParams = "genEndpointParams",
  EndpointConfig = "genEndpointConfig",
  EndpointParamSorting = "genEndpointParamSorting",
  QueryKeys = "genQueryKeys",
  Query = "genQuery",
  Mutation = "genMutation",
  InfiniteQuery = "genInfiniteQuery",
  QueryJsDocs = "genQueryJsDocs",
  CaslAbilityType = "genCaslAbilityType",
  CaslAbilityFunction = "genCaslAbilityFunction",
  CaslAbilityQuery = "genCaslAbilityQuery",
}

export function registerPartialsHbsHelpers(resolver: SchemaResolver) {
  registerGenerateModelJsDocsHelper();
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
  registerGenerateEndpointConfigHelper(resolver);
  registerGenerateEndpointParamSortingHelper();
  registerGenerateQueryKeysHelper(resolver);
  registerGenerateQueryHelper(resolver);
  registerGenerateMutationHelper(resolver);
  registerGenerateInfiniteQueryHelper(resolver);
  registerGenerateQueryJsDocsHelper(resolver);
  registerGenerateCaslAbilityTypeHelper();
  registerGenerateCaslAbilityFunctionHelper();
  registerGenerateCaslAbilityQueryHelper();
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
    });
  });
}

function registerGenerateEndpointParamSortingHelper() {
  Handlebars.registerHelper(PartialsHelpers.EndpointParamSorting, (enumSchemaName: string, paramName: string) =>
    getHbsPartialTemplateDelegate("endpoint-param-sorting")({
      enumSchemaName,
      paramName,
      zodExtended: ZOD_EXTENDED.name,
      sortingString: ZOD_EXTENDED.properties.sortingString,
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

    return getHbsPartialTemplateDelegate("query-use-query")({
      endpoint,
      queryHook: QUERY_HOOKS.query,
      hasQueryFn: mapEndpointParamsToFunctionParams(resolver, endpoint).length > 0 || hasAxiosRequestConfig,
      hasAxiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
    });
  });
}

function registerGenerateMutationHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.Mutation, (endpoint: Endpoint) => {
    if (!isMutation(endpoint)) {
      return;
    }

    return getHbsPartialTemplateDelegate("query-use-mutation")({
      endpoint,
      queryHook: QUERY_HOOKS.mutation,
      queriesModuleName: QUERIES_MODULE_NAME,
      hasAxiosRequestConfig: resolver.options.axiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
      hasInvalidateQueryOptions: resolver.options.invalidateQueryOptions,
      invalidateQueryOptionsType: INVALIDATE_QUERIES.optionsType,
    });
  });
}

function registerGenerateInfiniteQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.InfiniteQuery, (endpoint: Endpoint) => {
    if (!resolver.options.infiniteQueries || !isInfiniteQuery(endpoint)) {
      return;
    }

    return getHbsPartialTemplateDelegate("query-use-infinite-query")({
      endpoint,
      infiniteQueryHook: QUERY_HOOKS.infiniteQuery,
      pageParamName: INFINITE_QUERY_RESPONSE_PARAMS.pageParamName,
      totalItemsName: INFINITE_QUERY_RESPONSE_PARAMS.totalItemsName,
      limitParamName: INFINITE_QUERY_RESPONSE_PARAMS.limitParamName,
      hasAxiosRequestConfig: resolver.options.axiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
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
        hasInvalidateQueryOptions: resolver.options.invalidateQueryOptions,
        invalidateQueryOptionsType: INVALIDATE_QUERIES.optionsType,
      }),
  );
}

function registerGenerateCaslAbilityTypeHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityType, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("casl-ability-type")({
      endpoint,
      abilityTupleType: CASL_ABILITY_BINDING.abilityTuple,
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
