import { getNotAllowedCircularSchemaError } from "src/generators/utils/validation.utils";
import { getZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";

export function wrapCircularZodSchemas(resolver: SchemaResolver, zodSchemas: Record<string, string>) {
  const schemas = {} as Record<string, string>;

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.getRefByZodSchemaName(name);
    const isCircular = ref && resolver.isSchemaCircular(ref);
    if (isCircular) {
      resolver.validationErrors.push(
        getNotAllowedCircularSchemaError(resolver.getCircularSchemaChain(ref).join(" -> ")),
      );
      schemas[getZodSchemaName(name, resolver.options.schemaSuffix)] = `z.lazy(() => ${code})`;
    } else {
      schemas[getZodSchemaName(name, resolver.options.schemaSuffix)] = code;
    }
  });

  return schemas;
}
