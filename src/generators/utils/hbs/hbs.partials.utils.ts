import Handlebars from "handlebars";
import { CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { INFINITE_QUERY_PARAMS, QUERY_HOOKS } from "../../const/query.const";
import { Endpoint } from "../../types/endpoint";
import { GenerateZodSchemaData, Import } from "../../types/generate";
import { getEndpointConfig } from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isQuery } from "../queries.utils";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";

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
  registerGenerateEndpointConfigHelper();
  registerGenerateQueryKeysHelper(resolver);
  registerGenerateQueryHelper();
  registerGenerateInfiniteQueryHelper();
  registerGenerateQueryJsDocsHelper();
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
    (endpoint: Endpoint, extra?: "removePageParam" | "replacePageParam") =>
      getHbsPartialTemplateDelegate("endpoint-params")({ endpoint, extra }),
  );
}

function registerGenerateEndpointConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.EndpointConfig, (endpoint: Endpoint) => {
    const endpointConfig = getEndpointConfig(endpoint);
    if (Object.keys(endpointConfig).length === 0) {
      return "";
    }
    return getHbsPartialTemplateDelegate("endpoint-config")({ endpointConfig });
  });
}

function registerGenerateQueryKeysHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(PartialsHelpers.QueryKeys, (queryEndpoints: Endpoint[], namespace: string) => {
    if (queryEndpoints.length === 0) {
      return "";
    }
    return getHbsPartialTemplateDelegate("query-keys")({
      queryEndpoints,
      namespace,
      generateInfiniteQueries: resolver.options.infiniteQueries,
    });
  });
}

function registerGenerateQueryHelper() {
  Handlebars.registerHelper(PartialsHelpers.Query, (endpoint: Endpoint, queryEndpoints: Endpoint[]) => {
    let templateName: string;
    let queryHook: string;

    if (isQuery(endpoint)) {
      templateName = "query-use-query";
      queryHook = QUERY_HOOKS.query;
    } else {
      templateName = "query-use-mutation";
      queryHook = QUERY_HOOKS.mutation;
    }

    return getHbsPartialTemplateDelegate(templateName)({ endpoint, queryEndpoints, queryHook });
  });
}

function registerGenerateInfiniteQueryHelper() {
  Handlebars.registerHelper(PartialsHelpers.InfiniteQuery, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("query-use-infinite-query")({
      endpoint,
      infiniteQueryHook: QUERY_HOOKS.infiniteQuery,
      pageParamName: INFINITE_QUERY_PARAMS.pageParamName,
      totalItemsName: INFINITE_QUERY_PARAMS.totalItemsName,
      limitParamName: INFINITE_QUERY_PARAMS.limitParamName,
    }),
  );
}

function registerGenerateQueryJsDocsHelper() {
  Handlebars.registerHelper(PartialsHelpers.QueryJsDocs, (endpoint: Endpoint, extra?: "infiniteQuery") =>
    getHbsPartialTemplateDelegate("query-js-docs")({ endpoint, infiniteQuery: extra === "infiniteQuery" }),
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
