import { GenerateOptions } from "../../types/options";
import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";

export function wrapCircularZodSchemas({
  resolver,
  zodSchemas,
  options,
}: {
  resolver: SchemaResolver;
  zodSchemas: Record<string, string>;
  options: GenerateOptions;
}) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.getRefByZodSchemaName(name);
    const isCircular = ref && resolver.isSchemaCircular(ref);
    schemas[getZodSchemaName(name, options.schemaSuffix)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
}
