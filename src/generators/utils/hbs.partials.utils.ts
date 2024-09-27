import Handlebars from "handlebars";
import { DEFAULT_HEADERS } from "../const/endpoints.const";
import { QUERY_HOOKS } from "../const/query.const";
import { Endpoint } from "../types/endpoint";
import { Import } from "../types/import";
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
  Handlebars.registerHelper(PartialsHelpers.IMPORT, (tsImport: Import) =>
    getHbsTemplateDelegate({ templateName: "import", partialTemplate: true })({ import: tsImport }),
  );
}

function registerGenerateEndpointParamsHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_PARAMS, (endpoint: Endpoint) =>
    getHbsTemplateDelegate({ templateName: "endpoint-params", partialTemplate: true })({ endpoint }),
  );
}

function registerGenerateEndpointConfigHelper() {
  Handlebars.registerHelper(PartialsHelpers.ENDPOINT_CONFIG, (endpoint: Endpoint) => {
    const params = endpoint.parameters.filter((param) => param.type === "Query");
    const headers = {
      ...(endpoint.requestFormat !== DEFAULT_HEADERS["Content-Type"] ? { "Content-Type": endpoint.requestFormat } : {}),
      ...(endpoint.responseFormat && endpoint.responseFormat !== DEFAULT_HEADERS.Accept
        ? { Accept: endpoint.responseFormat }
        : {}),
    };
    const endpointConfig = {
      ...(params.length > 0 ? { params } : {}),
      ...(Object.keys(headers).length ? { headers } : {}),
    };

    if (Object.keys(endpointConfig).length === 0) {
      return "";
    }

    return getHbsTemplateDelegate({ templateName: "endpoint-config", partialTemplate: true })({ endpointConfig });
  });
}

function registerGenerateQueryKeysHelper() {
  Handlebars.registerHelper(PartialsHelpers.QUERY_KEYS, (endpoints: Endpoint[]) =>
    getHbsTemplateDelegate({ templateName: "query-keys", partialTemplate: true })({ endpoints }),
  );
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
