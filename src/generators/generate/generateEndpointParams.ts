import Handlebars from "handlebars";
import { Endpoint } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import { setEndpointParamsHelper } from "../utils/handlebars.utils";

export function generateEndpointParams(endpoint: Endpoint, options: GenerateOptions) {
  const template = readHbsTemplateSync("endpoint-params");

  setEndpointParamsHelper(options);

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({ endpoint });
}
