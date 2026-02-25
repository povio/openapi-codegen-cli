import Handlebars from "handlebars";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { readHbsTemplateSync } from "@/generators/utils/file.utils";

import { registerAclHbsHelpers } from "./hbs.acl.utils";
import { registerCommonHbsHelpers } from "./hbs.common.utils";
import { registerEndpointsHbsHelpers } from "./hbs.endpoints.utils";
import { registerImportsHbsHelpers } from "./hbs.imports.utils";
import { registerPartialsHbsHelpers } from "./hbs.partials.utils";
import { registerQueryHbsHelpers } from "./hbs.query.utils";
import { registerZodHbsHelpers } from "./hbs.zod.utils";

const registeredResolvers = new WeakSet<SchemaResolver>();
const templateDelegateCache = new Map<string, Handlebars.TemplateDelegate>();
const partialTemplateDelegateCache = new Map<string, Handlebars.TemplateDelegate>();

function registerHelpersIfNeeded(resolver: SchemaResolver) {
  if (registeredResolvers.has(resolver)) {
    return;
  }

  registerCommonHbsHelpers();
  registerImportsHbsHelpers();
  registerZodHbsHelpers(resolver);
  registerEndpointsHbsHelpers(resolver);
  registerQueryHbsHelpers(resolver);
  registerAclHbsHelpers(resolver);
  registerPartialsHbsHelpers(resolver);

  registeredResolvers.add(resolver);
}

export function getHbsTemplateDelegate(resolver: SchemaResolver, templateName: string) {
  registerHelpersIfNeeded(resolver);

  const cachedTemplateDelegate = templateDelegateCache.get(templateName);
  if (cachedTemplateDelegate) {
    return cachedTemplateDelegate;
  }

  const template = readHbsTemplateSync(templateName);
  const templateDelegate = Handlebars.compile(template);
  templateDelegateCache.set(templateName, templateDelegate);
  return templateDelegate;
}

export function getHbsPartialTemplateDelegate(templateName: string) {
  const cachedTemplateDelegate = partialTemplateDelegateCache.get(templateName);
  if (cachedTemplateDelegate) {
    return cachedTemplateDelegate;
  }

  const template = readHbsTemplateSync(`partials/${templateName}`);
  const templateDelegate = Handlebars.compile(template);
  partialTemplateDelegateCache.set(templateName, templateDelegate);
  return templateDelegate;
}
