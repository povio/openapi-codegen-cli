import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";

export function wrapCircularZodSchemas(resolver: SchemaResolver, zodSchemas: Record<string, string>) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.getRefByZodSchemaName(name);
    const isCircular = ref && resolver.isSchemaCircular(ref);
    schemas[getZodSchemaName(name, resolver.options.schemaSuffix)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
}
