import { sortObjKeysFromArray, topologicalSort } from "src/generators/utils/sort.utils";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";

export function sortZodSchemasByTopology(resolver: SchemaResolver, zodSchemas: Record<string, string>) {
  const zodSchemasOrderedByDependencies = topologicalSort(resolver.dependencyGraph.deepDependencyGraph).map((ref) =>
    resolver.getZodSchemaNameByRef(ref),
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
