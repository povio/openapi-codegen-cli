import { OpenAPIV3 } from "openapi-types";
import { camelToSpaceSeparated, capitalize } from "src/generators/utils/string.utils";

export function getSchemaDescriptions(schemaObj: OpenAPIV3.SchemaObject) {
  const schemaKeys: (keyof OpenAPIV3.SchemaObject)[] = [
    "minimum",
    "exclusiveMinimum",
    "maximum",
    "exclusiveMaximum",
    "minItems",
    "minLength",
    "minProperties",
    "maxItems",
    "maxLength",
    "maxProperties",
    "default",
    "example",
  ];

  const schemaDescriptions = schemaKeys
    .filter((key) => schemaObj[key])
    .reduce((acc, key) => [...acc, `${capitalize(camelToSpaceSeparated(key))}: \`${schemaObj[key]}\``], [] as string[]);

  return schemaDescriptions;
}
