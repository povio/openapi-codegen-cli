import { OpenAPIV3 } from "openapi-types";
import { COMPLEXITY_THRESHOLD } from "src/generators/const/openapi.const";
import { GenerateOptions } from "src/generators/types/options";
import { getZodSchemaName, isNamedZodSchema } from "src/generators/utils/zod-schema.utils";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";
import { SchemaResolver } from "../SchemaResolver.class";
import { ZodSchema } from "./ZodSchema.class";

export function resolveZodSchemaName({
  schema,
  zodSchema,
  fallbackName,
  resolver,
  tag,
  options,
}: {
  schema?: OpenAPIV3.SchemaObject;
  zodSchema: ZodSchema;
  fallbackName?: string;
  resolver: SchemaResolver;
  tag: string;
  options: GenerateOptions;
}): string {
  const result = zodSchema.getCodeString();

  if ((!isNamedZodSchema(result) || zodSchema.ref === undefined) && fallbackName) {
    // result is simple enough that it doesn't need to be assigned to a variable
    if (zodSchema.complexity < COMPLEXITY_THRESHOLD) {
      return result;
    }

    const zodSchemaName = getZodSchemaName(fallbackName, options.schemaSuffix);

    // result is complex and would benefit from being re-used
    let formattedZodSchemaName = zodSchemaName;

    // iteratively add suffix number to prevent overwriting
    let reuseCount = 1;
    while (resolver.getCodeByZodSchemaName(formattedZodSchemaName)) {
      if (resolver.getZodSchemaNamesByDiscriminatorCode(result)?.includes(formattedZodSchemaName)) {
        return formattedZodSchemaName;
      } else if (resolver.getCodeByZodSchemaName(formattedZodSchemaName) === zodSchemaName) {
        return formattedZodSchemaName;
      } else {
        reuseCount += 1;
        formattedZodSchemaName = `${zodSchemaName}__${reuseCount}`;
      }
    }

    resolver.setZodSchema(formattedZodSchemaName, result, tag);
    resolver.addZodSchemaForDiscriminatorCode(result, zodSchema, formattedZodSchemaName, schema);

    return formattedZodSchemaName;
  }

  // result is a reference to another schema
  let resolvedSchema = resolver.getCodeByZodSchemaName(result);
  if (!resolvedSchema && zodSchema.ref) {
    resolvedSchema = resolver.getCodeByZodSchemaName(resolver.getZodSchemaNameByRef(zodSchema.ref));
  }

  if (zodSchema.ref && resolvedSchema) {
    const complexity = getOpenAPISchemaComplexity({ current: 0, schema: resolver.getSchemaByRef(zodSchema.ref) });

    // ref result is simple enough that it doesn't need to be assigned to a variable
    if (complexity < COMPLEXITY_THRESHOLD) {
      return resolver.getCodeByZodSchemaName(result)!;
    }

    return result;
  }

  throw new Error("Invalid ref: " + zodSchema.ref);
}
