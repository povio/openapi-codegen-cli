import { OpenAPIV3 } from "openapi-types";

import { camelToSpaceSeparated, capitalize } from "@/generators/utils/string.utils";

const schemaDescriptionsCache = new WeakMap<OpenAPIV3.SchemaObject, string[]>();

export function getSchemaDescriptions(schemaObj: OpenAPIV3.SchemaObject) {
  const cachedSchemaDescriptions = schemaDescriptionsCache.get(schemaObj);
  if (cachedSchemaDescriptions) {
    return cachedSchemaDescriptions;
  }

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
    .filter((key) => schemaObj[key] !== undefined)
    .reduce((acc, key) => [...acc, `${capitalize(camelToSpaceSeparated(key))}: \`${schemaObj[key]}\``], [] as string[]);

  schemaDescriptionsCache.set(schemaObj, schemaDescriptions);
  return schemaDescriptions;
}
