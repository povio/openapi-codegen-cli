import Handlebars from "handlebars";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { GenerateZodSchemaData } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import {
  getImportedZodSchemaInferedTypeName,
  getImportedZodSchemaName,
  getZodSchemaDescription,
  getZodSchemaInferedTypeName,
  getZodSchemaPropertyDescriptions,
  getZodSchemaType,
} from "@/generators/utils/generate/generate.zod.utils";

enum ZodHelpers {
  ZodInferedType = "zodInferedType",
  ImportedZodSchemaName = "importedZodSchemaName",
  ImportedZodSchemaInferedType = "importedZodSchemaInferedType",
  ZodSchemaType = "zodSchemaType",
  ZodSchemaDescription = "zodSchemaDescription",
  ZodSchemaPropertyDescriptions = "zodSchemaPropertyDescriptions",
}

export function registerZodHbsHelpers(resolver: SchemaResolver) {
  registerInferedTypeHelper(resolver.options);
  registerImportedZodSchemaNameHelper(resolver);
  registerImportedZodSchemaInferedTypeHelper(resolver);
  registerZodSchemaTypeHelper();
  registerZodSchemaDescriptionHelper();
  registerZodSchemaPropertyDescriptionsHelper(resolver);
}

function registerInferedTypeHelper(options: GenerateOptions) {
  Handlebars.registerHelper(ZodHelpers.ZodInferedType, (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, options),
  );
}

function registerImportedZodSchemaNameHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(ZodHelpers.ImportedZodSchemaName, (zodSchemaName: string) =>
    getImportedZodSchemaName(resolver, zodSchemaName),
  );
}

function registerImportedZodSchemaInferedTypeHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(ZodHelpers.ImportedZodSchemaInferedType, (zodSchemaName: string) =>
    getImportedZodSchemaInferedTypeName(resolver, zodSchemaName),
  );
}

function registerZodSchemaTypeHelper() {
  Handlebars.registerHelper(ZodHelpers.ZodSchemaType, (zodSchemaData: GenerateZodSchemaData) =>
    getZodSchemaType(zodSchemaData),
  );
}

function registerZodSchemaDescriptionHelper() {
  Handlebars.registerHelper(ZodHelpers.ZodSchemaDescription, (zodSchemaData: GenerateZodSchemaData) =>
    getZodSchemaDescription(zodSchemaData),
  );
}

function registerZodSchemaPropertyDescriptionsHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(
    ZodHelpers.ZodSchemaPropertyDescriptions,
    (zodSchemaData: GenerateZodSchemaData, tag: string) =>
      getZodSchemaPropertyDescriptions(resolver, zodSchemaData, tag),
  );
}
