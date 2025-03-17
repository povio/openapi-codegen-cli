import Handlebars from "handlebars";
import { CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { QUERY_HOOKS } from "../../const/query.const";
import { Endpoint } from "../../types/endpoint";
import { Import } from "../../types/generate";
import { getEndpointConfig } from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isQuery } from "../queries.utils";

enum PartialsHelpers {
  Import = "genImport",
  EndpointParams = "genEndpointParams",
  EndpointConfig = "genEndpointConfig",
  QueryKeys = "genQueryKeys",
  Query = "genQuery",
  CaslAbilityType = "genCaslAbilityType",
  CaslAbilityFunction = "genCaslAbilityFunction",
}

export function registerPartialsHbsHelpers() {
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
  registerGenerateEndpointConfigHelper();
  registerGenerateQueryKeysHelper();
  registerGenerateQueryHelper();
  registerGenerateCaslAbilityTypeHelper();
  registerGenerateCaslAbilityFunctionHelper();
}

function registerImportHelper() {
  Handlebars.registerHelper(PartialsHelpers.Import, (genImport: Import) =>
    getHbsPartialTemplateDelegate("import")({ import: genImport }),
  );
}

function registerGenerateEndpointParamsHelper() {
  Handlebars.registerHelper(PartialsHelpers.EndpointParams, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("endpoint-params")({ endpoint }),
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

function registerGenerateQueryKeysHelper() {
  Handlebars.registerHelper(PartialsHelpers.QueryKeys, (queryEndpoints: Endpoint[], namespace: string) => {
    if (queryEndpoints.length === 0) {
      return "";
    }
    return getHbsPartialTemplateDelegate("query-keys")({ queryEndpoints, namespace });
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

function registerGenerateCaslAbilityTypeHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityType, (endpoint: Endpoint) => {
    return getHbsPartialTemplateDelegate("casl-ability-type")({
      endpoint,
      abilityTupleType: CASL_ABILITY_BINDING.abilityTuple,
    });
  });
}

function registerGenerateCaslAbilityFunctionHelper() {
  Handlebars.registerHelper(PartialsHelpers.CaslAbilityFunction, (endpoint: Endpoint) => {
    return getHbsPartialTemplateDelegate("casl-ability-function")({ endpoint });
  });
}
