import { OpenAPIV3 } from "openapi-types";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodChain } from "@/generators/core/zod/getZodChain";
import { getZodSchema } from "@/generators/core/zod/getZodSchema";
import { resolveZodSchemaName } from "@/generators/core/zod/resolveZodSchemaName";
import { ZodSchemaMetaData } from "@/generators/core/zod/ZodSchema.class";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";

type EndpointZodSchemaCache = {
  byObject: WeakMap<object, Map<string, string>>;
  byRef: Map<string, Map<string, string>>;
};

const resolverEndpointZodSchemaCache = new WeakMap<SchemaResolver, EndpointZodSchemaCache>();

function getResolverSchemaCache(resolver: SchemaResolver) {
  let schemaCache = resolverEndpointZodSchemaCache.get(resolver);
  if (!schemaCache) {
    schemaCache = {
      byObject: new WeakMap(),
      byRef: new Map(),
    };
    resolverEndpointZodSchemaCache.set(resolver, schemaCache);
  }
  return schemaCache;
}

function getOrCreateSchemaEntries(
  schemaCache: EndpointZodSchemaCache,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) {
  if (isReferenceObject(schema)) {
    let entries = schemaCache.byRef.get(schema.$ref);
    if (!entries) {
      entries = new Map();
      schemaCache.byRef.set(schema.$ref, entries);
    }
    return entries;
  }

  let entries = schemaCache.byObject.get(schema);
  if (!entries) {
    entries = new Map();
    schemaCache.byObject.set(schema, entries);
  }
  return entries;
}

export function resolveEndpointZodSchema({
  resolver,
  schema,
  meta,
  tag,
  fallbackName,
  composeBeforeResolve,
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  meta: ZodSchemaMetaData;
  tag: string;
  fallbackName?: string;
  composeBeforeResolve: boolean;
}) {
  const schemaCache = getResolverSchemaCache(resolver);
  const entries = getOrCreateSchemaEntries(schemaCache, schema);
  const isRefSchema = isReferenceObject(schema);
  const normalizedFallbackName = isRefSchema ? "" : (fallbackName ?? "");
  const normalizedTag = isRefSchema ? "" : tag;
  const metaKey = `required:${Boolean(meta.isRequired)}|name:${meta.name ?? ""}|parentPartial:${Boolean(meta.isParentPartial)}|fallback:${normalizedFallbackName}|tag:${normalizedTag}|compose:${composeBeforeResolve ? 1 : 0}`;
  const cached = entries.get(metaKey);
  if (cached) {
    return cached;
  }

  const zodSchema = getZodSchema({ schema, resolver, meta, tag });
  const schemaObject = resolver.resolveObject(schema);
  const zodChain = getZodChain({ schema: schemaObject, meta: zodSchema.meta, options: resolver.options });

  const resolved = composeBeforeResolve
    ? resolveZodSchemaName({
        schema: schemaObject,
        zodSchema: zodSchema.assign(zodSchema.getCodeString(tag) + zodChain),
        fallbackName,
        resolver,
        tag,
      })
    : `${resolveZodSchemaName({ schema: schemaObject, zodSchema, fallbackName, resolver, tag })}${zodChain}`;

  entries.set(metaKey, resolved);
  return resolved;
}
