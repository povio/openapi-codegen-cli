import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { sortObjKeysFromArray, topologicalSort } from "@/generators/utils/sort.utils";

export function sortZodSchemasByTopology(resolver: SchemaResolver, zodSchemas: Record<string, string>) {
  const zodSchemasOrderedByDependencies = topologicalSort(resolver.dependencyGraph.deepDependencyGraph).map((ref) =>
    resolver.getZodSchemaNameByRef(ref),
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
