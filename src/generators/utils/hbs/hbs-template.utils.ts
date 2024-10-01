import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateOptions } from "../../types/options";
import { readHbsTemplateSync } from "../file.utils";
import { registerCommonHbsHelpers } from "./hbs.common.utils";
import { registerEndpointsHbsHelpers } from "./hbs.endpoints.utils";
import { registerPartialsHbsHelpers } from "./hbs.partials.utils";
import { registerQueryHbsHelpers } from "./hbs.query.utils";
import { registerZodHbsHelpers } from "./hbs.zod.utils";

export function getHbsTemplateDelegate({
  resolver,
  templateName,
  options,
}: {
  resolver: SchemaResolver;
  templateName: string;
  options: GenerateOptions;
}) {
  const template = readHbsTemplateSync(templateName);

  registerCommonHbsHelpers();
  registerZodHbsHelpers(resolver, options);
  registerEndpointsHbsHelpers(resolver, options);
  registerQueryHbsHelpers();
  registerPartialsHbsHelpers();

  return Handlebars.compile(template);
}

export function getHbsPartialTemplateDelegate(templateName: string) {
  const template = readHbsTemplateSync(`partials/${templateName}`);
  return Handlebars.compile(template);
}
