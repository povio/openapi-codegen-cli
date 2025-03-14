import Handlebars from "handlebars";
import { CASL_ABILITY_BINDING } from "src/generators/const/acl.const";
import { QUERY_HOOKS } from "../../const/query.const";
import { Endpoint } from "../../types/endpoint";
import { Import } from "../../types/generate";
import { getEndpointConfig } from "../generate/generate.endpoints.utils";
import { getHbsPartialTemplateDelegate } from "../hbs/hbs-template.utils";
import { isQuery } from "../queries.utils";

enum PartialsHelpers {
  IMPORT = "genImport",
  ENDPOINT_PARAMS = "genEndpointParams",
  ENDPOINT_CONFIG = "genEndpointConfig",
  QUERY_KEYS = "genQueryKeys",
  QUERY = "genQuery",
  CASL_ABILITY_TYPE = "genCaslAbilityType",
  CASL_ABILITY_FUNCTION = "genCaslAbilityFunction",
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
  Handlebars.registerHelper(PartialsHelpers.IMPORT, (genImport: Import) =>
    getHbsPartialTemplateDelegate("import")({ import: genImport }),
  );
}

function registerGenerateEndpointParamsHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_PARAMS, (endpoint: Endpoint) =>
    getHbsPartialTemplateDelegate("endpoint-params")({ endpoint }),
  );
}

function registerGenerateEndpointConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_CONFIG, (endpoint: Endpoint) => {
    const endpointConfig = getEndpointConfig(endpoint);
    if (Object.keys(endpointConfig).length === 0) {
      return "";
    }
    return getHbsPartialTemplateDelegate("endpoint-config")({ endpointConfig });
  });
}

function registerGenerateQueryKeysHelper() {
  Handlebars.registerHelper(PartialsHelpers.QUERY_KEYS, (endpoints: Endpoint[]) => {
    if (endpoints.length === 0) {
      return "";
    }
    return getHbsPartialTemplateDelegate("query-keys")({ endpoints });
  });
}

function registerGenerateQueryHelper() {
  Handlebars.registerHelper(PartialsHelpers.QUERY, (endpoint: Endpoint, endpoints: Endpoint[]) => {
    let templateName: string;
    let queryHook: string;

    if (isQuery(endpoint)) {
      templateName = "query-use-query";
      queryHook = QUERY_HOOKS.query;
    } else {
      templateName = "query-use-mutation";
      queryHook = QUERY_HOOKS.mutation;
    }

    return getHbsPartialTemplateDelegate(templateName)({ endpoint, endpoints, queryHook });
  });
}

function registerGenerateCaslAbilityTypeHelper() {
  Handlebars.registerHelper(PartialsHelpers.CASL_ABILITY_TYPE, (endpoint: Endpoint) => {
    return getHbsPartialTemplateDelegate("casl-ability-type")({
      endpoint,
      abilityTupleType: CASL_ABILITY_BINDING.abilityTuple,
    });
  });
}

function registerGenerateCaslAbilityFunctionHelper() {
  Handlebars.registerHelper(PartialsHelpers.CASL_ABILITY_FUNCTION, (endpoint: Endpoint) => {
    return getHbsPartialTemplateDelegate("casl-ability-function")({ endpoint });
  });
}
