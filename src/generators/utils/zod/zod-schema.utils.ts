import { normalizeString } from "../openapi/openapi.utils";
import { capitalize, removeSuffix, suffixIfNeeded } from "../string.utils";

export const getZodSchemaNormalizedName = (name: string, schemaSuffix: string) =>
  suffixIfNeeded(capitalize(normalizeString(name)), schemaSuffix);

export const isNamedZodSchema = (schema: string) => !schema.startsWith("z.");

export const getZodSchemaInferedTypeName = (zodSchemaName: string, suffix: string) =>
  removeSuffix(zodSchemaName, suffix);
