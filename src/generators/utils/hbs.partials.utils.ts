import Handlebars from "handlebars";
import { QUERY_HOOKS } from "../const/query.const";
import { Endpoint } from "../types/endpoint";
import { Import } from "../types/generate";
import { getEndpointConfig } from "./generate.endpoints.utils";
import { getHbsTemplateDelegate } from "./hbs-template.utils";

enum PartialsHelpers {
  IMPORT = "genImport",
  ENDPOINT_PARAMS = "genEndpointParams",
  ENDPOINT_CONFIG = "genEndpointConfig",
  QUERY_KEYS = "genQueryKeys",
  QUERY = "genQuery",
}

export function registerPartialsHbsHelpers() {
  registerImportHelper();
  registerGenerateEndpointParamsHelper();
  registerGenerateEndpointConfigHelper();
  registerGenerateQueryKeysHelper();
  registerGenerateQueryHelper();
}

function registerImportHelper() {
  Handlebars.registerHelper(PartialsHelpers.IMPORT, (genImport: Import) =>
    getHbsTemplateDelegate({ templateName: "import", partialTemplate: true })({ import: genImport }),
  );
}

function registerGenerateEndpointParamsHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_PARAMS, (endpoint: Endpoint) =>
    getHbsTemplateDelegate({ templateName: "endpoint-params", partialTemplate: true })({ endpoint }),
  );
}

function registerGenerateEndpointConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_CONFIG, (endpoint: Endpoint) => {
    const endpointConfig = getEndpointConfig(endpoint);
    if (Object.keys(endpointConfig).length === 0) {
      return "";
    }
    return getHbsTemplateDelegate({ templateName: "endpoint-config", partialTemplate: true })({ endpointConfig });
  });
}

function registerGenerateQueryKeysHelper() {
  Handlebars.registerHelper(PartialsHelpers.QUERY_KEYS, (endpoints: Endpoint[]) => {
    if (endpoints.length === 0) {
      return "";
    }
    return getHbsTemplateDelegate({ templateName: "query-keys", partialTemplate: true })({ endpoints });
  });
}

function registerGenerateQueryHelper() {
  Handlebars.registerHelper(PartialsHelpers.QUERY, (endpoint: Endpoint) => {
    let templateName: string;
    let queryHook: string;

    if (endpoint.method === "get") {
      templateName = "query-use-query";
      queryHook = QUERY_HOOKS.query;
    } else {
      templateName = "query-use-mutation";
      queryHook = QUERY_HOOKS.mutation;
    }

    return getHbsTemplateDelegate({ templateName, partialTemplate: true })({ endpoint, queryHook });
  });
}