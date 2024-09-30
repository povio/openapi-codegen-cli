import { SchemaResolver } from "../SchemaResolver.class";

export function getZodSchemaRefs({ resolver, zodSchema }: { resolver: SchemaResolver; zodSchema: string }) {
  const schemaRef = resolver.getRefByZodSchemaName(zodSchema);
  if (!schemaRef) {
    return [];
  }

  return Array.from(resolver.dependencyGraph.refsDependencyGraph[schemaRef] ?? []).map((ref) =>
    resolver.getZodSchemaNameByRef(ref),
  );
}
