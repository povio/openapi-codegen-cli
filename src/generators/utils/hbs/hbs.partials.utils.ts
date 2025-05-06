import Handlebars from "handlebars";
import { CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "src/generators/const/endpoints.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { INFINITE_QUERY_RESPONSE_PARAMS, QUERIES_MODULE_NAME, QUERY_HOOKS } from "../../const/queries.const";
import { Endpoint } from "../../types/endpoint";
import { GenerateZodSchemaData, Import } from "../../types/generate";
import { getEndpointConfig, mapEndpointParamsToFunctionParams } from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isQuery } from "../query.utils";
import { FILE_ACTION_QUERY_OPTIONS, INVALIDATE_QUERIES } from "src/generators/const/deps.const";
import { BLOB_SCHEMA } from "src/generators/const/zod.const";

enum PartialsHelpers {
  ModelJsDocs = "genModelJsDocs",
  Import = "genImport",
  EndpointParams = "genEndpointParams",
  EndpointConfig = "genEndpointConfig",
  QueryKeys = "genQueryKeys",
  Query = "genQuery",
  InfiniteQuery = "genInfiniteQuery",
  QueryJsDocs = "genQueryJsDocs",
  CaslAbilityType = "genCaslAbilityType",
  CaslAbilityFunction = "genCaslAbilityFunction",
}

export function registerPartialsHbsHelpers(resolver: SchemaResolver) {
  registerGenerateModelJsDocsHelper();
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
  registerGenerateEndpointConfigHelper(resolver);
  registerGenerateQueryKeysHelper(resolver);
  registerGenerateQueryHelper(resolver);
  registerGenerateInfiniteQueryHelper(resolver);
  registerGenerateQueryJsDocsHelper(resolver);
  registerGenerateCaslAbilityTypeHelper();
  registerGenerateCaslAbilityFunctionHelper();
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
      hasFileDownload: resolver.options.fileActions && endpoint.fileDownload,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
    });
  });
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
    let templateName: string;
    let queryHook: string;

    if (isQuery(endpoint)) {
      templateName = "query-use-query";
      queryHook = QUERY_HOOKS.query;
    } else {
      templateName = "query-use-mutation";
      queryHook = QUERY_HOOKS.mutation;
    }

    const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
    const hasFileDownload = resolver.options.fileActions && endpoint.fileDownload;

    return getHbsPartialTemplateDelegate(templateName)({
      endpoint,
      queryHook,
      queriesModuleName: QUERIES_MODULE_NAME,
      hasQueryFn:
        mapEndpointParamsToFunctionParams(resolver, endpoint).length > 0 || hasAxiosRequestConfig || hasFileDownload,
      hasAxiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
      hasInvalidateQueryOptions: resolver.options.invalidateQueryOptions,
      invalidateQueryOptionsType: INVALIDATE_QUERIES.optionsType,
      hasFileActionQueryOptions: resolver.options.fileActions && endpoint.fileDownload,
      fileActionQueryOptionsType: FILE_ACTION_QUERY_OPTIONS.optionsType,
      hasFileUpload: resolver.options.fileActions && endpoint.fileUpload,
      hasFileDownload,
    });
  });
}

function registerGenerateInfiniteQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.InfiniteQuery, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("query-use-infinite-query")({
      endpoint,
      infiniteQueryHook: QUERY_HOOKS.infiniteQuery,
      pageParamName: INFINITE_QUERY_RESPONSE_PARAMS.pageParamName,
      totalItemsName: INFINITE_QUERY_RESPONSE_PARAMS.totalItemsName,
      limitParamName: INFINITE_QUERY_RESPONSE_PARAMS.limitParamName,
      hasAxiosRequestConfig: resolver.options.axiosRequestConfig,
      axiosRequestConfigName: AXIOS_REQUEST_CONFIG_NAME,
      axiosRequestConfigType: AXIOS_REQUEST_CONFIG_TYPE,
    }),
  );
}

function registerGenerateQueryJsDocsHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(
    PartialsHelpers.QueryJsDocs,
    (endpoint: Endpoint, options: { hash: { infiniteQuery?: boolean } }) =>
      getHbsPartialTemplateDelegate("query-js-docs")({
        endpoint,
        infiniteQuery: options.hash.infiniteQuery,
        hasInvalidateQueryOptions: resolver.options.invalidateQueryOptions,
        invalidateQueryOptionsType: INVALIDATE_QUERIES.optionsType,
        hasFileActionQueryOptions: resolver.options.fileActions && endpoint.fileDownload,
        fileActionQueryOptionsType: FILE_ACTION_QUERY_OPTIONS.optionsType,
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
