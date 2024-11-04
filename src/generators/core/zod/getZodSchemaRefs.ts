import { SchemaResolver } from "../SchemaResolver.class";

export function getZodSchemaRefs({ resolver, zodSchemaName }: { resolver: SchemaResolver; zodSchemaName: string }) {
  const schemaRef = resolver.getRefByZodSchemaName(zodSchemaName);
  if (schemaRef) {
    return Array.from(resolver.dependencyGraph.refsDependencyGraph[schemaRef] ?? []).map((ref) =>
      resolver.getZodSchemaNameByRef(ref),
    );
  }

  const zodSchema = resolver.getDiscriminatorZodSchemaByZodSchemaName(zodSchemaName);
  if (zodSchema) {
    return zodSchema.children
      .filter((child) => child.ref)
      .map((child) => child.ref && resolver.getZodSchemaNameByRef(child.ref)) as string[];
  }

  return [];
}
