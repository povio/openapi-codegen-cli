import Handlebars from "handlebars";
import { ACL_CHECK_HOOK, CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { MUTATION_EFFECTS, ZOD_EXTENDED } from "src/generators/const/deps.const";
import { AXIOS_REQUEST_CONFIG_NAME, AXIOS_REQUEST_CONFIG_TYPE } from "src/generators/const/endpoints.const";
import { BLOB_SCHEMA } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { INFINITE_QUERY_RESPONSE_PARAMS, QUERIES_MODULE_NAME, QUERY_HOOKS } from "../../const/queries.const";
import { Endpoint, EndpointParameter } from "../../types/endpoint";
import { GenerateZodSchemaData, Import } from "../../types/generate";
import { getAbilityConditionsTypes, hasAbilityConditions } from "../generate/generate.acl.utils";
import {
  getEndpointConfig,
  getUpdateQueryEndpoints,
  mapEndpointParamsToFunctionParams,
} from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isInfiniteQuery, isMutation, isQuery } from "../query.utils";
import { isNamedZodSchema } from "../zod-schema.utils";

enum PartialsHelpers {
  ModelJsDocs = "genModelJsDocs",
  Import = "genImport",
  EndpointParams = "genEndpointParams",
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
  AclCheckParams = "genAclCheckParams",
}

export function registerPartialsHbsHelpers(resolver: SchemaResolver) {
  registerGenerateModelJsDocsHelper();
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
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
  registerGenerateAclCheckParamsHelper();
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
      zodExtended: ZOD_EXTENDED.name,
      sortingString: ZOD_EXTENDED.properties.sortingString,
      parse: ZOD_EXTENDED.properties.parse,
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
      hasAclCheck,
      aclCheckHook: ACL_CHECK_HOOK,
    });
  });
}

function registerGenerateInfiniteQueryHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.InfiniteQuery, (endpoint: Endpoint) => {
    if (!resolver.options.infiniteQueries || !isInfiniteQuery(endpoint)) {
      return;
    }

    const hasAclCheck = resolver.options.checkAcl && endpoint.acl;

    return getHbsPartialTemplateDelegate("query-use-infinite-query")({
      endpoint,
      infiniteQueryHook: QUERY_HOOKS.infiniteQuery,
      hasQueryFnBody: hasAclCheck,
      pageParamName: INFINITE_QUERY_RESPONSE_PARAMS.pageParamName,
      totalItemsName: INFINITE_QUERY_RESPONSE_PARAMS.totalItemsName,
      limitParamName: INFINITE_QUERY_RESPONSE_PARAMS.limitParamName,
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

function registerGenerateAclCheckParamsHelper() {
  Handlebars.registerHelper(PartialsHelpers.AclCheckParams, (endpoint: Endpoint) => {
    const checkParams = getAbilityConditionsTypes(endpoint)?.map((condition) => condition.name);
    const params = endpoint.parameters.map((param) => param.name);
    const hasAllCheckParams = checkParams?.every((param) => params.includes(param));

    return getHbsPartialTemplateDelegate("acl-check-params")({
      endpoint,
      generateAclCheckParams: hasAbilityConditions(endpoint) && hasAllCheckParams,
    });
  });
}
