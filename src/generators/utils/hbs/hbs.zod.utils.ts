import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateOptions } from "../../types/options";
import { getImportedZodSchemaName, getZodSchemaInferedTypeName } from "../generate/generate.zod.utils";

enum ZodHelpers {
  ZodInferedType = "zodInferedType",
  ImportedZodSchemaName = "importedZodSchemaName",
}

export function registerZodHbsHelpers(resolver: SchemaResolver) {
  registerInferedTypeHelper(resolver.options);
  registerImportedZodSchemaNameHelper(resolver);
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
