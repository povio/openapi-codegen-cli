import { ZodSchemasGenerateOptions } from "src/generators/types/options";
import { SchemaResolver } from "../SchemaResolver.class";
import { sortObjKeysFromArray, topologicalSort } from "./sort.utils";
import { getZodSchemaName } from "./zod-schema.utils";

export function wrapCircularZodSchemasWithLazy({
  resolver,
  zodSchemas,
  options,
}: {
  resolver: SchemaResolver;
  zodSchemas: Record<string, string>;
  options: ZodSchemasGenerateOptions;
}) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.getRefByZodSchemaName(name);
    const isCircular = ref && resolver.dependencyGraph.deepDependencyGraph[ref]?.has(ref);
    schemas[getZodSchemaName(name, options.schemaSuffix)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
}

export function sortZodSchemasByTopology({
  resolver,
  zodSchemas,
}: {
  resolver: SchemaResolver;
  zodSchemas: Record<string, string>;
}) {
  const zodSchemasOrderedByDependencies = topologicalSort(resolver.dependencyGraph.deepDependencyGraph).map((ref) =>
    resolver.getZodSchemaNameByRef(ref),
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
