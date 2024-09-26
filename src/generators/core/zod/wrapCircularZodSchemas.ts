import { ZodSchemasGenerateOptions } from "../../types/options";
import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";

export function wrapCircularZodSchemas({
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
