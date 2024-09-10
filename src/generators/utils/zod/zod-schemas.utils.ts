import { OpenAPIV3 } from "openapi-types";
import { OpenAPISchemaResolver } from "src/generators/types/context";
import { ZodSchemasOptions } from "src/generators/types/options";
import { getOpenAPISchemaDependencyGraph } from "../openapi/openapi-schema-dependency-graph.utils";
import { normalizeString } from "../openapi/openapi.utils";
import { sortObjKeysFromArray, topologicalSort } from "../sort.utils";
import { getZodSchema } from "./zod-schema-extraction.utils";

export function getZodSchemasFromOpenAPIDocSchemas({
  resolver,
  docSchemas,
  options,
}: {
  resolver: OpenAPISchemaResolver;
  docSchemas: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
  options: ZodSchemasOptions;
}) {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(docSchemas).forEach(([name, schema]) => {
    if (!zodSchemas[name]) {
      zodSchemas[name] = getZodSchema({
        schema,
        ctx: { resolver, zodSchemas: {}, schemas: {} },
        options,
      }).toString();
    }
  });

  return zodSchemas;
}

export function wrapCircularZodSchemasWithLazy({
  resolver,
  zodSchemas,
  dependencyGraph,
}: {
  resolver: OpenAPISchemaResolver;
  zodSchemas: Record<string, string>;
  dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;
}) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.resolveSchemaName(name)?.ref;
    const isCircular = ref && dependencyGraph.deepDependencyGraph[ref]?.has(ref);
    schemas[normalizeString(name)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
}

export function sortZodSchemasByTopology({
  resolver,
  zodSchemas,
  dependencyGraph,
}: {
  resolver: OpenAPISchemaResolver;
  zodSchemas: Record<string, string>;
  dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;
}) {
  const zodSchemasOrderedByDependencies = topologicalSort(dependencyGraph.deepDependencyGraph).map(
    (ref) => resolver.resolveRef(ref).name,
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
