import { OpenAPIV3 } from "openapi-types";

import { COMPLEXITY_THRESHOLD } from "@/generators/const/openapi.const";
import { getOpenAPISchemaComplexity } from "@/generators/core/openapi/getOpenAPISchemaComplexity";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodSchemaName, isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

import { ZodSchema } from "./ZodSchema.class";

const resolverResolveZodSchemaNameCache = new WeakMap<SchemaResolver, Map<string, string>>();

export function resolveZodSchemaName({
  schema,
  zodSchema,
  fallbackName,
  resolver,
  tag,
}: {
  schema?: OpenAPIV3.SchemaObject;
  zodSchema: ZodSchema;
  fallbackName?: string;
  resolver: SchemaResolver;
  tag: string;
}): string {
  const result = zodSchema.getCodeString();
  const cacheKey = `${zodSchema.ref ?? ""}|${fallbackName ?? ""}|${tag}|${zodSchema.complexity}|${result}`;
  let cacheForResolver = resolverResolveZodSchemaNameCache.get(resolver);
  if (!cacheForResolver) {
    cacheForResolver = new Map();
    resolverResolveZodSchemaNameCache.set(resolver, cacheForResolver);
  }
  const cachedName = cacheForResolver.get(cacheKey);
  if (cachedName) {
    return cachedName;
  }

  if ((!isNamedZodSchema(result) || zodSchema.ref === undefined) && fallbackName) {
    // result is simple enough that it doesn't need to be assigned to a variable
    if (zodSchema.complexity < COMPLEXITY_THRESHOLD) {
      return result;
    }

    // result is complex and would benefit from being re-used
    const zodSchemaName = getZodSchemaName(fallbackName, resolver.options.schemaSuffix);
    while (resolver.getCodeByZodSchemaName(zodSchemaName)) {
      if (resolver.getZodSchemaNamesByCompositeCode(result)?.includes(zodSchemaName)) {
        return zodSchemaName;
      } else if (resolver.getCodeByZodSchemaName(zodSchemaName) === zodSchemaName) {
        return zodSchemaName;
      } else {
        throw new Error(`Can't uniquely resolve zod schema name: ${zodSchemaName}`);
      }
    }

    resolver.setZodSchema(zodSchemaName, result, tag);
    resolver.addZodSchemaForCompositeCode(result, zodSchema, zodSchemaName, schema);

    cacheForResolver.set(cacheKey, zodSchemaName);
    return zodSchemaName;
  }

  // result is a reference to another schema
  let resolvedSchema = resolver.getCodeByZodSchemaName(result);
  if (!resolvedSchema && zodSchema.ref) {
    resolvedSchema = resolver.getCodeByZodSchemaName(resolver.getZodSchemaNameByRef(zodSchema.ref));
  }

  if (zodSchema.ref && resolvedSchema) {
    const complexity = getOpenAPISchemaComplexity(0, resolver.getSchemaByRef(zodSchema.ref));

    // ref result is simple enough that it doesn't need to be assigned to a variable
    if (complexity < COMPLEXITY_THRESHOLD) {
      const resolvedName = resolver.getCodeByZodSchemaName(result)!;
      cacheForResolver.set(cacheKey, resolvedName);
      return resolvedName;
    }

    cacheForResolver.set(cacheKey, result);
    return result;
  }

  if (zodSchema.ref) {
    const resolvedRefName = resolver.getZodSchemaNameByRef(zodSchema.ref);
    cacheForResolver.set(cacheKey, resolvedRefName);
    return resolvedRefName;
  }

  throw new Error(`Invalid ref: ${zodSchema.ref}`);
}
