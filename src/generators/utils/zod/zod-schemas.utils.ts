import { OpenAPIV3 } from "openapi-types";
import { ZodSchemasGenerateOptions } from "src/generators/types/options";
import { OpenAPISchemaResolver } from "../openapi/openapi-schema-resolver.class";
import { sortObjKeysFromArray, topologicalSort } from "../sort.utils";
import { getZodSchema } from "./zod-schema-extraction.utils";
import { getZodSchemaNormalizedName } from "./zod-schema.utils";

export function getZodSchemasFromOpenAPIDocSchemas({
  resolver,
  docSchemas,
  options,
}: {
  resolver: OpenAPISchemaResolver;
  docSchemas: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
  options: ZodSchemasGenerateOptions;
}) {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(docSchemas).forEach(([name, schema]) => {
    const normalized = getZodSchemaNormalizedName(name, options.schemaSuffix);
    if (!zodSchemas[normalized]) {
      zodSchemas[normalized] = getZodSchema({ schema, resolver, options }).toString();
    }
  });

  return zodSchemas;
}

export function wrapCircularZodSchemasWithLazy({
  resolver,
  zodSchemas,
  options,
}: {
  resolver: OpenAPISchemaResolver;
  zodSchemas: Record<string, string>;
  options: ZodSchemasGenerateOptions;
}) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.resolveSchemaName(name)?.ref;
    const isCircular = ref && resolver.dependencyGraph.deepDependencyGraph[ref]?.has(ref);
    schemas[getZodSchemaNormalizedName(name, options.schemaSuffix)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
}

export function sortZodSchemasByTopology({
  resolver,
  zodSchemas,
}: {
  resolver: OpenAPISchemaResolver;
  zodSchemas: Record<string, string>;
}) {
  const zodSchemasOrderedByDependencies = topologicalSort(resolver.dependencyGraph.deepDependencyGraph).map(
    (ref) => resolver.resolveRef(ref).normalized,
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
