import Handlebars from "handlebars";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import {
  setEndpointNameHelper,
  setEndpointParamsHelper,
  setGenerateEndpointArgsHelper,
  setGenerateEndpointParamsHelper,
  setHasMoreThanOneParameterHelper,
  setQueryNameHelper,
} from "../utils/handlebars.utils";

export function generateQuery(endpoint: Endpoint, options: GenerateOptions) {
  let template: string;

  if (endpoint.method === "get") {
    template = readHbsTemplateSync("query-use-query");
  } else {
    template = readHbsTemplateSync("query-use-mutation");

    setHasMoreThanOneParameterHelper();
  }

  setQueryNameHelper();
  setEndpointNameHelper();
  setEndpointParamsHelper(options);
  setGenerateEndpointParamsHelper(options);
  setGenerateEndpointArgsHelper(options);

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({ endpoint });
}
