import {
  BODY_SCHEMA_SUFFIX,
  ERROR_RESPONSE_SCHEMA_SUFFIX,
  PARAM_SCHEMA_SUFFIX,
  RESPONSE_SCHEMA_SUFFIX,
} from "../const/zod-schemas.const";
import { normalizeString } from "./openapi.utils";
import { capitalize, removeSuffix, snakeToCamel, suffixIfNeeded } from "./string.utils";

export const getZodSchemaName = (name: string, schemaSuffix: string) =>
  suffixIfNeeded(capitalize(normalizeString(name)), schemaSuffix);

export const isNamedZodSchema = (schema: string) => !schema.startsWith("z.");

export const getBodyZodSchemaName = (operationName: string) => snakeToCamel(`${operationName}_${BODY_SCHEMA_SUFFIX}`);

export const getParamZodSchemaName = (operationName: string, paramName: string) =>
  snakeToCamel(`${operationName}_${paramName}${PARAM_SCHEMA_SUFFIX}`);

export const getMainResponseZodSchemaName = (operationName: string) =>
  snakeToCamel(`${operationName}${RESPONSE_SCHEMA_SUFFIX}`);

export const getErrorResponseZodSchemaName = (operationName: string, statusCode: string) =>
  snakeToCamel(`${operationName}_${statusCode}_${ERROR_RESPONSE_SCHEMA_SUFFIX}`);

export const getZodSchemaInferedTypeName = (zodSchemaName: string, suffix: string) =>
  removeSuffix(zodSchemaName, suffix);
