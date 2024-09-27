import Handlebars from "handlebars";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "./file.utils";
import { registerCommonHbsHelpers } from "./hbs.common.utils";
import { registerEndpointsHbsHelpers } from "./hbs.endpoints.utils";
import { registerPartialsHbsHelpers } from "./hbs.partials.utils";
import { registerQueryHbssHelpers } from "./hbs.query.utils";
import { registerZodHbsHelpers } from "./hbs.zod.utils";

export function getHbsTemplateDelegate({
  templateName,
  partialTemplate,
  options,
}: {
  templateName: string;
  partialTemplate?: boolean;
  options?: GenerateOptions;
}) {
  templateName = partialTemplate ? `partials/${templateName}` : templateName;
  const template = readHbsTemplateSync(templateName);

  if (!partialTemplate && options) {
    registerCommonHbsHelpers(options);
    registerZodHbsHelpers(options);
    registerEndpointsHbsHelpers(options);
    registerQueryHbssHelpers(options);
    registerPartialsHbsHelpers();
  }

  return Handlebars.compile(template);
}
