import { GenerateOptions } from "../../types/options";
import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodSchema } from "./getZodSchema";

export function getZodSchemasFromOpenAPIDoc(resolver: SchemaResolver, options: GenerateOptions) {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(resolver.openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) => {
    const zodSchemaName = getZodSchemaName(name, options.schemaSuffix);
    if (!zodSchemas[zodSchemaName]) {
      const tag = resolver.getTagByZodSchemaName(zodSchemaName);
      zodSchemas[zodSchemaName] = getZodSchema({
        schema,
        resolver,
        tag,
        options,
      }).getCodeString(tag, options);
    }
  });

  return zodSchemas;
}
