import { EnumZodSchemaData, SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Profiler } from "@/helpers/profile.helper";
import { getZodSchemaName } from "@/generators/utils/zod-schema.utils";

import { getEnumZodSchemaCode, getZodSchema } from "./getZodSchema";

export function getZodSchemasFromOpenAPIDoc(resolver: SchemaResolver, profiler?: Profiler) {
  const p = profiler ?? new Profiler(false);
  const zodSchemas = {} as Record<string, string>;
  const enumZodSchemas = {} as Record<string, string>;

  Object.entries(resolver.openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) =>
    p.runSync("zod.extract.schemaEntry", () => {
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
        zodSchemas[zodSchemaName] = p.runSync("zod.extract.schemaToCode", () =>
          getZodSchema({
            schema,
            resolver,
            tag,
          }).getCodeString(tag),
        );
      }
    }),
  );

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
