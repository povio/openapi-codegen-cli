import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "../SchemaResolver.class";
import { ZodSchemasGenerateOptions } from "../types/options";
import { getZodSchemaName } from "../utils/zod-schema.utils";
import { getZodSchema } from "./getZodSchema";

export function getZodSchemasFromOpenAPIDoc({
  resolver,
  openApiDoc,
  options,
}: {
  resolver: SchemaResolver;
  openApiDoc: OpenAPIV3.Document;
  options: ZodSchemasGenerateOptions;
}) {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(openApiDoc.components?.schemas ?? {}).forEach(([name, schema]) => {
    const zodSchemaName = getZodSchemaName(name, options.schemaSuffix);
    if (!zodSchemas[zodSchemaName]) {
      zodSchemas[zodSchemaName] = getZodSchema({ schema, resolver, options }).toString();
    }
  });

  return zodSchemas;
}
