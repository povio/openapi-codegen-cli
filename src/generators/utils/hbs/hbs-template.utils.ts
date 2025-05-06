import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { readHbsTemplateSync } from "../file.utils";
import { registerAclHbsHelpers } from "./hbs.acl.utils";
import { registerCommonHbsHelpers } from "./hbs.common.utils";
import { registerEndpointsHbsHelpers } from "./hbs.endpoints.utils";
import { registerPartialsHbsHelpers } from "./hbs.partials.utils";
import { registerQueryHbsHelpers } from "./hbs.query.utils";
import { registerZodHbsHelpers } from "./hbs.zod.utils";
import { registerImportsHbsHelpers } from "./hbs.imports.utils";

export function getHbsTemplateDelegate(resolver: SchemaResolver, templateName: string) {
  const template = readHbsTemplateSync(templateName);

  registerCommonHbsHelpers();
  registerImportsHbsHelpers();
  registerZodHbsHelpers(resolver);
  registerEndpointsHbsHelpers(resolver);
  registerQueryHbsHelpers();
  registerAclHbsHelpers();
  registerPartialsHbsHelpers(resolver);

  return Handlebars.compile(template);
}

export function getHbsPartialTemplateDelegate(templateName: string) {
  const template = readHbsTemplateSync(`partials/${templateName}`);
  return Handlebars.compile(template);
}
