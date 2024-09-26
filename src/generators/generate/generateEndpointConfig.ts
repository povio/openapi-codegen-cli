import Handlebars from "handlebars";
import { DEFAULT_ACCEPT, DEFAULT_CONTENT_TYPE } from "../const/endpoints.const";
import { Endpoint } from "../types/endpoint";
import { readHbsTemplateSync } from "../utils/file.utils";

export function generateEndpointConfig(endpoint: Endpoint) {
  const template = readHbsTemplateSync("endpoint-config");

  const params = endpoint.parameters.filter((param) => param.type === "Query");
  const headers = {
    ...(endpoint.requestFormat !== DEFAULT_CONTENT_TYPE ? { "Content-Type": endpoint.requestFormat } : {}),
    ...(endpoint.responseFormat && endpoint.responseFormat !== DEFAULT_ACCEPT
      ? { Accept: endpoint.responseFormat }
      : {}),
  };
  const endpointConfig = {
    ...(params.length > 0 ? { params } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
  };

  const hbsTemplate = Handlebars.compile(template);

  if (Object.keys(endpointConfig).length === 0) {
    return "";
  }

  return hbsTemplate({ endpointConfig });
}
