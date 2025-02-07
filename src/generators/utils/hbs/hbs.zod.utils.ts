import Handlebars from "handlebars";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateOptions } from "../../types/options";
import { getImportedZodSchemaName, getZodSchemaInferedTypeName } from "../generate/generate.zod.utils";

enum ZodHelpers {
  INFERED_TYPE = "zodInferedType",
  IMPORTED_ZOD_SCHEMA_NAME = "importedZodSchemaName",
}

export function registerZodHbsHelpers(resolver: SchemaResolver) {
  registerInferedTypeHelper(resolver.options);
  registerImportedZodSchemaNameHelper(resolver);
}

function registerInferedTypeHelper(options: GenerateOptions) {
  Handlebars.registerHelper(ZodHelpers.INFERED_TYPE, (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, options),
  );
}

function registerImportedZodSchemaNameHelper(resolver: SchemaResolver) {
  Handlebars.registerHelper(ZodHelpers.IMPORTED_ZOD_SCHEMA_NAME, (zodSchemaName: string) =>
    getImportedZodSchemaName(resolver, zodSchemaName),
  );
}
