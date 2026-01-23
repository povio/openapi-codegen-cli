import { EnumZodSchemaData, SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { getZodSchemaName } from "src/generators/utils/zod-schema.utils";

import { getEnumZodSchemaCode, getZodSchema } from "./getZodSchema";

export function getZodSchemasFromOpenAPIDoc(resolver: SchemaResolver) {
  const zodSchemas = {} as Record<string, string>;
  const enumZodSchemas = {} as Record<string, string>;

  Object.entries(resolver.openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) => {
    const schemaData = resolver.getSchemaDataByName(name);
    if (
      resolver.options.excludeRedundantZodSchemas &&
      (!schemaData || (schemaData.deepRefOperations.length === 0 && schemaData.tags.length === 0))
    ) {
      return;
    }

    const zodSchemaName = getZodSchemaName(name, resolver.options.schemaSuffix);
    if (zodSchemas[zodSchemaName]) {
      return;
    }

    const tag = resolver.getTagByZodSchemaName(zodSchemaName);
    const schemaObject = resolver.resolveObject(schema);
    if (schemaObject.enum) {
      enumZodSchemas[zodSchemaName] = getEnumZodSchemaCode(schemaObject);
    } else {
      zodSchemas[zodSchemaName] = getZodSchema({
        schema,
        resolver,
        tag,
      }).getCodeString(tag);
    }
  });

  return { zodSchemas, enumZodSchemas };
}

export function getEnumZodSchemasFromOpenAPIDoc(resolver: SchemaResolver) {
  const enumZodSchemas: EnumZodSchemaData[] = [];

  Object.entries(resolver.openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) => {
    const zodSchemaName = getZodSchemaName(name, resolver.options.schemaSuffix);
    const schemaObject = resolver.resolveObject(schema);
    if (!enumZodSchemas.find((enumZodSchema) => enumZodSchema.zodSchemaName === zodSchemaName) && schemaObject.enum) {
      enumZodSchemas.push({ zodSchemaName, code: getEnumZodSchemaCode(schemaObject) });
    }
  });

  return enumZodSchemas;
}
