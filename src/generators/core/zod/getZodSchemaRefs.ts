import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { ZodSchema } from "./ZodSchema.class";

export function getZodSchemaRefs(resolver: SchemaResolver, zodSchemaName: string) {
  const schemaRef = resolver.getRefByZodSchemaName(zodSchemaName);
  if (schemaRef) {
    const refs = Array.from(resolver.dependencyGraph.refsDependencyGraph[schemaRef] ?? []).map((ref) =>
      resolver.getZodSchemaNameByRef(ref),
    );
    const enumRefs = resolver.getExtractedEnumZodSchemaNamesReferencedBySchemaRef(schemaRef);
    return [...refs, ...enumRefs];
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
    const ref = child.ref ?? child.enumRef;
    if (ref) {
      acc.add(ref);
    }
    if (child.children.length > 0) {
      getSchemaRefs(child).forEach((ref) => acc.add(ref));
    }
    return acc;
  }, new Set<string>());

  return refsSet;
}
