import { SchemaResolver } from "../SchemaResolver.class";
import { ZodSchema } from "./ZodSchema.class";

export function getZodSchemaRefs({ resolver, zodSchemaName }: { resolver: SchemaResolver; zodSchemaName: string }) {
  const schemaRef = resolver.getRefByZodSchemaName(zodSchemaName);
  if (schemaRef) {
    return Array.from(resolver.dependencyGraph.refsDependencyGraph[schemaRef] ?? []).map((ref) =>
      resolver.getZodSchemaNameByRef(ref),
    );
  }

  const zodSchema = resolver.getCompositeZodSchemaByZodSchemaName(zodSchemaName);
  if (zodSchema) {
    return Array.from(getSchemaRefs(zodSchema)).map((schemaRef) =>
      resolver.getZodSchemaNameByRef(schemaRef),
    ) as string[];
  }

  return [];
}

function getSchemaRefs(zodSchema: ZodSchema): Set<string> {
  const refsSet = zodSchema.children.reduce((acc, child) => {
    if (child.ref) {
      acc.add(child.ref);
    }
    if (child.children.length > 0) {
      getSchemaRefs(child).forEach((ref) => acc.add(ref));
    }
    return acc;
  }, new Set<string>());

  return refsSet;
}
