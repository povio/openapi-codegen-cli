import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodSchema } from "./getZodSchema";

export function getZodSchemasFromOpenAPIDoc(resolver: SchemaResolver) {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(resolver.openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) => {
    const zodSchemaName = getZodSchemaName(name, resolver.options.schemaSuffix);
    if (!zodSchemas[zodSchemaName]) {
      const tag = resolver.getTagByZodSchemaName(zodSchemaName);
      zodSchemas[zodSchemaName] = getZodSchema({
        schema,
        resolver,
        tag,
      }).getCodeString(tag);
    }
  });

  return zodSchemas;
}
