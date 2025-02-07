import { sortObjKeysFromArray, topologicalSort } from "../../utils/sort.utils";
import { SchemaResolver } from "../SchemaResolver.class";

export function sortZodSchemasByTopology(resolver: SchemaResolver, zodSchemas: Record<string, string>) {
  const zodSchemasOrderedByDependencies = topologicalSort(resolver.dependencyGraph.deepDependencyGraph).map((ref) =>
    resolver.getZodSchemaNameByRef(ref),
  );
  const sortedZodSchemas = sortObjKeysFromArray(zodSchemas, zodSchemasOrderedByDependencies);
  return sortedZodSchemas;
}
