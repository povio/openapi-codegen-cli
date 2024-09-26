import Handlebars from "handlebars";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import {
  setEndpointNameHelper,
  setEndpointParamsHelper,
  setGenerateEndpointArgsHelper,
  setGenerateEndpointParamsHelper,
} from "../utils/handlebars.utils";

export function generateQueryKeys(endpoints: Endpoint[], options: GenerateOptions) {
  const template = readHbsTemplateSync("query-keys");

  setEndpointNameHelper();
  setGenerateEndpointParamsHelper(options);
  setGenerateEndpointArgsHelper(options);
  setEndpointParamsHelper(options);

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({ endpoints });
}
